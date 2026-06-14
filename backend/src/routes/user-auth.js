import { createDatabase } from "../db/index.js";
import { EmailService } from "../services/email.js";
import { generateOTP, hashOTP } from "../utils/otp.js";
import { generateToken, verifyToken, authenticateToken, authenticateUser, authenticateAdminOrUser, hashPassword, comparePassword } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { authRateLimiter, emailRateLimiter } from "../middleware/rateLimiter.js";

export function setupUserAuthRoutes(app) {
  app.use("/api/auth/*", authRateLimiter());
  // User Signup
  app.post("/api/auth/signup", catchAsync(async (c) => {
    try {
      const { name, email, password, phone, verificationToken } = await c.req.json();
      
      if (!name || !email || !password) {
        return c.json({
          success: false,
          error: "Missing required fields: name, email, password"
        }, 400);
      }
      
      if (password.length < 8) {
        return c.json({
          success: false,
          error: "Password must be at least 8 characters"
        }, 400);
      }
      
      // Verify the OTP verification token
      if (!verificationToken) {
        return c.json({
          success: false,
          error: "Email verification required. Please verify your email via OTP first."
        }, 400);
      }
      
      const verifiedPayload = await verifyToken(verificationToken, c.env?.JWT_SECRET);
      if (!verifiedPayload || verifiedPayload.purpose !== 'signup_verified' || verifiedPayload.email !== email) {
        return c.json({
          success: false,
          error: "Invalid or expired verification. Please verify your email again."
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Check if email exists
      const existingResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingResult.success && existingResult.data.length > 0) {
        return c.json({
          success: false,
          error: "Email already exists"
        }, 409);
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      const now = new Date().toISOString();
      
      // Create user with optional phone
      const insertResult = await db.query(`
        INSERT INTO users (name, email, password, phone, provider, last_login, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'email', $5, $6, $7)
        RETURNING *
      `, [name, email, hashedPassword, phone || null, now, now, now]);
      
      if (!insertResult.success || insertResult.data.length === 0) {
        throw new Error('Failed to create user');
      }
      
      const user = insertResult.data[0];
      
      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }, c.env?.JWT_SECRET);
      
      // Send welcome email (non-blocking)
      EmailService.sendWelcomeEmail({ name: user.name, email: user.email }, c.env)
        .then(result => {
          if (result.success) {
            console.log('✅ Welcome email sent to:', user.email);
          } else {
            console.warn('⚠️ Welcome email failed:', result.error);
          }
        })
        .catch(err => console.error('❌ Welcome email error:', err));
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        },
        token
      }, 201);
    } catch (error3) {
      console.error('Signup error:', error3);
      return c.json({
        success: false,
        error: 'Failed to create account'
      }, 500);
    }
  }));
  
  // User Login
  app.post("/api/auth/login", catchAsync(async (c) => {
    try {
      const { email, password } = await c.req.json();
      
      if (!email || !password) {
        return c.json({
          success: false,
          error: "Missing email or password"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Find user
      const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          error: "Invalid credentials"
        }, 401);
      }
      
      const user = userResult.data[0];
      
      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return c.json({
          success: false,
          error: "Invalid credentials"
        }, 401);
      }
      
      // Update last login
      const now = new Date().toISOString();
      await db.query('UPDATE users SET last_login = $1, updated_at = $2 WHERE id = $3', [now, now, user.id]);
      
      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }, c.env?.JWT_SECRET);
      
      // Send login alert email (non-blocking)
      const loginInfo = {
        ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'Unknown',
        userAgent: c.req.header('User-Agent') || 'Unknown'
      };
      EmailService.sendLoginAlert({ name: user.name, email: user.email }, c.env, loginInfo)
        .then(result => {
          if (result.success) {
            console.log('✅ Login alert email sent to:', user.email);
          } else {
            console.warn('⚠️ Login alert email failed:', result.error);
          }
        })
        .catch(err => console.error('❌ Login alert email error:', err));
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: now
        },
        token
      });
    } catch (error3) {
      console.error('Login error:', error3);
      return c.json({
        success: false,
        error: 'Login failed'
      }, 500);
    }
  }));
  
  // ============================================
  // OTP ROUTES
  // ============================================
  
  // Request OTP for verification/login
  app.post("/api/auth/request-otp", emailRateLimiter({ max: 3 }), catchAsync(async (c) => {
    try {
      const { email: rawEmail, purpose = 'verification' } = await c.req.json();
      
      if (!rawEmail) {
        return c.json({
          success: false,
          error: 'Email is required'
        }, 400);
      }
      
      // Normalize email - lowercase and trim
      const email = rawEmail.toLowerCase().trim();
      
      const db = createDatabase(c.env);
      
      // Check if user exists (case-insensitive)
      const userResult = await db.query('SELECT * FROM users WHERE LOWER(email) = $1', [email]);
      
      // For signup: Ensure email is NOT already registered
      if (purpose === 'signup' && userResult.success && userResult.data.length > 0) {
        return c.json({
          success: false,
          error: 'An account with this email already exists. Please login instead.'
        }, 409);
      }
      
      // For other purposes (login, password-reset): Ensure email exists
      if (purpose !== 'signup' && (!userResult.success || userResult.data.length === 0)) {
        return c.json({
          success: false,
          error: 'No account found with this email'
        }, 404);
      }
      
      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes
      const now = new Date().toISOString();
      
      // Store OTP in database (create table if not exists)
      try {
        await db.query(`
          CREATE TABLE IF NOT EXISTS otp_codes (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(64) NOT NULL,
            purpose VARCHAR(50) DEFAULT 'verification',
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `);
      } catch (tableErr) {
        console.log('OTP table check:', tableErr.message);
      }
      
      // Try to widen column if needed (safe migration)
      try {
        await db.query(`ALTER TABLE otp_codes ALTER COLUMN otp TYPE VARCHAR(64)`);
      } catch {}
      
      // Clean up all expired OTPs
      await db.query('DELETE FROM otp_codes WHERE expires_at < $1', [now]);
      
      // Delete old (unused) OTPs for this email and purpose
      await db.query(
        'DELETE FROM otp_codes WHERE email = $1 AND purpose = $2',
        [email, purpose]
      );
      
      // Hash OTP before storing
      const otpHash = await hashOTP(otp);
      
      // Insert new OTP hash
      await db.query(
        'INSERT INTO otp_codes (email, otp, purpose, expires_at, created_at) VALUES ($1, $2, $3, $4, $5)',
        [email, otpHash, purpose, expiresAt, now]
      );
      
      // Send OTP email
      const emailResult = await EmailService.sendOTP(email, otp, purpose, c.env);
      
      if (!emailResult.success) {
        return c.json({
          success: false,
          error: 'Failed to send OTP email. Please try again.'
        }, 500);
      }
      
      return c.json({
        success: true,
        message: 'OTP sent successfully to your email',
        expiresIn: 300 // 5 minutes in seconds
      });
    } catch (error3) {
      console.error('Request OTP error:', error3);
      return c.json({
        success: false,
        error: 'Failed to send OTP'
      }, 500);
    }
  }));
  
  // Verify OTP
  app.post("/api/auth/verify-otp", emailRateLimiter({ max: 5 }), catchAsync(async (c) => {
    try {
      const { email, otp, purpose = 'verification' } = await c.req.json();
      
      if (!email || !otp) {
        return c.json({
          success: false,
          error: 'Email and OTP are required'
        }, 400);
      }
      
      const db = createDatabase(c.env);
      const now = new Date().toISOString();
      
      // Hash the user-provided OTP for comparison
      const inputHash = await hashOTP(otp.toString().trim());
      const normalizedEmail = email.toLowerCase().trim();
      
      // Find valid OTP for this email matching the hash
      let otpResult = await db.query(
        `SELECT * FROM otp_codes 
         WHERE email = $1 AND otp = $2 AND purpose = $3 
         AND used = FALSE AND expires_at > $4
         ORDER BY created_at DESC LIMIT 1`,
        [normalizedEmail, inputHash, purpose, now]
      );
      
      // If exact purpose match not found, try any purpose
      if (!otpResult.success || otpResult.data.length === 0) {
        otpResult = await db.query(
          `SELECT * FROM otp_codes 
           WHERE email = $1 AND otp = $2
           AND used = FALSE AND expires_at > $3
           ORDER BY created_at DESC LIMIT 1`,
          [normalizedEmail, inputHash, now]
        );
      }
      
      // Fallback: try plaintext match for OTPs stored before hashing was added
      if (!otpResult.success || otpResult.data.length === 0) {
        otpResult = await db.query(
          `SELECT * FROM otp_codes 
           WHERE email = $1 AND otp = $2 AND purpose = $3 
           AND used = FALSE AND expires_at > $4
           ORDER BY created_at DESC LIMIT 1`,
          [normalizedEmail, otp.toString().trim(), purpose, now]
        );
      }
      if (!otpResult.success || otpResult.data.length === 0) {
        otpResult = await db.query(
          `SELECT * FROM otp_codes 
           WHERE email = $1 AND otp = $2
           AND used = FALSE AND expires_at > $3
           ORDER BY created_at DESC LIMIT 1`,
          [normalizedEmail, otp.toString().trim(), now]
        );
      }
      
      if (!otpResult.success || otpResult.data.length === 0) {
        return c.json({
          success: false,
          error: 'Invalid or expired OTP'
        }, 400);
      }
      
      // Use the purpose from the stored OTP
      const actualPurpose = otpResult.data[0].purpose || purpose;
      
      // Mark OTP as used
      await db.query(
        'UPDATE otp_codes SET used = TRUE WHERE id = $1',
        [otpResult.data[0].id]
      );
      
      // If purpose is login, generate token and return user data
      if (actualPurpose === 'login') {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        
        if (userResult.success && userResult.data.length > 0) {
          const user = userResult.data[0];
          const now = new Date().toISOString();
          
          // Update last login
          await db.query('UPDATE users SET last_login = $1, updated_at = $2 WHERE id = $3', [now, now, user.id]);
          
          // Generate token
          const token = await generateToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
          }, c.env?.JWT_SECRET);
          
          // Send login alert
          const loginInfo = {
            ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'Unknown',
            userAgent: c.req.header('User-Agent') || 'Unknown'
          };
          EmailService.sendLoginAlert({ name: user.name, email: user.email }, c.env, loginInfo)
            .catch(err => console.error('Login alert email error:', err));
          
          return c.json({
            success: true,
            message: 'OTP verified successfully',
            verified: true,
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              provider: user.provider,
              photoUrl: user.photo_url,
              profileImageUrl: user.profile_image_url,
              phone: user.phone,
              bio: user.bio,
              isActive: user.is_active,
              lastLogin: now
            },
            token
          });
        }
      }
      
      // If purpose is signup, generate a verification token
      let verificationToken = null;
      if (actualPurpose === 'signup') {
        verificationToken = await generateToken({
          email: normalizedEmail,
          purpose: 'signup_verified',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 300 // 5 minutes
        }, c.env?.JWT_SECRET);
      }
      
      return c.json({
        success: true,
        message: 'OTP verified successfully',
        verified: true,
        verificationToken
      });
    } catch (error3) {
      console.error('Verify OTP error:', error3);
      return c.json({
        success: false,
        error: 'Failed to verify OTP'
      }, 500);
    }
  }));
  
  // Request password reset
  app.post("/api/auth/forgot-password", emailRateLimiter({ max: 3 }), catchAsync(async (c) => {
    try {
      const { email } = await c.req.json();
      
      if (!email) {
        return c.json({
          success: false,
          error: 'Email is required'
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Check if user exists
      const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      // Always return success to prevent email enumeration
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link'
        });
      }
      
      const user = userResult.data[0];
      
      // Generate reset token
      const resetToken = await generateToken({
        userId: user.id,
        email: user.email,
        purpose: 'password-reset',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      }, c.env?.JWT_SECRET);
      
      // Send password reset email
      await EmailService.sendPasswordResetEmail({ name: user.name, email: user.email }, resetToken, c.env);
      
      return c.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    } catch (error3) {
      console.error('Forgot password error:', error3);
      return c.json({
        success: false,
        error: 'Failed to process request'
      }, 500);
    }
  }));
  
  // Reset password with token
  app.post("/api/auth/reset-password", catchAsync(async (c) => {
    try {
      const { token: resetToken, newPassword } = await c.req.json();
      
      if (!resetToken || !newPassword) {
        return c.json({
          success: false,
          error: 'Token and new password are required'
        }, 400);
      }
      
      if (newPassword.length < 8) {
        return c.json({
          success: false,
          error: 'Password must be at least 8 characters'
        }, 400);
      }
      
      // Verify token
      let decoded;
      try {
        decoded = await verifyToken(resetToken, c.env?.JWT_SECRET);
      } catch (err) {
        return c.json({
          success: false,
          error: 'Invalid or expired reset token'
        }, 400);
      }
      
      if (decoded.purpose !== 'password-reset') {
        return c.json({
          success: false,
          error: 'Invalid reset token'
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      const now = new Date().toISOString();
      
      // Update password
      const updateResult = await db.query(
        'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *',
        [hashedPassword, now, decoded.userId]
      );
      
      if (!updateResult.success || updateResult.data.length === 0) {
        return c.json({
          success: false,
          error: 'Failed to reset password'
        }, 500);
      }
      
      return c.json({
        success: true,
        message: 'Password reset successfully. You can now login with your new password.'
      });
    } catch (error3) {
      console.error('Reset password error:', error3);
      return c.json({
        success: false,
        error: 'Failed to reset password'
      }, 500);
    }
  }));
  
  // Reset password with OTP
  app.post("/api/auth/reset-password-otp", emailRateLimiter({ max: 5 }), catchAsync(async (c) => {
    try {
      const { email, otp, newPassword } = await c.req.json();
      
      if (!email || !otp || !newPassword) {
        return c.json({
          success: false,
          error: 'Email, OTP, and new password are required'
        }, 400);
      }
      
      if (newPassword.length < 8) {
        return c.json({
          success: false,
          error: 'Password must be at least 8 characters'
        }, 400);
      }
      
      const db = createDatabase(c.env);
      
      // Verify OTP is valid for this email
      const now = new Date().toISOString();
      const normalizedEmail = email.toLowerCase().trim();
      const inputHash = await hashOTP(otp.toString().trim());
      
      // Try hashed match first, then plaintext fallback for old entries
      let otpResult = await db.query(
        `SELECT * FROM otp_codes 
         WHERE email = $1 AND otp = $2 AND purpose = 'password-reset'
         AND used = FALSE AND expires_at > $3
         ORDER BY created_at DESC LIMIT 1`,
        [normalizedEmail, inputHash, now]
      );
      if (!otpResult.success || otpResult.data.length === 0) {
        otpResult = await db.query(
          `SELECT * FROM otp_codes 
           WHERE email = $1 AND otp = $2 AND purpose = 'password-reset'
           AND used = FALSE AND expires_at > $3
           ORDER BY created_at DESC LIMIT 1`,
          [normalizedEmail, otp.toString().trim(), now]
        );
      }
      
      if (!otpResult.success || otpResult.data.length === 0) {
        return c.json({
          success: false,
          error: 'Invalid or expired OTP'
        }, 400);
      }
      
      // Mark OTP as used
      await db.query(
        'UPDATE otp_codes SET used = TRUE WHERE id = $1',
        [otpResult.data[0].id]
      );
      
      // Find user by email
      const userResult = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          error: 'User not found'
        }, 404);
      }
      
      const user = userResult.data[0];
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      const updateTime = new Date().toISOString();
      
      // Update password
      const updateResult = await db.query(
        'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING *',
        [hashedPassword, updateTime, user.id]
      );
      
      if (!updateResult.success || updateResult.data.length === 0) {
        return c.json({
          success: false,
          error: 'Failed to reset password'
        }, 500);
      }
      
      return c.json({
        success: true,
        message: 'Password reset successfully. You can now login with your new password.'
      });
    } catch (error3) {
      console.error('Reset password with OTP error:', error3);
      return c.json({
        success: false,
        error: 'Failed to reset password'
      }, 500);
    }
  }));
  
  // Google OAuth
  app.post("/api/auth/google", catchAsync(async (c) => {
    try {
      const { token: googleToken } = await c.req.json();
      
      if (!googleToken) {
        return c.json({
          success: false,
          error: "Missing Google token"
        }, 400);
      }
      
      // Verify Google token
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
      if (!response.ok) {
        return c.json({
          success: false,
          error: "Invalid Google token"
        }, 401);
      }
      
      const googleUser = await response.json();
      const email = googleUser.email;
      const name = googleUser.name;
      const photoUrl = googleUser.picture;
      const googleId = googleUser.sub;
      
      // Verify the token was issued for this app
      const clientId = c.env?.GOOGLE_CLIENT_ID;
      if (clientId && googleUser.aud !== clientId) {
        return c.json({
          success: false,
          error: "Invalid Google token: audience mismatch"
        }, 401);
      }
      
      // Verify the email is confirmed by Google
      if (!googleUser.email_verified) {
        return c.json({
          success: false,
          error: "Google email not verified"
        }, 401);
      }
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const now = new Date().toISOString();
      const existingUserResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      let user = existingUserResult?.data?.[0] || null;
      
      if (user) {
        // Update existing user
        const updateResult = await db.query(`
          UPDATE users SET google_id = $1, photo_url = $2, last_login = $3, updated_at = $4 
          WHERE id = $5 RETURNING *
        `, [googleId, photoUrl, now, now, user.id]);
        user = updateResult?.data?.[0] || null;
      } else {
        // Create new user
        const insertResult = await db.query(`
          INSERT INTO users (name, email, provider, google_id, photo_url, last_login, created_at, updated_at)
          VALUES ($1, $2, 'google', $3, $4, $5, $6, $7) RETURNING *
        `, [name, email, googleId, photoUrl, now, now, now]);
        user = insertResult?.data?.[0] || null;
      }
      
      if (!user) {
        return c.json({
          success: false,
          error: "Failed to create or update user"
        }, 500);
      }
      
      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }, c.env?.JWT_SECRET);
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: now
        },
        token
      });
    } catch (error3) {
      console.error('Google auth error:', error3);
      return c.json({
        success: false,
        error: 'Google authentication failed'
      }, 500);
    }
  }));
  
  // Get Current User
  app.get("/api/auth/me", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const userResult = await db.query('SELECT * FROM users WHERE id = $1', [tokenUser.userId]);
      const user = userResult?.data?.[0] || null;
      
      if (!user) {
        return c.json({
          success: false,
          error: "User not found"
        }, 404);
      }
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        }
      });
    } catch (error3) {
      console.error('Get user error:', error3);
      return c.json({
        success: false,
        error: 'Failed to get user data'
      }, 500);
    }
  }));
  
  // Update Profile
  app.put("/api/auth/profile", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const { name, phone, bio, profile_image_url, old_profile_image_url } = await c.req.json();
      
      console.log('Profile update request:', {
        userId: tokenUser.userId,
        name,
        phone,
        bio,
        profile_image_url,
        old_profile_image_url
      });
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      // Delete old profile image from R2 if a new one is being uploaded
      if (old_profile_image_url && profile_image_url && old_profile_image_url !== profile_image_url) {
        try {
          const oldImageKey = old_profile_image_url.split('/').pop();
          const bucket = c.env.R2_BUCKET;
          if (bucket && oldImageKey) {
            await bucket.delete(`user-profiles/${oldImageKey}`);
            console.log('Old profile image deleted:', oldImageKey);
          }
        } catch (deleteError) {
          console.error('Failed to delete old profile image:', deleteError);
          // Continue with update even if delete fails
        }
      }
      
      const now = new Date().toISOString();
      const updateResult = await db.query(`
        UPDATE users SET name = $1, phone = $2, bio = $3, profile_image_url = $4, updated_at = $5 
        WHERE id = $6 RETURNING *
      `, [name || null, phone || null, bio || null, profile_image_url || null, now, tokenUser.userId]);
      
      console.log('Update result:', {
        success: updateResult?.success,
        rowCount: updateResult?.data?.length,
        error: updateResult?.error
      });
      
      const user = updateResult?.data?.[0] || null;
      
      if (!user) {
        console.error('No user returned after update');
        return c.json({
          success: false,
          error: "Failed to update profile - user not found or no changes made"
        }, 500);
      }
      
      return c.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          provider: user.provider,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          profileImageUrl: user.profile_image_url,
          phone: user.phone,
          bio: user.bio,
          isActive: user.is_active,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login
        }
      });
    } catch (error3) {
      console.error('Update profile error:', error3);
      return c.json({
        success: false,
        error: error3.message || 'Failed to update profile'
      }, 500);
    }
  }));
  
  // Get User Notifications
  app.get("/api/auth/notifications", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const result = await db.query(`
        SELECT * FROM user_notifications 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 50
      `, [tokenUser.userId]);
      
      return c.json({
        success: true,
        data: result.data || []
      });
    } catch (error3) {
      console.error('Get notifications error:', error3);
      return c.json({
        success: false,
        error: 'Failed to fetch notifications'
      }, 500);
    }
  }));
  
  // Mark Notification as Read
  app.put("/api/auth/notifications/:id/read", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const notificationId = c.req.param("id");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      await db.query(`
        UPDATE user_notifications 
        SET is_read = true, read_at = $1 
        WHERE id = $2 AND user_id = $3
      `, [new Date().toISOString(), notificationId, tokenUser.userId]);
      
      return c.json({
        success: true,
        message: "Notification marked as read"
      });
    } catch (error3) {
      console.error('Mark notification read error:', error3);
      return c.json({
        success: false,
        error: 'Failed to mark notification as read'
      }, 500);
    }
  }));
  
  // Mark All Notifications as Read
  app.put("/api/auth/notifications/read-all", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      await db.query(`
        UPDATE user_notifications 
        SET is_read = true, read_at = $1 
        WHERE user_id = $2 AND is_read = false
      `, [new Date().toISOString(), tokenUser.userId]);
      
      return c.json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error3) {
      console.error('Mark all notifications read error:', error3);
      return c.json({
        success: false,
        error: 'Failed to mark notifications as read'
      }, 500);
    }
  }));

  // Delete All Notifications for User
  app.delete("/api/auth/notifications/delete-all", authenticateUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const db = createDatabase(c.env);
      
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      await db.query(`
        DELETE FROM user_notifications 
        WHERE user_id = $1
      `, [tokenUser.userId]);
      
      return c.json({
        success: true,
        message: "All notifications deleted"
      });
    } catch (error3) {
      console.error('Delete all notifications error:', error3);
      return c.json({
        success: false,
        error: 'Failed to delete notifications'
      }, 500);
    }
  }));
  
  // Admin: Get All Users
  app.get("/api/admin/users", authenticateAdminOrUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const adminEmails = ['admin@kalakritam.in', 'gowtham@kalakritam.in'];
      const envAdmins = c.env?.ADMIN_EMAILS?.split(',') || [];
      const allAdmins = [...adminEmails, ...envAdmins];
      
      if (!allAdmins.includes(tokenUser.email?.toLowerCase())) {
        return c.json({
          success: false,
          error: "Unauthorized. Admin access required."
        }, 403);
      }
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      const users = (result?.data || []).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        googleId: user.google_id,
        photoUrl: user.profile_image_url || user.photo_url,
        phone: user.phone,
        bio: user.bio,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login
      }));
      
      // Calculate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(user => 
          user.lastLogin && new Date(user.lastLogin) > thirtyDaysAgo
        ).length,
        googleUsers: users.filter(user => user.provider === 'google').length,
        emailUsers: users.filter(user => user.provider === 'email').length
      };
      
      return c.json({
        success: true,
        data: users,
        stats
      });
    } catch (error3) {
      console.error('Get all users error:', error3);
      return c.json({
        success: false,
        error: 'Failed to get users'
      }, 500);
    }
  }));
  
  // Admin: Delete User
  app.delete("/api/admin/users/:id", authenticateAdminOrUser, catchAsync(async (c) => {
    try {
      const tokenUser = c.get("user");
      const adminEmails = ['admin@kalakritam.in', 'gowtham@kalakritam.in'];
      const envAdmins = c.env?.ADMIN_EMAILS?.split(',') || [];
      const allAdmins = [...adminEmails, ...envAdmins];
      
      if (!allAdmins.includes(tokenUser.email?.toLowerCase())) {
        return c.json({
          success: false,
          error: "Unauthorized. Admin access required."
        }, 403);
      }
      
      const userId = parseInt(c.req.param("id"));
      
      if (tokenUser.userId === userId) {
        return c.json({
          success: false,
          error: "Cannot delete your own account"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      if (!db) {
        return c.json({
          success: false,
          error: "Database not configured"
        }, 500);
      }
      
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
      
      if (!result?.success || !result?.data || result.data.length === 0) {
        return c.json({
          success: false,
          error: "User not found"
        }, 404);
      }
      
      return c.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error3) {
      console.error('Delete user error:', error3);
      return c.json({
        success: false,
        error: 'Failed to delete user'
      }, 500);
    }
  }));
  
  // User Token Refresh
  app.post("/api/auth/refresh", authenticateUser, catchAsync(async (c) => {
    const user = c.get("user");
    try {
      const token = await generateToken({
        userId: user.userId,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      }, c.env?.JWT_SECRET);
      return c.json({
        success: true,
        message: "Token refreshed successfully",
        token,
        data: {
          id: user.userId,
          name: user.name,
          email: user.email
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        error: "Failed to refresh token"
      }, 500);
    }
  }));
}

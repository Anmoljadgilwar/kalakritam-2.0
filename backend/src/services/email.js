// Brevo Email Service
// Environment Variables Required:
// BREVO_USER - Your Brevo login email
// BREVO_KEY - Your Brevo SMTP API key

export const EmailService = {
  // SMTP Configuration
  SMTP_HOST: "smtp-relay.brevo.com",
  SMTP_PORT: 587,
  FROM_EMAIL: "noreply@kalakritam.in",
  FROM_NAME: "Kalakritam",
  LOGO_URL: "https://kalakritam.in/images/logo.png",
  WEBSITE_URL: "https://kalakritam.in",

  // Common email styles
  getBaseStyles() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600&display=swap');
      </style>
    `;
  },

  // Professional email header
  getHeader(title) {
    return `
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background: linear-gradient(180deg, #001a1a 0%, #002828 100%); padding: 50px 40px 40px 40px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <img src="${this.LOGO_URL}" alt="Kalakritam" width="140" style="display: block; border: 0; outline: none;" />
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 12px;">
                      <p style="color: rgba(195, 143, 33, 0.8); font-size: 11px; margin: 0; font-family: 'Lato', Arial, sans-serif; letter-spacing: 3px; text-transform: uppercase;">Manifesting Through Art</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 25px;">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="width: 50px; height: 1px; background-color: rgba(195, 143, 33, 0.3);"></td>
                          <td style="padding: 0 15px;">
                            <h1 style="color: #c38f21; margin: 0; font-size: 22px; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; letter-spacing: 4px; text-transform: uppercase;">${title}</h1>
                          </td>
                          <td style="width: 50px; height: 1px; background-color: rgba(195, 143, 33, 0.3);"></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  },

  // Professional email footer
  getFooter() {
    return `
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background: linear-gradient(180deg, #002828 0%, #001a1a 100%); padding: 40px; border-top: 1px solid rgba(195, 143, 33, 0.12);">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center">
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="width: 30px; height: 1px; background-color: rgba(195, 143, 33, 0.4);"></td>
                          <td style="padding: 0 12px;">
                            <p style="color: #c38f21; font-size: 10px; margin: 0; font-family: 'Lato', Arial, sans-serif; letter-spacing: 3px; text-transform: uppercase;">Manifesting Through Art</p>
                          </td>
                          <td style="width: 30px; height: 1px; background-color: rgba(195, 143, 33, 0.4);"></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 20px;">
                      <p style="color: rgba(212, 175, 133, 0.5); font-size: 11px; margin: 0; font-family: 'Lato', Arial, sans-serif;">
                        © ${new Date().getFullYear()} Kalakritam. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 15px;">
                      <a href="${this.WEBSITE_URL}" style="color: #c38f21; text-decoration: none; font-size: 12px; font-family: 'Lato', Arial, sans-serif;">www.kalakritam.in</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  },

  // Send email using Brevo SMTP via HTTP API
  async send(to, subject, html, env) {
    try {
      const BREVO_API_KEY = env?.BREVO_KEY || env?.BREVO_API_KEY;

      if (!BREVO_API_KEY) {
        console.warn('BREVO_KEY not configured, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: this.FROM_NAME,
            email: this.FROM_EMAIL
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Email sent successfully to:', to);
        return { success: true, messageId: result.messageId };
      } else {
        console.error('Email send failed:', result);
        return { success: false, error: result.message || 'Failed to send email' };
      }
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Welcome email template for new account
  async sendWelcomeEmail(user, env) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Kalakritam</title>
        ${this.getBaseStyles()}
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Lato', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #001a1a;">
          ${this.getHeader('Welcome')}
          <!-- Content -->
          <tr>
            <td style="padding: 50px 45px; background-color: #001a1a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="color: #c38f21; margin: 0 0 25px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500;">Namaste, ${user.name}</h2>
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.9; margin: 0 0 30px 0; font-family: 'Lato', Arial, sans-serif;">
                      Your journey into the world of art begins now. We are delighted to welcome you to the Kalakritam community, where creativity knows no bounds and every brushstroke tells a story.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: rgba(195, 143, 33, 0.06); border-left: 3px solid #c38f21;">
                      <tr>
                        <td style="padding: 28px 30px;">
                          <p style="color: #c38f21; font-size: 12px; margin: 0 0 18px 0; font-family: 'Lato', Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">As a Member, You Can</p>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr><td style="color: rgba(212, 175, 133, 0.85); font-size: 14px; line-height: 2.4; font-family: 'Lato', Arial, sans-serif; padding: 3px 0;">Explore curated artworks from distinguished artists</td></tr>
                            <tr><td style="color: rgba(212, 175, 133, 0.85); font-size: 14px; line-height: 2.4; font-family: 'Lato', Arial, sans-serif; padding: 3px 0;">Reserve your place at exclusive art exhibitions</td></tr>
                            <tr><td style="color: rgba(212, 175, 133, 0.85); font-size: 14px; line-height: 2.4; font-family: 'Lato', Arial, sans-serif; padding: 3px 0;">Participate in workshops to refine your skills</td></tr>
                            <tr><td style="color: rgba(212, 175, 133, 0.85); font-size: 14px; line-height: 2.4; font-family: 'Lato', Arial, sans-serif; padding: 3px 0;">Connect with passionate art enthusiasts</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #c38f21 0%, #a67919 100%); border-radius: 4px;">
                          <a href="${this.WEBSITE_URL}" style="color: #001a1a; padding: 16px 50px; text-decoration: none; font-weight: 600; display: block; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">Begin Your Journey</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${this.getFooter()}
        </table>
      </body>
      </html>
    `;
    return this.send(user.email, 'Welcome to Kalakritam - Your Artistic Journey Begins', html, env);
  },

  // Login alert email template
  async sendLoginAlert(user, env, loginInfo = {}) {
    const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Security Alert</title>
        ${this.getBaseStyles()}
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Lato', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #001a1a;">
          ${this.getHeader('Security Alert')}
          <!-- Content -->
          <tr>
            <td style="padding: 50px 45px; background-color: #001a1a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="color: #c38f21; margin: 0 0 25px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500;">Hello, ${user.name}</h2>
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.9; margin: 0 0 30px 0; font-family: 'Lato', Arial, sans-serif;">
                      A new sign-in to your Kalakritam account was detected. If this was you, no further action is required.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(195, 143, 33, 0.05); border: 1px solid rgba(195, 143, 33, 0.12);">
                      <tr>
                        <td style="padding: 22px 28px; border-bottom: 1px solid rgba(195, 143, 33, 0.1);">
                          <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">Account</p>
                          <p style="color: #d4af85; font-size: 14px; margin: 0; font-family: 'Lato', Arial, sans-serif;">${user.email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 22px 28px; ${loginInfo.ip ? 'border-bottom: 1px solid rgba(195, 143, 33, 0.1);' : ''}">
                          <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">Date & Time</p>
                          <p style="color: #d4af85; font-size: 14px; margin: 0; font-family: 'Lato', Arial, sans-serif;">${loginTime}</p>
                        </td>
                      </tr>
                      ${loginInfo.ip ? `
                      <tr>
                        <td style="padding: 22px 28px;">
                          <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">IP Address</p>
                          <p style="color: #d4af85; font-size: 14px; margin: 0; font-family: 'Lato', Arial, sans-serif;">${loginInfo.ip}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(180, 83, 83, 0.08); border-left: 3px solid #b45353;">
                      <tr>
                        <td style="padding: 18px 24px;">
                          <p style="color: #d4af85; font-size: 13px; line-height: 1.7; margin: 0; font-family: 'Lato', Arial, sans-serif;">
                            <strong style="color: #b45353;">Not you?</strong> If you did not perform this sign-in, we recommend changing your password immediately.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 35px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #c38f21 0%, #a67919 100%); border-radius: 4px;">
                          <a href="${this.WEBSITE_URL}/user/dashboard" style="color: #001a1a; padding: 16px 50px; text-decoration: none; font-weight: 600; display: block; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">View Account</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${this.getFooter()}
        </table>
      </body>
      </html>
    `;
    return this.send(user.email, 'Security Alert - New Sign-in Detected | Kalakritam', html, env);
  },

  // OTP email template
  async sendOTP(email, otp, purpose = 'verification', env) {
    const purposeConfig = {
      'verification': { title: 'Verify Your Email', action: 'verify your email address' },
      'signup': { title: 'Complete Registration', action: 'complete your registration' },
      'login': { title: 'Sign In Verification', action: 'complete your sign-in' },
      'password-reset': { title: 'Reset Password', action: 'reset your password' },
      'account-recovery': { title: 'Account Recovery', action: 'recover your account' }
    };

    const config = purposeConfig[purpose] || purposeConfig['verification'];
    const otpDigits = otp.toString().split('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.title}</title>
        ${this.getBaseStyles()}
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Lato', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #001a1a;">
          ${this.getHeader(config.title)}
          <!-- Content -->
          <tr>
            <td align="center" style="padding: 50px 40px; background-color: #001a1a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.8; margin: 0 0 40px 0; font-family: 'Lato', Arial, sans-serif;">
                      Please use the following verification code to ${config.action}:
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        ${otpDigits.map(digit => `
                        <td style="padding: 0 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="48" height="60">
                            <tr>
                              <td align="center" valign="middle" style="background-color: rgba(195, 143, 33, 0.1); border: 1px solid rgba(195, 143, 33, 0.35); border-radius: 6px; width: 48px; height: 60px;">
                                <span style="color: #c38f21; font-size: 28px; font-weight: 700; font-family: 'Cormorant Garamond', Georgia, serif;">${digit}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        `).join('')}
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 35px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: rgba(195, 143, 33, 0.06); padding: 16px 30px; border-radius: 4px;">
                          <p style="color: rgba(212, 175, 133, 0.7); font-size: 13px; margin: 0; font-family: 'Lato', Arial, sans-serif;">
                            This code will expire in <strong style="color: #c38f21;">5 minutes</strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 30px;">
                    <p style="color: rgba(212, 175, 133, 0.5); font-size: 13px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.8;">
                      If you did not request this code, please disregard this email.<br/>
                      For security, never share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${this.getFooter()}
        </table>
      </body>
      </html>
    `;
    return this.send(email, `${config.title} | Kalakritam`, html, env);
  },

  // Password reset email template
  async sendPasswordResetEmail(user, resetToken, env) {
    const resetLink = `${this.WEBSITE_URL}/user/login?token=${resetToken}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        ${this.getBaseStyles()}
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Lato', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #001a1a;">
          ${this.getHeader('Password Reset')}
          <!-- Content -->
          <tr>
            <td style="padding: 50px 45px; background-color: #001a1a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="color: #c38f21; margin: 0 0 25px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500;">Hello, ${user.name}</h2>
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.9; margin: 0 0 35px 0; font-family: 'Lato', Arial, sans-serif;">
                      We received a request to reset the password associated with your Kalakritam account. Click the button below to create a new password.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 10px 0 35px 0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #c38f21 0%, #a67919 100%); border-radius: 4px;">
                          <a href="${resetLink}" style="color: #001a1a; padding: 16px 50px; text-decoration: none; font-weight: 600; display: block; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">Reset Password</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color: rgba(195, 143, 33, 0.06); padding: 16px 30px; border-radius: 4px;">
                          <p style="color: rgba(212, 175, 133, 0.7); font-size: 13px; margin: 0; font-family: 'Lato', Arial, sans-serif;">
                            This link will expire in <strong style="color: #c38f21;">1 hour</strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 28px;">
                    <p style="color: rgba(212, 175, 133, 0.5); font-size: 13px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.8;">
                      If you did not request a password reset, you can safely ignore this email.<br/>
                      Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${this.getFooter()}
        </table>
      </body>
      </html>
    `;
    return this.send(user.email, 'Reset Your Password | Kalakritam', html, env);
  },

  // Ticket confirmation email
  async sendTicketConfirmation(user, ticket, event, env) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed</title>
        ${this.getBaseStyles()}
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Lato', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #001a1a;">
          ${this.getHeader('Booking Confirmed')}
          <!-- Content -->
          <tr>
            <td style="padding: 50px 45px; background-color: #001a1a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <h2 style="color: #c38f21; margin: 0 0 25px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500;">Thank you, ${user.name}</h2>
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.9; margin: 0 0 35px 0; font-family: 'Lato', Arial, sans-serif;">
                      Your booking has been confirmed. We look forward to welcoming you to this exceptional event.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <!-- Event Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(195, 143, 33, 0.05); border: 1px solid rgba(195, 143, 33, 0.12);">
                      <tr>
                        <td style="padding: 28px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td>
                                <p style="color: #c38f21; font-size: 10px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px; font-family: 'Lato', Arial, sans-serif;">Event</p>
                                <p style="color: #d4af85; font-size: 18px; margin: 0 0 22px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">${event.title}</p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td width="50%" valign="top" style="padding: 15px 10px 15px 0; border-top: 1px solid rgba(195, 143, 33, 0.1);">
                                      <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">Date</p>
                                      <p style="color: #d4af85; font-size: 14px; margin: 0; font-family: 'Lato', Arial, sans-serif;">${event.startDate}</p>
                                    </td>
                                    <td width="50%" valign="top" style="padding: 15px 0 15px 10px; border-top: 1px solid rgba(195, 143, 33, 0.1);">
                                      <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">Venue</p>
                                      <p style="color: #d4af85; font-size: 14px; margin: 0; font-family: 'Lato', Arial, sans-serif;">${event.venue}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 25px;">
                    <!-- Ticket Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(195, 143, 33, 0.03);">
                      <tr>
                        <td width="50%" valign="top" style="padding: 20px 25px; border-right: 1px solid rgba(195, 143, 33, 0.1);">
                          <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">Confirmation No.</p>
                          <p style="color: #c38f21; font-size: 15px; margin: 0; font-family: 'Courier New', monospace; font-weight: 600;">${ticket.id}</p>
                        </td>
                        <td width="50%" valign="top" style="padding: 20px 25px;">
                          <p style="color: rgba(195, 143, 33, 0.7); font-size: 10px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'Lato', Arial, sans-serif;">Quantity</p>
                          <p style="color: #d4af85; font-size: 15px; margin: 0; font-family: 'Lato', Arial, sans-serif;">${ticket.quantity || 1} ticket(s)</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 40px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #c38f21 0%, #a67919 100%); border-radius: 4px;">
                          <a href="${this.WEBSITE_URL}/user/dashboard" style="color: #001a1a; padding: 16px 50px; text-decoration: none; font-weight: 600; display: block; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">View My Bookings</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 30px;">
                    <p style="color: rgba(212, 175, 133, 0.5); font-size: 12px; margin: 0; font-family: 'Lato', Arial, sans-serif;">
                      Please retain this email as your booking confirmation.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${this.getFooter()}
        </table>
      </body>
      </html>
    `;
    return this.send(user.email, `Booking Confirmed - ${event.title} | Kalakritam`, html, env);
  },

  // Newsletter subscription confirmation email
  async sendNewsletterConfirmation(email, env) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Confirmed - Kalakritam</title>
        ${this.getBaseStyles()}
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Lato', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #001a1a;">
          ${this.getHeader('Subscription Confirmed')}
          <!-- Content -->
          <tr>
            <td style="padding: 50px 45px; background-color: #001a1a;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <!-- Main Message -->
                <tr>
                  <td>
                    <h2 style="color: #c38f21; margin: 0 0 20px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500;">Namaste!</h2>
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.9; margin: 0 0 25px 0; font-family: 'Lato', Arial, sans-serif;">
                      Thank you for subscribing to Kalakritam. Your subscription has been confirmed and you are now part of Hyderabad's creative art community.
                    </p>
                    <p style="color: rgba(212, 175, 133, 0.9); font-size: 15px; line-height: 1.9; margin: 0 0 35px 0; font-family: 'Lato', Arial, sans-serif;">
                      We will keep you updated about our weekend art workshops, upcoming events, and creative experiences happening across Hyderabad's cafes and restaurants.
                    </p>
                  </td>
                </tr>

                <!-- What We Offer Section -->
                <tr>
                  <td style="padding: 30px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: rgba(195, 143, 33, 0.04); border: 1px solid rgba(195, 143, 33, 0.1);">
                      <tr>
                        <td style="padding: 28px 30px;">
                          <p style="color: #c38f21; font-size: 11px; margin: 0 0 22px 0; font-family: 'Lato', Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">Explore Kalakritam</p>

                          <!-- Weekend Art Workshops -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 18px;">
                            <tr>
                              <td width="32" valign="top" style="padding-right: 14px; padding-top: 2px;">
                                <div style="width: 24px; height: 24px; border: 1px solid rgba(195, 143, 33, 0.5); border-radius: 3px; text-align: center; line-height: 22px;">
                                  <span style="color: #c38f21; font-size: 12px; font-family: Arial, sans-serif;">&#9998;</span>
                                </div>
                              </td>
                              <td>
                                <p style="color: #d4af85; font-size: 14px; margin: 0 0 4px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">Weekend Art Workshops</p>
                                <p style="color: rgba(212, 175, 133, 0.65); font-size: 12px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.5;">Learn traditional and contemporary art forms in cozy cafes across Hyderabad. All materials provided.</p>
                              </td>
                            </tr>
                          </table>

                          <!-- Art Gallery -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 18px;">
                            <tr>
                              <td width="32" valign="top" style="padding-right: 14px; padding-top: 2px;">
                                <div style="width: 24px; height: 24px; border: 1px solid rgba(195, 143, 33, 0.5); border-radius: 3px; text-align: center; line-height: 22px;">
                                  <span style="color: #c38f21; font-size: 12px; font-family: Arial, sans-serif;">&#9733;</span>
                                </div>
                              </td>
                              <td>
                                <p style="color: #d4af85; font-size: 14px; margin: 0 0 4px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">Curated Art Gallery</p>
                                <p style="color: rgba(212, 175, 133, 0.65); font-size: 12px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.5;">Browse artworks created during our workshops featuring Madhubani, Warli, Tanjore, and contemporary styles.</p>
                              </td>
                            </tr>
                          </table>

                          <!-- Art Events -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 18px;">
                            <tr>
                              <td width="32" valign="top" style="padding-right: 14px; padding-top: 2px;">
                                <div style="width: 24px; height: 24px; border: 1px solid rgba(195, 143, 33, 0.5); border-radius: 3px; text-align: center; line-height: 22px;">
                                  <span style="color: #c38f21; font-size: 12px; font-family: Arial, sans-serif;">&#9670;</span>
                                </div>
                              </td>
                              <td>
                                <p style="color: #d4af85; font-size: 14px; margin: 0 0 4px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">Cultural Art Events</p>
                                <p style="color: rgba(212, 175, 133, 0.65); font-size: 12px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.5;">Join art exhibitions, cultural celebrations, and special creative gatherings in Hyderabad.</p>
                              </td>
                            </tr>
                          </table>

                          <!-- Art Party -->
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td width="32" valign="top" style="padding-right: 14px; padding-top: 2px;">
                                <div style="width: 24px; height: 24px; border: 1px solid rgba(195, 143, 33, 0.5); border-radius: 3px; text-align: center; line-height: 22px;">
                                  <span style="color: #c38f21; font-size: 12px; font-family: Arial, sans-serif;">&#9829;</span>
                                </div>
                              </td>
                              <td>
                                <p style="color: #d4af85; font-size: 14px; margin: 0 0 4px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">Art Party Experiences</p>
                                <p style="color: rgba(212, 175, 133, 0.65); font-size: 12px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.5;">Host private art sessions for birthdays, team outings, or special occasions with guided instruction.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-top: 15px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #c38f21 0%, #a67919 100%); border-radius: 3px;">
                          <a href="${this.WEBSITE_URL}/workshops" style="color: #001a1a; padding: 16px 45px; text-decoration: none; font-weight: 600; display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Lato', Arial, sans-serif;">View Upcoming Workshops</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Contact Info -->
                <tr>
                  <td style="padding-top: 40px; border-top: 1px solid rgba(195, 143, 33, 0.1); margin-top: 30px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding-top: 25px;">
                      <tr>
                        <td>
                          <p style="color: rgba(212, 175, 133, 0.6); font-size: 12px; margin: 0 0 8px 0; font-family: 'Lato', Arial, sans-serif;">
                            Questions? Reach us at <a href="mailto:contact@kalakritam.in" style="color: #c38f21; text-decoration: none;">contact@kalakritam.in</a>
                          </p>
                          <p style="color: rgba(212, 175, 133, 0.4); font-size: 11px; margin: 0; font-family: 'Lato', Arial, sans-serif; line-height: 1.7;">
                            This confirmation was sent to ${email}<br/>
                            <a href="${this.WEBSITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color: rgba(195, 143, 33, 0.6); text-decoration: underline;">Unsubscribe</a> from future emails
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${this.getFooter()}
        </table>
      </body>
      </html>
    `;
    return this.send(email, 'Your Kalakritam Newsletter Subscription is Confirmed', html, env);
  }
};

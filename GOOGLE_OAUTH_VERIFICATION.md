# Google OAuth Verification - Required Changes Summary

## Project Information
- **Project Name:** Kalakritam
- **Project ID:** kalakritam-475619
- **Project Number:** 105634711119
- **Website:** https://kalakritam.in
- **Domain Ownership:** Verified (kalakritam.in)

---

## ✅ Changes Implemented

### 1. **Clear App Purpose Statement on Homepage**
**Location:** Homepage (https://kalakritam.in/home)

**What We Added:**
- A prominent "What is Kalakritam?" section at the top of the homepage
- Clear explanation that Kalakritam is an online platform for discovering and booking art workshops in Hyderabad
- Visible to all users WITHOUT requiring login
- Lists specific features:
  - Browse and register for weekend art workshops
  - Book tickets for cultural events and exhibitions
  - Connect with artists and the local art community
  - Receive personalized notifications about upcoming events
  - Access workshop history and manage bookings

**Files Modified:**
- `src/components/Home/Home.jsx` - Added app purpose banner
- `src/components/Home/Home.css` - Styled the purpose banner

---

### 2. **Google OAuth Data Usage Explanation**
**Location:** Homepage (https://kalakritam.in/home#oauth-info)

**What We Added:**
- Dedicated "Sign In with Google" section explaining:
  - **Why we use Google Sign-In** - Security and convenience
  - **What data we access:**
    - Email address (for account identification and booking confirmations)
    - Name (for personalization and workshop registrations)
    - Profile picture (for user profile display)
  - **How we use the information:**
    - Workshop registration
    - Event notifications
    - Personalized experience
    - Account security
  - **Privacy & Security highlights:**
    - We never access Google password
    - We never share data with third parties for marketing
    - Users can revoke access anytime
    - We comply with Google's API Services User Data Policy

**Files Created:**
- `src/components/Home/GoogleOAuthInfo.jsx` - OAuth information component
- `src/components/Home/GoogleOAuthInfo.css` - Styling for OAuth section

---

### 3. **Updated Privacy Policy**
**Location:** Privacy Policy page (https://kalakritam.in/privacy)

**What We Added:**
- New section "Google OAuth 2.0 Authentication" explaining:
  - Specific data accessed from Google (email, name, profile picture, User ID)
  - Purpose of each data point
  - Statement that we never access Google password or other Google services
  - Link to revoke access: https://myaccount.google.com/permissions
  - Compliance statement with Google API Services User Data Policy
  - Reference to Limited Use requirements

**Files Modified:**
- `src/components/PrivacyPolicy/PrivacyPolicy.jsx`

---

### 4. **Accessibility Requirements**
✅ **Homepage accessible without login** - All information visible to public users
✅ **Privacy Policy accessible without login** - Available at /privacy route
✅ **Clear data usage explanation** - Visible on homepage before sign-in
✅ **Link to Privacy Policy** - Multiple links throughout the site
✅ **Domain verified** - Hosted on kalakritam.in (not third-party platform)

---

## 📋 Checklist for Google OAuth Verification

### Homepage Requirements
- [x] Accurately represents Kalakritam brand
- [x] Fully describes app functionality (art workshop booking platform)
- [x] Explains purpose for requesting user data (workshop registration, notifications, personalization)
- [x] Hosted on verified domain (kalakritam.in)
- [x] Includes link to Privacy Policy
- [x] Visible to users without requiring login
- [x] Clear "What is Kalakritam?" section
- [x] OAuth data usage explanation

### Privacy Policy Requirements
- [x] Accessible without login
- [x] Explains Google OAuth data collection
- [x] Lists specific data accessed (email, name, profile picture)
- [x] Explains purpose of each data point
- [x] Includes revoke access information
- [x] References Google API Services User Data Policy
- [x] States compliance with Limited Use requirements

### OAuth Scopes Requested
- `openid` - User identification
- `profile` - Name and profile picture
- `email` - Email address

**Note:** We only request basic profile information. We do NOT request access to:
- Gmail
- Google Drive
- Google Calendar
- Google Contacts
- Any other sensitive Google services

---

## 🔗 Important Links

### For Users
- **Homepage:** https://kalakritam.in
- **Privacy Policy:** https://kalakritam.in/privacy
- **Terms of Service:** https://kalakritam.in/terms
- **Revoke Access:** https://myaccount.google.com/permissions

### For Google Reviewers
- **App Purpose:** Clearly stated on homepage without login requirement
- **Data Usage:** Explained in OAuth section on homepage
- **Privacy Policy:** Accessible at /privacy with specific Google OAuth section

---

## 📝 Key Messages for Google Review

### App Purpose
"Kalakritam is an online platform that connects art enthusiasts with weekend art workshops, cultural events, and creative experiences in Hyderabad. Users can browse workshops, register for events, book tickets, and connect with the local art community."

### Why We Use Google OAuth
"We use Google OAuth 2.0 to provide users with a secure, convenient authentication method. This allows users to register for workshops and manage their bookings without creating another password."

### Data Usage Transparency
"We access only basic profile information (email, name, profile picture) for the following purposes:
1. Account identification and authentication
2. Workshop registration and booking confirmations
3. Event notifications and updates
4. Personalized user experience and dashboard

We never access your Google password, and we do not request access to Gmail, Drive, Calendar, or any other Google services. All data is used solely for the workshop booking and event management purposes of the Kalakritam platform."

---

## ✅ Compliance with Google API Services User Data Policy

### Limited Use Requirements
- ✅ **Transparency:** Clear explanation of what data we collect and why
- ✅ **Limited Use:** Data used only for stated purposes (workshop booking, notifications)
- ✅ **No Unauthorized Access:** We don't request access to services beyond basic profile
- ✅ **No Sale/Transfer:** User data is never sold or transferred to third parties for marketing
- ✅ **Security:** Secure storage and transmission of user data
- ✅ **Privacy Policy:** Comprehensive privacy policy accessible without login

---

## 🎯 Next Steps

1. **Verify all changes are deployed to production** (https://kalakritam.in)
2. **Test as a new user:**
   - Visit homepage without login
   - Verify "What is Kalakritam?" section is visible
   - Verify OAuth information section is visible
   - Click Privacy Policy link and verify it loads without login
   - Verify Google OAuth section in Privacy Policy
3. **Resubmit to Google Cloud Console:**
   - Navigate to OAuth consent screen configuration
   - Ensure homepage URL is https://kalakritam.in
   - Ensure privacy policy URL is https://kalakritam.in/privacy
   - Submit for verification
4. **Provide this summary in the verification comments**

---

## 📞 Contact Information

**Developer Contact:**
- Email: contact@kalakritam.in
- Website: https://kalakritam.in/contact
- Phone: +91 7032201999

---

## ⚠️ Important Notes

1. All information is now visible **before** users need to sign in
2. Privacy Policy is accessible to **anyone** without login requirement
3. Clear explanation of Google OAuth usage is on the **homepage**
4. We comply with **Limited Use requirements** of Google API Services
5. Users can **revoke access** at any time via Google Account settings

---

Generated on: October 22, 2025
Version: 1.0

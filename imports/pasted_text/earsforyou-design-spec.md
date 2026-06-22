DESIGN A COMPLETE HIGH-FIDELITY MOBILE-FIRST MENTAL HEALTH & EMOTIONAL SUPPORT PLATFORM CALLED "EARSFORYOU"

PROJECT OVERVIEW

Create a production-ready UI/UX design system and full application experience for EarsForYou, a modern mental health, emotional wellness, mood tracking, journaling, affirmation, and self-reflection platform.

The design must be clean, calming, trustworthy, professional, accessible, and scalable.

Inspiration:

- Headspace
- Calm
- BetterHelp
- Notion
- Duolingo

THEME & BRANDING

- Primary Color: #16A34A (Modern Green)
- Secondary Color: White
- Accent Colors: Light Green, Soft Gray
- Success Color: #22C55E
- Warning Color: #F59E0B
- Error Color: #EF4444
- Background Color: #F8FAFC

Design Style:

- Calm
- Modern
- Emotionally Supportive
- Rounded Corners
- Soft Shadows
- Accessible Typography
- WCAG Compliant
- Light Mode
- Dark Mode

Generate:

- Mobile Layouts
- Tablet Layouts
- Desktop Layouts
- Responsive Design
- Auto Layout Everywhere
- Complete Design System
- Reusable Component Library

---

USER MOBILE APPLICATION

1. SPLASH SCREEN

Features:

- EarsForYou Logo
- Animated Loading Indicator
- Green Gradient Background
- App Tagline

---

2. WELCOME / LANDING PAGE

Features:

- Emotional Wellness Illustration
- Welcome Message
- Login Button
- Register Button
- Forgot Password Link
- Recover Account Link

Forgot Password and Recovery must be accessible without login.

---

3. USER LOGIN

Fields:

- Email
- Password

Features:

- Show/Hide Password
- Forgot Password
- Recover Account
- Login Button

API:
POST /api/v1/auth/user-login

---

4. USER REGISTRATION

Fields:

- Full Name
- Email Address
- Strong Password
- Confirm Password
- Gender
  - Male
  - Female
  - Other
  - Prefer Not To Say
- Date of Birth
- Marital Status
  - Single
  - Married
  - Divorced
  - Widowed
  - Prefer Not To Say
- Employment Status
  - Employed
  - Self-Employed
  - Student
  - Unemployed
  - Retired
  - Prefer Not To Say

Password Requirements:

- Minimum 8 Characters
- Uppercase Letter
- Lowercase Letter
- Number
- Special Character

System Logic:

Automatically determine generation using Date of Birth:

- Generation Alpha
- Generation Z
- Millennials
- Generation X
- Baby Boomers

Store generation internally for analytics and affirmation targeting.

Registration Flow:

1. Submit Registration
2. Send OTP
3. Verify OTP
4. Create Account
5. Generate JWT Access Token
6. Generate JWT Refresh Token
7. Redirect To Home Dashboard

API:
POST /api/v1/users/register-user
POST /api/v1/users/verify-user

---

5. OTP VERIFICATION

Features:

- 6 Digit OTP Input
- Resend OTP
- Verify Button
- Countdown Timer

API:
POST /api/v1/users/verify-user

---

6. FORGOT PASSWORD FLOW

Steps:

1. Enter Email
2. Receive OTP
3. Verify OTP
4. Enter New Password
5. Success Confirmation

API:
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password

---

7. ACCOUNT RECOVERY

Screens:

- Initiate Recovery
- Enter OTP
- Recovery Success
- Auto Login

API:
POST /api/v1/auth/recovery/initiate
POST /api/v1/auth/recovery/confirm

---

8. HOME DASHBOARD

Display:

- Personalized Greeting
- Daily Affirmation Card
- Current Mood Summary
- Mood Streak Counter
- Emotional Wellness Score
- Recent Activity

Quick Actions:

- Log Mood
- Write Journal
- View Analytics
- Edit Profile

Cards:

- Today's Mood
- Mood Trend
- Weekly Streak
- Daily Affirmation

API:
GET /api/v1/dashboard/home

---

9. MOOD TRACKING MODULE

Mood Options:

- Happy
- Calm
- Neutral
- Sad
- Anxious
- Stressed

Fields:

- Mood Selection
- Mood Intensity Slider (1–10)
- Optional Notes

Features:

- Save Mood
- Mood History
- Weekly Trends
- Monthly Trends

Analytics:

- Weekly Mood Graph
- Monthly Mood Graph
- Mood Distribution
- Streak Counter
- Emotional Insights

API:
POST /api/v1/mood/log
GET /api/v1/mood/analytics
GET /api/v1/mood/streak

---

10. JOURNAL MODULE

Journal Dashboard:

- Create Entry
- Recent Entries
- Search Entries

Journal Entry Screen:

Fields:

- Title
- Rich Text Content

Actions:

- Save
- Edit
- Delete

History Screen:

- Search Bar
- Date Filter
- Journal List

Detail Screen:

- View Entry
- Update Entry
- Delete Entry

API:
POST /api/v1/journal/entry
GET /api/v1/journal/history
GET /api/v1/journal/retrieve
PUT /api/v1/journal/update-journal
DELETE /api/v1/journal/delete-journal

---

11. PROFILE SCREEN

Display:

- Full Name
- Email
- Gender
- Date Of Birth
- Marital Status
- Employment Status
- Generation

Actions:

- Edit Profile
- Change Password
- Change Email
- Logout
- Delete Account

No profile photo upload functionality.

---

12. CHANGE PASSWORD FLOW

Security Requirements:

Fields:

- Current Password
- New Password
- Confirm Password

Flow:

1. Enter Current Password
2. Enter New Password
3. Receive OTP
4. Verify OTP
5. Password Updated

API:
POST /change-password/initiate
POST /change-password/verify

---

13. CHANGE EMAIL FLOW

Fields:

- Current Password
- New Email

Flow:

1. Enter Current Password
2. Enter New Email
3. Receive OTP
4. Verify OTP
5. Email Updated

API:
POST /change-email/initiate
POST /change-email/verify

---

ADMIN WEB DASHBOARD

Create a responsive web dashboard.

Layout:

- Sidebar Navigation
- Top Navigation
- Main Content Area

Sidebar:

- Overview
- Safety Actions
- Affirmations Manager
- Profile
- Logout

---

OVERVIEW PAGE

KPI Cards:

- Total Platform Logs
- Active Safety Flags
- System Status
- Total Registered Users
- New Users This Week

Charts:

- Platform Activity Chart
- Mood Distribution Chart
- Generation Distribution Chart
- Analytics Graphs

API:
GET /api/v1/admin/management/analytics

Example Data:

{
"totalPlatformLogs": 1420,
"systemStatus": "OPERATIONAL",
"activeSafetyFlags": 3
}

---

SAFETY ACTIONS PAGE

Purpose:

Display anonymized system-generated mental health safety alerts.

Table Columns:

- Flag ID
- Reason
- Severity Score
- Date Created
- Status
- Action

Actions:

- Resolve Flag

API:
GET /api/v1/admin/management/flags
PUT /api/v1/admin/management/flags/{flagId}/resolve

Features:

- Search
- Filter
- Pagination
- Severity Badges
- Empty State
- Loading State

---

AFFIRMATIONS MANAGER

Two Column Layout

LEFT SIDE

Create Affirmation Form

Fields:

- Content Text Area
- Target Audience
- Status

Target Audience Options:

- GLOBAL
- GEN_Z
- MILLENNIALS
- GEN_X
- BABY_BOOMERS

Action:

- Create Affirmation

API:
POST /api/v1/admin/management/affirmations

RIGHT SIDE

Affirmation List

Display:

- Content
- Target Audience
- Status
- Date Created

Actions:

- Edit
- Delete

API:
GET /api/v1/admin/management/affirmations

---

ADMIN PROFILE PAGE

Display:

- Full Name
- Email
- Role

Actions:

- Edit Profile
- Change Email
- Logout

Admin can update email easily.

No profile photo upload functionality.

---

ADMIN SECURITY RULES

Admins CAN:

✓ View analytics
✓ View anonymized safety flags
✓ Resolve flags
✓ Create affirmations
✓ Edit affirmations
✓ Delete affirmations
✓ Edit profile
✓ Change email

Admins CANNOT:

✗ View journal entries
✗ View journal content
✗ View private messages
✗ View emotional conversations
✗ View personal notes
✗ Access confidential mental-health records
✗ Access user chats

All user data remains private.

---

PRIVACY-FIRST ARCHITECTURE

Admin dashboard only receives anonymized analytics.

Visible To Admin:

- Stress trends
- Anxiety trends
- Mood distribution
- Safety flag counts
- Generation distribution

Never Visible To Admin:

- User Names
- User Emails
- Journal Content
- Private Conversations
- Personal Messages
- Therapy Notes

---

DESIGN SYSTEM

Create:

- Color Tokens
- Typography Tokens
- Grid System
- Buttons
- Inputs
- Dropdowns
- Checkboxes
- Cards
- Tables
- Charts
- Modals
- Alerts
- Toast Notifications
- Empty States
- Error States
- Loading States
- Skeleton Loaders

---

BACKEND INTEGRATION

Authentication:

- JWT Access Token
- JWT Refresh Token

State Management:

- User Profile
- Mood Data
- Journal Data
- Dashboard Data
- Analytics Data
- Safety Flags
- Affirmations

Frontend Ready For:

- React
- Next.js
- React Native
- Flutter

Generate realistic sample data, complete user journeys, API-connected screens, mobile responsiveness, tablet responsiveness, desktop responsiveness, dark mode, light mode, and developer-ready handoff specifications.
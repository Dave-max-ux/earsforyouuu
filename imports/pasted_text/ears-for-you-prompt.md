
🚀 FIGMA AI PROMPT — EarsForYou (MOBILE-FIRST MENTAL HEALTH PLATFORM)

Design a complete high-fidelity, mobile-first mental health and emotional wellness platform called EarsForYou.

This is a production-ready, API-driven application focused on mood tracking, journaling, affirmations, self-reflection, and emotional wellbeing.


---

🧠 PROJECT OVERVIEW

EarsForYou is a modern emotional support platform that helps users:

Track daily moods

Write personal journals

Receive affirmations

Monitor emotional wellness

Build mental health awareness over time


The platform must feel:

Safe

Calm

Private

Trustworthy

Non-judgmental



---

🎨 DESIGN SYSTEM

Inspired by:

Headspace

Calm

BetterHelp

Notion

Duolingo



---

🌈 BRANDING

Primary Color: #16A34A
Secondary: White
Background: #F8FAFC
Success: #22C55E
Warning: #F59E0B
Error: #EF4444
Accent: Soft Green + Light Gray


---

🧩 DESIGN STYLE

Calm emotional UI

Rounded corners (12–20px)

Soft shadows

Minimal distractions

WCAG accessibility compliance

Light mode + Dark mode

Mobile-first responsive design



---

⚙️ BACKEND INTEGRATION RULE

Every screen must be designed as API-connected UI:

Format:

UI Component → API Endpoint → Response → Loading/Error States


All screens assume real backend integration (REST API).


---

📱 MOBILE APPLICATION SCREENS


---

1. SPLASH SCREEN

UI:

Animated logo

Soft green gradient background

Loading indicator

Tagline: “Your mind matters”


State:

App initialization loading



---

2. WELCOME SCREEN

UI:

Emotional wellness illustration

App title

Login button

Register button

Forgot password link

Account recovery entry


Navigation:

/login

/register

/forgot-password



---

3. USER LOGIN

Fields:

Email

Password


Features:

Show/hide password

Loading button state

Error messages


API: POST /api/v1/auth/user-login

Response:

accessToken

refreshToken

user object


States:

Loading

Invalid credentials

Network error



---

4. USER REGISTRATION

Fields:

Full Name

Email Address

Password

Confirm Password

Gender

Date of Birth

Marital Status

Employment Status


Password Rules:

8+ characters

Uppercase

Lowercase

Number

Special character


System Logic:

Auto-detect generation:

Gen Z

Millennials

Gen X

Baby Boomers



Flow:

1. Register user


2. Send OTP


3. Verify OTP


4. Create account


5. Generate JWT tokens


6. Redirect to dashboard



API: POST /api/v1/users/register-user
POST /api/v1/users/verify-user


---

5. OTP VERIFICATION

UI:

6-digit OTP input

Countdown timer

Resend OTP button


States:

Expired OTP

Invalid OTP

Loading verification



---

6. FORGOT PASSWORD

Steps:

1. Enter email


2. Receive OTP


3. Verify OTP


4. Reset password



API: POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password


---

7. ACCOUNT RECOVERY

Flow:

Initiate recovery

OTP verification

Auto-login after success


API: POST /api/v1/auth/recovery/initiate
POST /api/v1/auth/recovery/confirm


---

8. HOME DASHBOARD

UI:

Personalized greeting

Daily affirmation card

Mood summary

Wellness score

Streak counter

Recent activity


Quick Actions:

Log mood

Write journal

View analytics

Edit profile


API: GET /api/v1/dashboard/home

States:

Loading skeletons

Empty new user state



---

9. MOOD TRACKING MODULE

Mood Options:

Happy

Calm

Neutral

Sad

Anxious

Stressed


Features:

Mood intensity slider (1–10)

Optional notes

Mood history

Weekly & monthly trends

Streak tracking


API: POST /api/v1/mood/log
GET /api/v1/mood/analytics
GET /api/v1/mood/streak

States:

No data state

Loading charts

Error retry state



---

10. JOURNAL MODULE

UI:

Create journal entry

Search entries

Recent entries list


Editor:

Title

Rich text content


Actions:

Save

Edit

Delete


API: POST /api/v1/journal/entry
GET /api/v1/journal/history
PUT /api/v1/journal/update-journal
DELETE /api/v1/journal/delete-journal

States:

Autosave indicator

Loading entries

Empty journal state



---

11. PROFILE SCREEN

UI:

Full name

Email

Gender

DOB

Marital status

Employment status

Generation


Actions:

Edit profile

Change password

Change email

Logout

Delete account


(No profile images allowed)

API: GET /api/v1/user/profile
PUT /api/v1/user/update


---

12. CHANGE PASSWORD FLOW

Steps:

1. Current password


2. New password


3. OTP verification



API: POST /change-password/initiate
POST /change-password/verify


---

13. CHANGE EMAIL FLOW

Steps:

1. Current password


2. New email


3. OTP verification



API: POST /change-email/initiate
POST /change-email/verify


---

14. ANALYTICS SCREEN (USER ONLY)

UI:

Mood trends graph

Wellness score

Weekly activity chart


API: GET /api/v1/mood/analytics

States:

No data yet

Loading charts



---

🧠 DESIGN SYSTEM

Reusable components:

Buttons (primary, secondary, danger)

Inputs (text, password, OTP)

Cards (mood, journal, affirmation)

Charts (line, bar, pie)

Modals

Toast notifications

Skeleton loaders

Empty states

Error states

Navigation bars



---

🌙 DARK MODE SUPPORT

Dark background: #0F172A

Soft dark surfaces

Green accents preserved

Reduced eye strain

Full accessibility support



---

⚡ RESPONSIVE DESIGN

Must support:

Mobile (primary)

Tablet

Desktop (scalable layout)



---

🔐 SECURITY + STATE MANAGEMENT

JWT Access Token

Refresh Token

Auto session refresh

Protected routes

Global error handling

Secure logout flow



---

🧪 SAMPLE DATA REQUIREMENT

Generate realistic mock data for:

Mood logs

Journal entries

Dashboard stats

User analytics



---

🚀 FINAL OUTPUT

Generate:

Full mobile-first UI system

API-connected screens

Complete component library

Light + dark mode

Responsive layouts

Real user journeys

Developer-ready handoff specs

Production-grade design system
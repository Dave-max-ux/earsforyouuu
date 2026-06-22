Keep the existing UI/UX design exactly as it is. Do not change layout, spacing, colors, typography, component hierarchy, animations, screen structure, navigation structure, or any visual styling. All updates must be strictly functional, logical, architectural, security-focused, and data-driven only.

Fix light mode readability issues by improving text contrast where necessary without changing the overall design system, theme, colors, spacing, typography, or styling tokens.

MULTILINGUAL SUPPORT

Implement a language selector within the existing Settings/Profile section without modifying any layout structure.

Supported Languages:

• English
• Nigerian Pidgin

Requirements:

• All application content must dynamically switch between selected languages.
• Translate navigation items, buttons, onboarding flows, affirmations, therapist content, profile screens, notifications, error messages, and all user-facing text.
• Store language preference in localStorage.
• Persist language selection across sessions.
• Use a scalable i18n translation architecture that supports future language additions.

TODAY'S AFFIRMATION CLEANUP

In the Today's Affirmation section:

• Remove all AI logos.
• Remove AI branding.
• Remove AI-generated labels.
• Remove placeholder AI indicators.
• Remove any references that make affirmations appear AI-generated.

Replace them with neutral app-consistent presentation while preserving the exact existing UI layout and styling.

GENERATION-BASED PERSONALIZATION

Replace all age-group categories with generation-based categories.

Supported Categories:

• Generation Alpha (0–16 years)
• Generation Z (17–29 years)
• Millennials (30–45 years)
• Generation X (46–61 years)
• Baby Boomers (62–80 years)

Requirements:

• Automatically determine generation from date of birth.
• Store generation in the user profile.
• Persist generation across sessions.
• Allow profile updates to automatically recalculate generation.

Use generation data to personalize:

• Daily affirmations
• Emotional wellness content
• Educational resources
• Therapist recommendations
• Community content
• Wellness tips
• Dashboard insights
• Mental health guidance

GENERATION CONTENT ENGINE

Without changing the existing UI design, implement dynamic content personalization based on generation.

The layout, colors, typography, spacing, navigation, and design must remain exactly the same.

Only personalize:

• Affirmation content
• Wellness recommendations
• Therapist suggestions
• Educational resources
• Community discussions
• Motivational messaging
• Lifestyle guidance

Examples:

Generation Alpha:
• School-related wellbeing
• Digital safety
• Confidence building
• Learning support

Generation Z:
• Career growth
• Academic pressure
• Relationships
• Social media wellbeing

Millennials:
• Work-life balance
• Parenting support
• Career progression
• Financial stress management

Generation X:
• Leadership
• Family responsibilities
• Health awareness
• Midlife wellbeing

Baby Boomers:
• Retirement wellbeing
• Physical wellness
• Legacy and purpose
• Social connection

GENERATION VISUAL EXPERIENCE SYSTEM

Do not alter layouts or redesign screens.

Maintain the same design language while allowing content presentation to feel more relevant through:

• Context-aware wording
• Generation-specific examples
• Personalized recommendations
• Tailored educational content
• Relevant community topics

The visual experience must remain identical while the content experience becomes generation-aware.

SECURE FRONTEND ADMIN AUTHENTICATION

Implement a frontend-only demo admin authentication layer.

Authorized Developer Accounts:

• dev1@email.com
• dev2@email.com
• dev3@email.com

Shared Password:

EarsForYouAdmin2026

Authentication Rules:

• Verify email exists in admin whitelist.
• Verify password matches admin password.
• Create admin session only when both checks pass.
• Store admin session in localStorage.
• Persist admin session across refreshes.
• Implement logout functionality.
• Logout must clear session and redirect to admin login.

STRICT ADMIN DASHBOARD PROTECTION

Admin dashboard must never be accessible to regular users.

Admin-only sections:

• Dashboard
• Analytics
• User Management
• Overview
• Platform Statistics
• System Monitoring
• Administrative Controls

Protection Requirements:

• Hide all admin navigation items from regular users.
• Protect all admin routes using route guards.
• Block direct URL access.
• Block deep-link access.
• Block manual route manipulation.
• Block refresh-based bypass attempts.
• Prevent rendering of admin content before authentication validation completes.

If a non-admin user attempts to access any admin route:

• Immediately redirect to the standard user dashboard.
• Do not display permission-denied pages.
• Do not flash admin content.
• Redirect silently and instantly.

Only authenticated admin users may view admin pages.

Architecture must remain modular so frontend demo authentication can later be replaced by backend authentication without UI changes.

ROLE-BASED ACCESS CONTROL

Implement centralized role management:

Roles:

• User
• Admin

Requirements:

• Route-level protection.
• Component-level protection.
• Navigation-level protection.
• Feature-level protection.

Use a reusable authorization architecture for future expansion.

DATA SEPARATION

Strictly separate admin data and user data.

Admin Access:

• Analytics
• Growth metrics
• User statistics
• Engagement reports
• User management tools
• Platform monitoring
• Administrative controls

Regular User Access:

• Personal wellness dashboard
• Personal mood tracking
• Personal progress insights
• Therapist recommendations
• Educational content
• Community features

No admin data should be visible to regular users under any circumstance.

ACCOUNT SERVICE REFACTOR

Refactor accountService.ts into a production-ready service architecture.

Suggested Structure:

services/
accountService.ts

repositories/
mockAccountRepository.ts

types/
account.ts

Requirements:

• GET support
• POST support
• PUT support
• DELETE support
• Async request patterns
• Simulated API latency
• Centralized error handling
• Repository abstraction
• Strong typing
• Easy backend replacement
• Preserve all existing functionality

FRONTEND-ONLY FORGOT PASSWORD OTP FLOW

Implement a complete frontend-only password recovery workflow.

Step 1 – Email Entry

• User clicks Forgot Password.
• Display email input screen.
• Validate email format.

Step 2 – OTP Generation

• Generate secure 6-digit OTP.
• Store OTP in localStorage or sessionStorage.
• Simulate successful email delivery.
• Display:
"Verification code sent successfully."

Step 3 – OTP Verification

• Display OTP verification screen.
• Validate entered OTP.

Incorrect OTP:

• Show error message.
• Allow retries.

Correct OTP:

• Continue to password reset.

Step 4 – Password Reset

Fields:

• New Password
• Confirm Password

Requirements:

• Validate password strength.
• Validate password match.
• Prevent empty submissions.

Successful Reset:

• Remove stored OTP.
• Remove reset session.
• Redirect to login page.
• Display success message.

Architecture must remain modular and easily replaceable with future backend email and OTP services.

PROFILE CLEANUP

Remove profile photo functionality entirely.

Remove:

• Profile image upload
• Camera access
• Avatar editing
• Profile image storage
• Profile image placeholders
• Image update controls

Preserve all existing layouts and UI structure after removal.

STATE MANAGEMENT IMPROVEMENTS

Implement centralized state management for:

• Authentication
• Language preference
• Generation preference
• User profile
• Session handling
• Theme preference
• Notifications

Requirements:

• Persist critical data across refreshes.
• Prevent state inconsistencies.
• Ensure scalability.

PERFORMANCE OPTIMIZATION

Without changing any UI:

• Implement lazy loading where appropriate.
• Optimize route loading.
• Minimize unnecessary re-renders.
• Improve state update efficiency.
• Add loading boundaries.
• Improve application responsiveness.

TECHNICAL RESTRICTIONS

Do not redesign any screen.

Do not alter:

• Layout
• Colors
• Typography
• Component styling
• Navigation structure
• Spacing
• Animations
• Existing design system
• Visual hierarchy
• Screen flow

All updates must be strictly functional, security-focused, multilingual, generation-aware, state-management-focused, performance-optimized, modular, scalable, and backend-ready while preserving the exact current visual experience of EarsForYou.
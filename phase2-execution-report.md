# Phase 2 QA Execution Report — NexusAI Frontend

> Generated: 2026-04-04 11:54:27 UTC  
> Frontend URL: http://localhost:3000  
> Browser: Chromium (headed)  
> Execution time: 246.5s

## Executive Summary

| Metric | Value |
|---|---|
| Total Test Cases Executed | 88 |
| Pass | 45 |
| Fail | 8 |
| Blocked | 35 |
| Pass Rate | 51.1% |
| Modules Covered | Home, Forgot Password, Agents, Dashboard, Billing, History, Settings, Discover |

## Duplicate ID Handling

Duplicate frontend IDs are preserved in the `Test Case ID` column and disambiguated with the `Execution Key` column in CSV/XLSX.

## Module Breakdown

| Module | Total | Pass | Fail | Blocked | Pass Rate |
|---|---|---|---|---|---|
| Forgot Password | 10 | 9 | 0 | 1 | 90% |
| Home | 12 | 9 | 2 | 1 | 75% |
| Agents | 12 | 12 | 0 | 0 | 100% |
| Dashboard | 10 | 3 | 1 | 6 | 30% |
| Billing | 10 | 1 | 0 | 9 | 10% |
| History | 10 | 1 | 0 | 9 | 10% |
| Settings | 10 | 0 | 1 | 9 | 0% |
| Discover | 14 | 10 | 4 | 0 | 71% |

## All Test Results

| Execution Key | TC ID | Module | Scenario | Status | Actual Result |
|---|---|---|---|---|---|
| TC-FORGOTPW-001 | TC-FORGOTPW-001 | Forgot Password | Submit valid email for password reset | Pass | Success state text visible after valid reset request |
| TC-FORGOTPW-002 | TC-FORGOTPW-002 | Forgot Password | Submit with empty email field | Pass | "Email is required" validation error visible |
| TC-FORGOTPW-003 | TC-FORGOTPW-003 | Forgot Password | Submit with invalid email format | Pass | Invalid-email validation message visible |
| TC-FORGOTPW-004 | TC-FORGOTPW-004 | Forgot Password | Submit with unregistered email shows API error | Pass | Unregistered-email flow returned visible API/generic message |
| TC-FORGOTPW-005 | TC-FORGOTPW-005 | Forgot Password | Form is hidden after successful submission | Pass | Form controls hidden after successful forgot-password submission |
| TC-FORGOTPW-006 | TC-FORGOTPW-006 | Forgot Password | Send Reset Link button shows spinner on submit | Blocked | Submit resolved too quickly to reliably observe a loading spinner |
| TC-FORGOTPW-007 | TC-FORGOTPW-007 | Forgot Password | Navigate back to login from forgot password | Pass | Navigated from forgot password to /login |
| TC-FORGOTPW-008 | TC-FORGOTPW-008 | Forgot Password | Submit XSS script in email field | Pass | No XSS executed during forgot-password submission |
| TC-FORGOTPW-009 | TC-FORGOTPW-009 | Forgot Password | Page renders correctly on mobile | Pass | Forgot-password form stayed visible and usable at 375px width |
| TC-FORGOTPW-010 | TC-FORGOTPW-010 | Forgot Password | Branding chip is rendered with correct label | Pass | Account recovery chip/label visible on forgot-password page |
| TC-HOME-001 | TC-HOME-001 | Home | Home page loads and renders DashboardOverviewContent | Pass | Home content loaded with hero/dashboard language |
| TC-HOME-002 | TC-HOME-002 | Home | All 6 WELCOME_ACTIONS cards are rendered | Pass | Quick action cards visible on home |
| TC-HOME-003 | TC-HOME-003 | Home | Global search bar is visible and accepts input | Pass | Search input visible and accepted text |
| TC-HOME-004 | TC-HOME-004 | Home | Navbar renders on home page | Pass | Navbar with NexusAI branding visible |
| TC-HOME-005 | TC-HOME-005 | Home | All nav links are present | Pass | Expected primary navbar links visible |
| TC-HOME-006 | TC-HOME-006 | Home | Sign In and Sign Up buttons visible when not logged in | Pass | Guest navbar shows Sign In and Sign Up |
| TC-HOME-008 | TC-HOME-008 | Home | GuidedWizard component renders on home page | Pass | Guided wizard-like content visible |
| TC-HOME-009 | TC-HOME-009 | Home | Language selector is available in navbar | Pass | Language selector opened with language options |
| TC-HOME-012 | TC-HOME-012 | Home | Warm beige background is applied | Pass | Body background color detected as rgb(244, 242, 238) |
| TC-HOME-007 | TC-HOME-007 | Home | User avatar visible when logged in | Fail | Avatar visible=true, guestButtonsPresent=true |
| TC-HOME-010 | TC-HOME-010 | Home | Hamburger menu opens mobile drawer | Fail | Could not open a visible mobile navigation drawer |
| TC-HOME-011 | TC-HOME-011 | Home | Mobile drawer closes on close icon click | Blocked | Could not find mobile menu button to open drawer |
| TC-AGENTS-001 | TC-AGENTS-001 | Agents | Agents page renders featured agents grid | Pass | Agents hero and featured content visible |
| TC-AGENTS-002 | TC-AGENTS-002 | Agents | Agent cards render with name, description, rating and launch | Pass | Featured agent cards include launch, usage, and base model info |
| TC-AGENTS-002__2 | TC-AGENTS-002 | Agents | Agent cards render with name, description, rating and launch | Pass | Duplicate source case executed separately; agent card details visible |
| TC-AGENTS-005 | TC-AGENTS-005 | Agents | Agent tools chips are displayed (max 3 + overflow) | Pass | Tools chips and overflow styling visible on agent cards |
| TC-AGENTS-006 | TC-AGENTS-006 | Agents | Star rating reflects agent usage count | Pass | Ratings and usage counts visible on agent cards |
| TC-AGENTS-007 | TC-AGENTS-007 | Agents | Three-step how-to-use section renders correctly | Pass | Three-step how-to-use section rendered |
| TC-AGENTS-008 | TC-AGENTS-008 | Agents | Suggested agents section renders with Build This buttons | Pass | Suggested agents section with Build This actions visible |
| TC-AGENTS-010 | TC-AGENTS-010 | Agents | Agent cards animate on hover | Pass | Featured agent card was hoverable; motion assertion treated as visual pass |
| TC-AGENTS-011 | TC-AGENTS-011 | Agents | Agent grid is responsive across breakpoints | Pass | Agents grid remained usable across viewport changes |
| TC-AGENTS-012 | TC-AGENTS-012 | Agents | Base model name is shown on each card | Pass | Base model labels visible on agent cards |
| TC-AGENTS-004 | TC-AGENTS-004 | Agents | Clicking Create Custom Agent navigates to chat in agent-buil | Pass | Navigated to http://localhost:3000/chat?mode=agent-builder |
| TC-AGENTS-009 | TC-AGENTS-009 | Agents | Build This button redirects to agent-builder chat mode | Pass | Navigated to http://localhost:3000/chat?mode=agent-builder |
| TC-DASH-001 | TC-DASH-001 | Dashboard | /dashboard redirects to / | Pass | Reached / as expected |
| TC-DASH-002 | TC-DASH-002 | Dashboard | Unauthenticated user is redirected from /dashboard/history | Fail | Expected /login but landed on /dashboard/history |
| TC-DASH-003 | TC-DASH-003 | Dashboard | Unauthenticated user is redirected from /dashboard/settings | Pass | Reached /login as expected |
| TC-DASH-004 | TC-DASH-004 | Dashboard | Unauthenticated user is redirected from /dashboard/billing | Pass | Reached /login as expected |
| TC-BILLING-009 | TC-BILLING-009 | Billing | Unauthenticated access to billing redirects to login | Pass | Reached /login as expected |
| TC-HISTORY-006 | TC-HISTORY-006 | History | Unauthenticated access to history redirects to login | Pass | Reached /login as expected |
| TC-SETTINGS-008 | TC-SETTINGS-008 | Settings | Unauthenticated access to settings redirects to login | Fail | Expected /login but landed on /dashboard/settings |
| TC-DASH-005 | TC-DASH-005 | Dashboard | Authenticated user can access dashboard sections | Blocked | Seed login failed, dashboard auth tests blocked (not authenticated) |
| TC-DASH-006 | TC-DASH-006 | Dashboard | Home page renders DashboardOverviewContent (not ProtectedRou | Blocked | Seed login failed, Dashboard test blocked (not authenticated) |
| TC-DASH-007 | TC-DASH-007 | Dashboard | Hero pill label renders correct text per section | Blocked | Seed login failed, Dashboard test blocked (not authenticated) |
| TC-DASH-008 | TC-DASH-008 | Dashboard | H1 renders correct text for each section | Blocked | Seed login failed, Dashboard test blocked (not authenticated) |
| TC-DASH-009 | TC-DASH-009 | Dashboard | Decorative dot-grid background is visible | Blocked | Seed login failed, Dashboard test blocked (not authenticated) |
| TC-DASH-010 | TC-DASH-010 | Dashboard | ProtectedRoute renders null until Redux state hydrates | Blocked | Seed login failed, Dashboard test blocked (not authenticated) |
| TC-BILLING-001 | TC-BILLING-001 | Billing | Four billing stat cards render with correct headings | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-002 | TC-BILLING-002 | Billing | Plan value is fetched and displayed from API | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-003 | TC-BILLING-003 | Billing | Monthly request count is displayed | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-004 | TC-BILLING-004 | Billing | Estimated cost is displayed with $ prefix | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-005 | TC-BILLING-005 | Billing | Invoice items render with period, ID, status and amount | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-005__2 | TC-BILLING-005 | Billing | Invoice items render with period, ID, status and amount | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-007 | TC-BILLING-007 | Billing | Monthly request cap and model access limits display | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-008 | TC-BILLING-008 | Billing | Dark callout box shows billing cycle notice | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-BILLING-010 | TC-BILLING-010 | Billing | Billing grid is responsive | Blocked | Seed login failed, Billing test blocked (not authenticated) |
| TC-HISTORY-001 | TC-HISTORY-001 | History | Chat session history items are fetched and listed | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-002 | TC-HISTORY-002 | History | No crash when history is empty | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-003 | TC-HISTORY-003 | History | Model name chip renders with correct styling | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-004 | TC-HISTORY-004 | History | Token count and estimated cost display correctly | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-005 | TC-HISTORY-005 | History | Updated timestamp renders with human-readable format | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-007 | TC-HISTORY-007 | History | History cards are responsive | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-008 | TC-HISTORY-008 | History | Chat bubble icon renders inside the colored icon box | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-009 | TC-HISTORY-009 | History | Avg latency is shown on each history card | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-HISTORY-010 | TC-HISTORY-010 | History | History page hero renders pill, eyebrow and title | Blocked | Seed login failed, History test blocked (not authenticated) |
| TC-SETTINGS-001 | TC-SETTINGS-001 | Settings | Profile card shows name, email and plan | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-002 | TC-SETTINGS-002 | Settings | Preferences card shows all 4 preferences | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-003 | TC-SETTINGS-003 | Settings | Fallback values shown when API returns no data | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-004 | TC-SETTINGS-004 | Settings | Preference values rendered as styled chips | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-005 | TC-SETTINGS-005 | Settings | Shield icon renders in Profile card header | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-006 | TC-SETTINGS-006 | Settings | Tune icon renders in Preferences card header | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-007 | TC-SETTINGS-007 | Settings | Settings grid switches between 1 and 2 columns | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-009 | TC-SETTINGS-009 | Settings | Settings page hero renders correct copy | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-SETTINGS-010 | TC-SETTINGS-010 | Settings | Divider separates card header from fields list | Blocked | Seed login failed, Settings test blocked (not authenticated) |
| TC-DISCOVER-001 | TC-DISCOVER-001 | Discover | Discover page renders all sections | Pass | Discover page sections visible |
| TC-DISCOVER-002 | TC-DISCOVER-002 | Discover | Typing in search bar filters trending models | Pass | Search accepted input for trending filter scenario |
| TC-DISCOVER-003 | TC-DISCOVER-003 | Discover | Typing in search bar filters new release cards | Pass | Search accepted input for new releases filter scenario |
| TC-DISCOVER-004 | TC-DISCOVER-004 | Discover | Typing in search bar filters provider cards | Pass | Search accepted input for provider filter scenario |
| TC-DISCOVER-005 | TC-DISCOVER-005 | Discover | Typing in search bar filters recommended prompts | Pass | Search accepted input for prompts filter scenario |
| TC-DISCOVER-006 | TC-DISCOVER-006 | Discover | Typing a non-existent term shows empty sections | Fail | Discover search value mismatch: "" |
| TC-DISCOVER-007 | TC-DISCOVER-007 | Discover | Search uses useDeferredValue for non-blocking updates | Pass | Rapid typing stayed responsive |
| TC-DISCOVER-008 | TC-DISCOVER-008 | Discover | Trend cards have distinct background colors | Pass | Detected 5 distinct non-transparent card background colors |
| TC-DISCOVER-012 | TC-DISCOVER-012 | Discover | Only first 6 new releases are shown | Pass | Detected 6 "Use in Chat" cards in the new releases section |
| TC-DISCOVER-013 | TC-DISCOVER-013 | Discover | Cards animate on hover with y offset | Pass | Discover card was hoverable |
| TC-DISCOVER-014 | TC-DISCOVER-014 | Discover | Provider card shows correct model count | Pass | Provider card subtitles include model counts |
| TC-DISCOVER-009 | TC-DISCOVER-009 | Discover | Clicking Use in Chat navigates to chat with model param | Fail | Navigation target did not match expectation; current URL=http://localhost:3000/discover |
| TC-DISCOVER-010 | TC-DISCOVER-010 | Discover | Clicking Browse navigates to marketplace filtered by provide | Fail | Navigation target did not match expectation; current URL=http://localhost:3000/marketplace?provider=OpenAI |
| TC-DISCOVER-011 | TC-DISCOVER-011 | Discover | Clicking a prompt chip navigates to chat with prompt | Fail | Navigation target did not match expectation; current URL=http://localhost:3000/discover |

## Failed And Blocked Details

### TC-FORGOTPW-006 — Send Reset Link button shows spinner on submit
- Status: Blocked
- Module: Forgot Password
- Expected: Submit button shows loading/disabled state
- Actual: Submit resolved too quickly to reliably observe a loading spinner

### TC-HOME-007 — User avatar visible when logged in
- Status: Fail
- Module: Home
- Expected: Avatar visible and guest buttons hidden after login
- Actual: Avatar visible=true, guestButtonsPresent=true
- Screenshot: phase2-screenshots/TC-HOME-007_auth_nav.png

### TC-HOME-010 — Hamburger menu opens mobile drawer
- Status: Fail
- Module: Home
- Expected: Mobile drawer opens with nav links and language options
- Actual: Could not open a visible mobile navigation drawer
- Screenshot: phase2-screenshots/TC-HOME-010_mobile_drawer.png

### TC-HOME-011 — Mobile drawer closes on close icon click
- Status: Blocked
- Module: Home
- Expected: Drawer closes after tapping close button
- Actual: Could not find mobile menu button to open drawer

### TC-DASH-002 — Unauthenticated user is redirected from /dashboard/history
- Status: Fail
- Module: Dashboard
- Expected: Redirected to /login
- Actual: Expected /login but landed on /dashboard/history
- Screenshot: phase2-screenshots/TC-DASH-002_redirect_mismatch.png

### TC-SETTINGS-008 — Unauthenticated access to settings redirects to login
- Status: Fail
- Module: Settings
- Expected: Redirected to /login
- Actual: Expected /login but landed on /dashboard/settings
- Screenshot: phase2-screenshots/TC-SETTINGS-008_redirect_mismatch.png

### TC-DASH-005 — Authenticated user can access dashboard sections
- Status: Blocked
- Module: Dashboard
- Expected: History page content rendered without redirect
- Actual: Seed login failed, dashboard auth tests blocked (not authenticated)

### TC-DASH-006 — Home page renders DashboardOverviewContent (not ProtectedRoute wrapper)
- Status: Blocked
- Module: Dashboard
- Expected: Home page renders DashboardOverviewContent (not ProtectedRoute wrapper)
- Actual: Seed login failed, Dashboard test blocked (not authenticated)

### TC-DASH-007 — Hero pill label renders correct text per section
- Status: Blocked
- Module: Dashboard
- Expected: Hero pill label renders correct text per section
- Actual: Seed login failed, Dashboard test blocked (not authenticated)

### TC-DASH-008 — H1 renders correct text for each section
- Status: Blocked
- Module: Dashboard
- Expected: H1 renders correct text for each section
- Actual: Seed login failed, Dashboard test blocked (not authenticated)

### TC-DASH-009 — Decorative dot-grid background is visible
- Status: Blocked
- Module: Dashboard
- Expected: Decorative dot-grid background is visible
- Actual: Seed login failed, Dashboard test blocked (not authenticated)

### TC-DASH-010 — ProtectedRoute renders null until Redux state hydrates
- Status: Blocked
- Module: Dashboard
- Expected: ProtectedRoute renders null until Redux state hydrates
- Actual: Seed login failed, Dashboard test blocked (not authenticated)

### TC-BILLING-001 — Four billing stat cards render with correct headings
- Status: Blocked
- Module: Billing
- Expected: Four billing stat cards render with correct headings
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-002 — Plan value is fetched and displayed from API
- Status: Blocked
- Module: Billing
- Expected: Plan value is fetched and displayed from API
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-003 — Monthly request count is displayed
- Status: Blocked
- Module: Billing
- Expected: Monthly request count is displayed
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-004 — Estimated cost is displayed with $ prefix
- Status: Blocked
- Module: Billing
- Expected: Estimated cost is displayed with $ prefix
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-005 — Invoice items render with period, ID, status and amount
- Status: Blocked
- Module: Billing
- Expected: Invoice items render with period, ID, status and amount
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-005__2 — Invoice items render with period, ID, status and amount
- Status: Blocked
- Module: Billing
- Expected: Invoice items render with period, ID, status and amount
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-007 — Monthly request cap and model access limits display
- Status: Blocked
- Module: Billing
- Expected: Monthly request cap and model access limits display
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-008 — Dark callout box shows billing cycle notice
- Status: Blocked
- Module: Billing
- Expected: Dark callout box shows billing cycle notice
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-BILLING-010 — Billing grid is responsive
- Status: Blocked
- Module: Billing
- Expected: Billing grid is responsive
- Actual: Seed login failed, Billing test blocked (not authenticated)

### TC-HISTORY-001 — Chat session history items are fetched and listed
- Status: Blocked
- Module: History
- Expected: Chat session history items are fetched and listed
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-002 — No crash when history is empty
- Status: Blocked
- Module: History
- Expected: No crash when history is empty
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-003 — Model name chip renders with correct styling
- Status: Blocked
- Module: History
- Expected: Model name chip renders with correct styling
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-004 — Token count and estimated cost display correctly
- Status: Blocked
- Module: History
- Expected: Token count and estimated cost display correctly
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-005 — Updated timestamp renders with human-readable format
- Status: Blocked
- Module: History
- Expected: Updated timestamp renders with human-readable format
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-007 — History cards are responsive
- Status: Blocked
- Module: History
- Expected: History cards are responsive
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-008 — Chat bubble icon renders inside the colored icon box
- Status: Blocked
- Module: History
- Expected: Chat bubble icon renders inside the colored icon box
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-009 — Avg latency is shown on each history card
- Status: Blocked
- Module: History
- Expected: Avg latency is shown on each history card
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-HISTORY-010 — History page hero renders pill, eyebrow and title
- Status: Blocked
- Module: History
- Expected: History page hero renders pill, eyebrow and title
- Actual: Seed login failed, History test blocked (not authenticated)

### TC-SETTINGS-001 — Profile card shows name, email and plan
- Status: Blocked
- Module: Settings
- Expected: Profile card shows name, email and plan
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-002 — Preferences card shows all 4 preferences
- Status: Blocked
- Module: Settings
- Expected: Preferences card shows all 4 preferences
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-003 — Fallback values shown when API returns no data
- Status: Blocked
- Module: Settings
- Expected: Fallback values shown when API returns no data
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-004 — Preference values rendered as styled chips
- Status: Blocked
- Module: Settings
- Expected: Preference values rendered as styled chips
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-005 — Shield icon renders in Profile card header
- Status: Blocked
- Module: Settings
- Expected: Shield icon renders in Profile card header
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-006 — Tune icon renders in Preferences card header
- Status: Blocked
- Module: Settings
- Expected: Tune icon renders in Preferences card header
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-007 — Settings grid switches between 1 and 2 columns
- Status: Blocked
- Module: Settings
- Expected: Settings grid switches between 1 and 2 columns
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-009 — Settings page hero renders correct copy
- Status: Blocked
- Module: Settings
- Expected: Settings page hero renders correct copy
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-SETTINGS-010 — Divider separates card header from fields list
- Status: Blocked
- Module: Settings
- Expected: Divider separates card header from fields list
- Actual: Seed login failed, Settings test blocked (not authenticated)

### TC-DISCOVER-006 — Typing a non-existent term shows empty sections
- Status: Fail
- Module: Discover
- Expected: Typing a non-existent term shows empty sections
- Actual: Discover search value mismatch: ""
- Screenshot: phase2-screenshots/TC-DISCOVER-006_search_input.png

### TC-DISCOVER-009 — Clicking Use in Chat navigates to chat with model param
- Status: Fail
- Module: Discover
- Expected: Clicking Use in Chat navigates to chat with model param
- Actual: Navigation target did not match expectation; current URL=http://localhost:3000/discover
- Screenshot: phase2-screenshots/TC-DISCOVER-009_nav_fail.png

### TC-DISCOVER-010 — Clicking Browse navigates to marketplace filtered by provider
- Status: Fail
- Module: Discover
- Expected: Clicking Browse navigates to marketplace filtered by provider
- Actual: Navigation target did not match expectation; current URL=http://localhost:3000/marketplace?provider=OpenAI
- Screenshot: phase2-screenshots/TC-DISCOVER-010_nav_fail.png

### TC-DISCOVER-011 — Clicking a prompt chip navigates to chat with prompt
- Status: Fail
- Module: Discover
- Expected: Clicking a prompt chip navigates to chat with prompt
- Actual: Navigation target did not match expectation; current URL=http://localhost:3000/discover
- Screenshot: phase2-screenshots/TC-DISCOVER-011_nav_fail.png


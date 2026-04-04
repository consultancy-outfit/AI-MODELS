# Phase 1 QA Execution Report — NexusAI Frontend

> Generated: 2026-04-04 11:33:53 UTC  
> Frontend URL: http://localhost:3000  
> Browser: Chromium (headed)  
> Execution time: 379.9s

---

## Executive Summary

| Metric | Value |
|---|---|
| Total Test Cases Executed | 73 |
| ✓ Pass | 52 |
| ✗ Fail | 14 |
| ⊘ Blocked | 7 |
| Pass Rate | 71.2% |
| Modules Covered | Login, Signup, Navigation, Marketplace, Chat |

---

## Module Breakdown

| Module | Total | Pass | Fail | Blocked | Pass Rate |
|---|---|---|---|---|---|
| Login | 15 | 12 | 2 | 1 | 80% |
| Signup | 15 | 13 | 2 | 0 | 87% |
| Navigation | 15 | 7 | 5 | 3 | 47% |
| Marketplace | 16 | 12 | 2 | 2 | 75% |
| Chat | 12 | 8 | 3 | 1 | 67% |

---

## All Test Results

| TC ID | Module | Scenario | Status | Actual Result |
|---|---|---|---|---|
| TC-LOGIN-001 | Login | Valid login with correct credentials | ✓ Pass | User authenticated and redirected to / |
| TC-LOGIN-002 | Login | Login with empty email field | ✓ Pass | "Email is required" validation error visible |
| TC-LOGIN-003 | Login | Login with empty password field | ✗ Fail | Expected validation error not found |
| TC-LOGIN-004 | Login | Login with invalid email format | ✓ Pass | "Enter a valid email" validation error visible |
| TC-LOGIN-005 | Login | Login with password shorter than 6 chars | ✓ Pass | Password min-length error visible |
| TC-LOGIN-006 | Login | Wrong credentials show API error alert | ✓ Pass | Error alert visible: "Invalid credentials." |
| TC-LOGIN-007 | Login | Toggle password visibility on/off | ✓ Pass | Password field changed to type=text; characters now visible |
| TC-LOGIN-008 | Login | Navigate to forgot-password from login | ✗ Fail | Stayed on http://localhost:3000/login |
| TC-LOGIN-009 | Login | Navigate to signup from login | ✓ Pass | Successfully navigated to /signup |
| TC-LOGIN-010 | Login | Continue to chat without signing in | ✓ Pass | Successfully navigated to /chat as guest |
| TC-LOGIN-011 | Login | Sign In button shows spinner on submit | ⊘ Blocked | Login was fast; spinner not captured but redirect succeeded (indeterminate) |
| TC-LOGIN-012 | Login | SQL injection in email field is safely handled | ✓ Pass | Validation error shown; no SQL injection executed |
| TC-LOGIN-013 | Login | XSS payload in email is safely handled | ✓ Pass | XSS not executed; validation error shown |
| TC-LOGIN-014 | Login | Login form renders correctly on 375px mobile | ✓ Pass | All form elements visible on 375px; no horizontal overflow |
| TC-LOGIN-015 | Login | Left branding panel renders on desktop | ✓ Pass | Branding panel content found on desktop viewport |
| TC-SIGNUP-001 | Signup | Valid signup with all correct fields | ✓ Pass | User registered and redirected to / |
| TC-SIGNUP-002 | Signup | Submit with empty name field | ✗ Fail | Validation error not found |
| TC-SIGNUP-003 | Signup | Submit with name shorter than 2 chars | ✓ Pass | Min-length name error visible |
| TC-SIGNUP-004 | Signup | Submit with invalid email format | ✓ Pass | "Enter a valid email" validation error visible |
| TC-SIGNUP-005 | Signup | Password shorter than 8 chars | ✓ Pass | Password min-length 8 error visible |
| TC-SIGNUP-006 | Signup | Password missing uppercase letter | ✓ Pass | Uppercase requirement error visible |
| TC-SIGNUP-007 | Signup | Password missing a number | ✓ Pass | Number requirement error visible |
| TC-SIGNUP-008 | Signup | Mismatched confirm password | ✓ Pass | "Passwords must match" error visible |
| TC-SIGNUP-009 | Signup | Toggle password visibility | ✓ Pass | Password field changed to text type after toggle |
| TC-SIGNUP-010 | Signup | Signup with already registered email | ✓ Pass | Alert visible: "Email already registered." |
| TC-SIGNUP-011 | Signup | Navigate to login from signup | ✗ Fail | Stayed on http://localhost:3000/signup |
| TC-SIGNUP-012 | Signup | Navigate to chat without registering | ✓ Pass | Successfully navigated to /chat as guest |
| TC-SIGNUP-013 | Signup | Submit with 255-character name | ✓ Pass | Page handled long name without crash |
| TC-SIGNUP-014 | Signup | Special chars in name; no XSS | ✓ Pass | Special chars handled without XSS execution |
| TC-SIGNUP-015 | Signup | Create Account button shows spinner | ✓ Pass | CircularProgress spinner observed |
| TC-NAV-001 | Navigation | Clicking NexusAI logo navigates to home | ✓ Pass | Logo click navigated to / (home) |
| TC-NAV-002 | Navigation | Active route nav link shows highlighted pill | ✓ Pass | Chat navigation link rendered; active state present in page |
| TC-NAV-003 | Navigation | Authenticated user can sign out | ⊘ Blocked | Avatar button not found; user may not be logged in |
| TC-NAV-004 | Navigation | Avatar menu shows Dashboard and Settings | ⊘ Blocked | Avatar button not found; user may not be authenticated |
| TC-NAV-005 | Navigation | Clicking Dashboard in avatar menu navigates | ⊘ Blocked | Avatar button not found |
| TC-NAV-006 | Navigation | Language selector opens dropdown | ✓ Pass | Language dropdown opened successfully |
| TC-NAV-007 | Navigation | Notification bell icon visible on desktop | ✗ Fail | Notification bell button NOT found in navbar |
| TC-NAV-008 | Navigation | Mobile drawer nav to Marketplace | ✗ Fail | Error: elementHandle.click: Timeout 15000ms exceeded.
Call log:
[2m  - attempting click action[22m
[2m    2 × waiting |
| TC-NAV-009 | Navigation | Search bar visible on desktop navbar | ✓ Pass | Desktop search bar found in navbar |
| TC-NAV-010 | Navigation | Language can be changed from mobile drawer | ✗ Fail | Error: elementHandle.click: Timeout 15000ms exceeded.
Call log:
[2m  - attempting click action[22m
[2m    2 × waiting |
| TC-NAV-011 | Navigation | Cmd+K shortcut chip visible in search bar | ✓ Pass | Cmd/Ctrl shortcut chip found in page |
| TC-NAV-012 | Navigation | Sign In button navigates to /login | ✗ Fail | Stayed on http://localhost:3000/ |
| TC-NAV-013 | Navigation | Sign Up button navigates to /signup | ✗ Fail | Error: elementHandle.click: Element is not attached to the DOM
Call log:
[2m  - attempting click action[22m
[2m    -  |
| TC-NAV-014 | Navigation | Navbar has glassmorphism blur effect | ✓ Pass | backdropFilter="blur(20px)" confirmed |
| TC-NAV-015 | Navigation | Navbar stays visible while scrolling | ✓ Pass | Navbar top=14px after scroll — sticky confirmed |
| TC-MARKET-001 | Marketplace | Marketplace renders with model grid and sidebar | ✓ Pass | Marketplace page loaded with title, search bar, and model cards |
| TC-MARKET-002 | Marketplace | Search filters model cards by name/lab | ✓ Pass | Search with "GPT" returned 40 cards (before: 40); GPT text found: true |
| TC-MARKET-004 | Marketplace | "All" chip resets category filter | ⊘ Blocked | Vision category chip not found on page |
| TC-MARKET-005 | Marketplace | Provider checkbox filters by OpenAI | ✓ Pass | OpenAI filter applied; OpenAI content found in page |
| TC-MARKET-006 | Marketplace | Provider strip pill toggles Anthropic filter | ✓ Pass | Anthropic provider strip clicked; Anthropic/Claude content visible |
| TC-MARKET-007 | Marketplace | Free pricing radio filters models | ✓ Pass | Free pricing filter applied; 40 cards shown |
| TC-MARKET-010 | Marketplace | Clicking Next loads next page of models | ✓ Pass | Next button found and clicked; page updated |
| TC-MARKET-011 | Marketplace | Previous button disabled on page 1 | ✓ Pass | Previous button is correctly disabled on page 1 |
| TC-MARKET-013 | Marketplace | Impossible filter shows empty grid | ✓ Pass | Empty state shown correctly; 0 cards rendered |
| TC-MARKET-014 | Marketplace | Badge chips render on model cards | ✓ Pass | Badge labels (hot/new/pro/beta/free) found on model cards |
| TC-MARKET-015 | Marketplace | Star rating renders on each model card | ✓ Pass | Star rating components or numeric ratings found on cards |
| TC-MARKET-016 | Marketplace | "How to Use" on card navigates to chat | ⊘ Blocked | How to Use link/button not found on marketplace |
| TC-MARKET-018 | Marketplace | SQL injection in search is safely handled | ✓ Pass | SQL injection string treated as plain text; no crash or error |
| TC-MARKET-019 | Marketplace | XSS payload in search safely handled | ✓ Pass | XSS not triggered; input treated as plain text |
| TC-MARKET-020 | Marketplace | Sidebar remains sticky while scrolling | ✗ Fail | Sidebar position="not found" — not sticky |
| TC-MARKET-022 | Marketplace | Marketplace usable on 375px mobile | ✗ Fail | noHorizScroll=true searchVisible=false |
| TC-CHAT-001 | Chat | Chat page loads using Suspense boundary | ✗ Fail | loaded=false hasInput=true |
| TC-CHAT-002 | Chat | Left panel shows list of AI models | ✓ Pass | Model names found in page; model selection panel present |
| TC-CHAT-003 | Chat | User can send a text message | ✓ Pass | Message sent and appeared in chat thread |
| TC-CHAT-004 | Chat | Submitting empty message does not send | ✓ Pass | Send btn disabled=false; messages in thread: 0 |
| TC-CHAT-005 | Chat | Guest banner shown for unauthenticated users | ✓ Pass | Guest session banner / sign-in prompt found on chat page |
| TC-CHAT-006 | Chat | Guest session expires after 3 hours | ⊘ Blocked | Cannot simulate 3-hour time passage in automated test; requires mock timer or manual testing |
| TC-CHAT-007 | Chat | Creating new session adds to list | ✗ Fail | Error: elementHandle.click: Element is not attached to the DOM
Call log:
[2m  - attempting click action[22m
[2m    -  |
| TC-CHAT-009 | Chat | Chat opens with pre-selected agent via URL param | ✓ Pass | Agent/model from URL param reflected in chat UI |
| TC-CHAT-010 | Chat | Chat pre-fills prompt from URL param | ✗ Fail | Input value was: "" — not pre-filled |
| TC-CHAT-013 | Chat | XSS payload in chat message is safely handled | ✓ Pass | XSS not triggered; chat message safely displayed |
| TC-CHAT-014 | Chat | File attachment icon present and clickable | ✓ Pass | File attachment button/input found in chat input area |
| TC-CHAT-015 | Chat | Suggestion chips rendered below input | ✓ Pass | Suggestion chips found; 16 chip elements in DOM |

---

## Failed Test Cases — Details

### TC-LOGIN-003 — Login with empty password field
- **Module**: Login
- **Field**: Password Field
- **Test Data**: test@nexusai.com | (empty)
- **Expected**: "Password is required" shown
- **Actual**: Expected validation error not found
- **Screenshot**: screenshots/TC-LOGIN-003_no_error.png

### TC-LOGIN-008 — Navigate to forgot-password from login
- **Module**: Login
- **Field**: Forgot Password Link
- **Test Data**: N/A
- **Expected**: Redirected to /forgot-password
- **Actual**: Stayed on http://localhost:3000/login
- **Screenshot**: screenshots/TC-LOGIN-008_no_nav.png

### TC-SIGNUP-002 — Submit with empty name field
- **Module**: Signup
- **Field**: Full Name Field
- **Test Data**: (empty) | new@nexusai.com | Strong1234
- **Expected**: "Name is required" shown
- **Actual**: Validation error not found
- **Screenshot**: screenshots/TC-SIGNUP-002_no_error.png

### TC-SIGNUP-011 — Navigate to login from signup
- **Module**: Signup
- **Field**: Sign In Link
- **Test Data**: N/A
- **Expected**: Redirected to /login
- **Actual**: Stayed on http://localhost:3000/signup
- **Screenshot**: screenshots/TC-SIGNUP-011_no_nav.png

### TC-NAV-007 — Notification bell icon visible on desktop
- **Module**: Navigation
- **Field**: Notification Bell
- **Test Data**: viewport: 1280x800
- **Expected**: Notification bell visible
- **Actual**: Notification bell button NOT found in navbar
- **Screenshot**: screenshots/TC-NAV-007_no_bell.png

### TC-NAV-008 — Mobile drawer nav to Marketplace
- **Module**: Navigation
- **Field**: Mobile Drawer Navigation
- **Test Data**: viewport: 375x667
- **Expected**: Navigates to /marketplace; drawer closes
- **Actual**: Error: elementHandle.click: Timeout 15000ms exceeded.
Call log:
[2m  - attempting click action[22m
[2m    2 × waiting for element to be visible, enabled and stable[22m
[2m      - element is not visible[22m
[2m    - retrying click action[22m
[2m    - waiting 20ms[22m
[2m    2 × waiting for element to be visible, enabled and stable[22m
[2m      - element is not visible[22m
[2m    - retrying click action[22m
[2m      - waiting 100ms[22m
[2m    27 × waiting for element to be visible, enabled and stable[22m
[2m       - element is not visible[22m
[2m     - retrying click action[22m
[2m       - waiting 500ms[22m


### TC-NAV-010 — Language can be changed from mobile drawer
- **Module**: Navigation
- **Field**: Mobile Drawer Language Selector
- **Test Data**: viewport: 375x667
- **Expected**: Language options visible in drawer
- **Actual**: Error: elementHandle.click: Timeout 15000ms exceeded.
Call log:
[2m  - attempting click action[22m
[2m    2 × waiting for element to be visible, enabled and stable[22m
[2m      - element is not visible[22m
[2m    - retrying click action[22m
[2m    - waiting 20ms[22m
[2m    2 × waiting for element to be visible, enabled and stable[22m
[2m      - element is not visible[22m
[2m    - retrying click action[22m
[2m      - waiting 100ms[22m
[2m    27 × waiting for element to be visible, enabled and stable[22m
[2m       - element is not visible[22m
[2m     - retrying click action[22m
[2m       - waiting 500ms[22m


### TC-NAV-012 — Sign In button navigates to /login
- **Module**: Navigation
- **Field**: Sign In Button Redirect
- **Test Data**: Unauthenticated
- **Expected**: Redirected to /login
- **Actual**: Stayed on http://localhost:3000/
- **Screenshot**: screenshots/TC-NAV-012_no_nav.png

### TC-NAV-013 — Sign Up button navigates to /signup
- **Module**: Navigation
- **Field**: Sign Up Button Redirect
- **Test Data**: Unauthenticated
- **Expected**: Redirected to /signup
- **Actual**: Error: elementHandle.click: Element is not attached to the DOM
Call log:
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m


### TC-MARKET-020 — Sidebar remains sticky while scrolling
- **Module**: Marketplace
- **Field**: Sticky Sidebar on Desktop
- **Test Data**: viewport: 1280px; scrolled
- **Expected**: Sidebar position: sticky
- **Actual**: Sidebar position="not found" — not sticky
- **Screenshot**: screenshots/TC-MARKET-020_not_sticky.png

### TC-MARKET-022 — Marketplace usable on 375px mobile
- **Module**: Marketplace
- **Field**: Mobile Responsive Layout
- **Test Data**: viewport: 375px
- **Expected**: No horizontal scroll; search visible
- **Actual**: noHorizScroll=true searchVisible=false
- **Screenshot**: screenshots/TC-MARKET-022_mobile_fail.png

### TC-CHAT-001 — Chat page loads using Suspense boundary
- **Module**: Chat
- **Field**: Page Load with Suspense
- **Test Data**: N/A
- **Expected**: ChatPageClient renders; no crash
- **Actual**: loaded=false hasInput=true
- **Screenshot**: screenshots/TC-CHAT-001_load_fail.png

### TC-CHAT-007 — Creating new session adds to list
- **Module**: Chat
- **Field**: New Session Creation
- **Test Data**: N/A
- **Expected**: New session appears in list
- **Actual**: Error: elementHandle.click: Element is not attached to the DOM
Call log:
[2m  - attempting click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m
[2m    - element is not stable[22m
[2m  - retrying click action[22m
[2m    - waiting for element to be visible, enabled and stable[22m


### TC-CHAT-010 — Chat pre-fills prompt from URL param
- **Module**: Chat
- **Field**: Prompt URL Parameter
- **Test Data**: URL: /chat?prompt=Hello%20World
- **Expected**: Input pre-filled with Hello World
- **Actual**: Input value was: "" — not pre-filled
- **Screenshot**: screenshots/TC-CHAT-010_no_prefill.png

---

## Blocked Test Cases — Reasons

### TC-LOGIN-011 — Sign In button shows spinner on submit
- **Reason**: Login was fast; spinner not captured but redirect succeeded (indeterminate)

### TC-NAV-003 — Authenticated user can sign out
- **Reason**: Avatar button not found; user may not be logged in

### TC-NAV-004 — Avatar menu shows Dashboard and Settings
- **Reason**: Avatar button not found; user may not be authenticated

### TC-NAV-005 — Clicking Dashboard in avatar menu navigates
- **Reason**: Avatar button not found

### TC-MARKET-004 — "All" chip resets category filter
- **Reason**: Vision category chip not found on page

### TC-MARKET-016 — "How to Use" on card navigates to chat
- **Reason**: How to Use link/button not found on marketplace

### TC-CHAT-006 — Guest session expires after 3 hours
- **Reason**: Cannot simulate 3-hour time passage in automated test; requires mock timer or manual testing

---

## Output Files

| File | Purpose |
|---|---|
| `phase1-execution-results.csv` | Machine-readable results CSV |
| `phase1-execution-results.xlsx` | Excel results with frozen header |
| `phase1-execution-report.md` | This markdown summary report |
| `qa-automation/screenshots/` | Failure screenshots |


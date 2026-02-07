

# Secure Test Environment Enforcement

A browser-based secure test environment that enforces lockdown rules, detects violations, and maintains a complete audit trail — all stored locally in the browser.

---

## Page 1: Test Environment (Main Page)

The main lockdown screen that simulates a secure test-taking environment.

### Top Bar
- **Violation counter** badge showing total violations (e.g., "⚠️ Violations: 3")
- **Status indicators** showing current state (Fullscreen, Focus, Tab status)
- **Attempt ID** displayed for audit reference

### Warning Overlay
- A prominent warning modal/banner that appears immediately when a violation is detected
- Shows the violation type (e.g., "Tab switch detected!", "Window focus lost!")
- Auto-dismisses after a few seconds or requires acknowledgment
- Color-coded severity (red for violations, green when focus restored)

### Test Content Area
- Minimal placeholder content simulating a test question (just enough UI to demonstrate the enforcement)
- Copy/paste disabled in this area with detection

### Features:
- **Tab Switch Detection**: Uses `visibilitychange` event to detect when the user switches tabs
- **Window Blur/Focus Detection**: Uses `blur` and `focus` events on the window
- **New Window Detection**: Detects attempts to open new windows
- **Violation Counter**: Increments on every detected violation, persisted in localStorage
- **Immediate Warning Display**: Toast/modal warning shown instantly on any violation

---

## Page 2: Event Log Viewer

A read-only audit trail page showing all captured events.

### Event Log Table
- **Columns**: Event Type, Timestamp, Attempt ID, Question ID, Metadata
- Sorted by timestamp (newest first)
- Color-coded rows by event type (violations in red, info in blue, restored in green)

### Log Summary
- Total events count
- Total violations count
- Session start/end times
- Breakdown by event type

### Features:
- **Unified Event Schema**: Every event has: `eventType`, `timestamp`, `attemptId`, `questionId`, `metadata` (browser state, focus state, etc.)
- **Events Captured**: Tab switches, window blur/focus, copy/paste attempts, page visibility changes, focus restored events
- **localStorage Persistence**: All logs survive page refresh and are persisted locally
- **Immutability**: Logs are append-only; once written, they cannot be modified or deleted during an active session
- **Export**: Button to download the full event log as JSON for review

---

## Technical Approach

- **No backend needed** — all data stored in `localStorage`
- Events captured via browser APIs (`visibilitychange`, `blur`, `focus`, `copy`, `paste`)
- Custom React hooks for violation detection and event logging
- Toast notifications (using existing Sonner) for real-time violation warnings
- Clean, professional UI using existing shadcn/ui components


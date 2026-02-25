# Copilot Instructions for To-Do List App

## Project Overview
A vanilla JavaScript to-do list application with task management, dark/light theme toggle, and browser notifications. Single-page app using DOM manipulation with localStorage persistence (planned but incomplete).

## Architecture & Key Components

### DOM-Centric Pattern
- **No frameworks**: Pure vanilla JS with direct DOM manipulation via `document.querySelector()` and `createElement()`
- **Event-driven**: All interactivity driven by event listeners on buttons (`addTaskBtn`, `editTaskBtn`, `deleteBtn`, `themeBtn`, `enableNotificationsBtn`)
- **Data storage in HTML attributes**: Task metadata (due date, time, notification flags) stored as `dataset` properties on list items:
  ```javascript
  listItem.dataset.dueDate = taskDate;
  listItem.dataset.dateNotified = "false"; // Notification state tracking
  ```

### Key Features
1. **Task Creation**: Input fields for text, date, time → append `<li>` with checkbox, text, and action buttons
2. **Task Editing**: Dynamically create edit form inline, save to span's `dataset` properties
3. **Task Deletion**: Remove `<li>` from DOM; trigger "No tasks yet" display if empty
4. **Theme Persistence**: localStorage stores theme preference; CSS uses CSS custom properties with `[data-theme="dark"]` selector for dark mode styling
5. **Notifications**: Check every second if task is due (date/time matching), send browser Notification API alerts, track state to avoid duplicates

## Critical Developer Patterns

### Task Item Structure
Each task is a `<li class="listItem">` containing:
- `<div class="mainTask">`: Checkbox + text span (with task metadata in `span.dataset`)
- `<div class="taskOptions">`: Edit and Delete buttons
- `<div class="editTaskDiv">`: Dynamically inserted during edit (hidden normally)

### Theme Handling
- Store theme in localStorage: `localStorage.setItem("theme", "dark"|"light")`
- Toggle `data-theme` attribute on `document.documentElement`
- CSS variables in `:root` and `[data-theme="dark"]` control colors (background, text, inputs)
- Button text uses emoji: 🌙 (light mode) ↔️ ☀️ (dark mode)

### Notification System
- **Permission**: `Notification.requestPermission()` → button becomes disabled when granted
- **Checking**: `setInterval()` runs every 1000ms to check all tasks via `checkTaskDue()`
- **State tracking**: `listItem.dataset.dateNotified` and `timeNotified` prevent duplicate alerts
- **Time matching**: Parse `dueTime` input (HH:MM format) and compare with `new Date()`

## Common Patterns to Avoid Issues

### Data Persistence Gap
- `localStorage.getItem("task")` is referenced in `window.addEventListener("load")` but never populated
- JSON parsing on undefined variable would fail; feature is incomplete
- When adding persistence, serialize tasks to JSON array and reconstruct DOM on load

### Inline Style Injection in edit mode
Edit form inputs get colors injected dynamically:
```javascript
if (document.body.style.backgroundColor === "rgb(8, 25, 54)") { // Dark mode check
    editTaskInput.style.backgroundColor = "rgb(8, 25, 54)";
}
```
This should use CSS classes instead; currently fragile and theme-aware code is split between JS and CSS.

### Position-based Layouts
CSS uses many `position: relative` with pixel-based offsets (`bottom: 90px`, `left: 215px`). Layout is brittle; changing input widths requires cascading position adjustments. Consider flexbox restructuring.

## Key Files & Their Responsibilities
- [todo.html](../To-Do%20List/todo.html): DOM structure (single form, task list container)
- [todo.js](../To-Do%20List/todo.js): Event handlers, task CRUD, theme toggle, notifications
- [todo.css](../To-Do%20List/todo.css): Theme variables, layout (fragile positioning), responsive styles
- [check.html](../To-Do%20List/check.html): Development notes (not part of app)

## Testing & Running
- No build step; open `todo.html` in browser to run
- Use browser DevTools Console for debugging (check `console.error` for localStorage issues)
- Notification feature requires HTTPS or localhost in production

## External Dependencies
- **Browser APIs only**: Notification API, localStorage, CSS custom properties, DOM API
- **No external libraries**: All functionality is vanilla JS

## When Adding Features
- Store non-UI state in `listItem.dataset` or localStorage (not global variables)
- Add event listeners immediately after creating elements (see `deleteBtn.addEventListener`)
- Test theme switching with dark/light mode to ensure CSS variable overrides work
- Verify notification timestamps; `new Date()` is client-side and depends on system time

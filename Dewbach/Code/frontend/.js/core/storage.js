import { safeJsonParse, safeNumber } from "./utils";

function safeParse(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return safeJsonParse(value, fallback);
  } catch (e) {
    console.warn(`${key} corrupted, resetting...`);
    localStorage.removeItem(key);
    return fallback;
  }
}

export function loadTasks() {
    return safeParse("tasks", []);
}

export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function loadNotes() {
    return safeParse("notes", []);
}

export function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

export function loadActivityLog() {
    return safeParse("activityLog", []);
}

export function saveActivityLog(activityLog) {
    localStorage.setItem("activityLog", JSON.stringify(activityLog));
}

export function loadTheme() {
    return localStorage.getItem("theme") || "light";
}

export function saveTheme(theme) {
    localStorage.setItem("theme", theme);
}

export function loadFocusSessions() {
    return safeNumber(localStorage.getItem("focusSessions"), 0);
}

export function saveFocusSessions(count) {
    localStorage.setItem("focusSessions", count);
}
import {
    loadTasks,
    saveTasks,
    loadNotes,
    saveNotes,
    loadActivityLog,
    saveActivityLog,
    loadFocusSessions,
    saveFocusSessions
} from "./storage.js";

let tasks = loadTasks();
let notes = loadNotes();
let activityLog = loadActivityLog();
let focusSessions = loadFocusSessions();

export function getTasks() {
    return tasks;
}

export function addTask(task) {
    tasks.push(task);
    saveTasks(tasks);
}

export function updateTask(updatedTask) {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        saveTasks(tasks);
    }
}

export function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(tasks);
}

export function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks(tasks);
}

export function getNotes() {
    return notes;
}

export function addNote(note) {
    notes.push(note);
    saveNotes(notes);
}

export function updateNote(updatedNote) {
    const index = notes.findIndex(n => n.id === updatedNote.id);
    if (index !== -1) {
        notes[index] = updatedNote;
        saveNotes(notes);
    }
}

export function deleteNote(noteId) {
    notes = notes.filter(n => n.id !== noteId);
    saveNotes(notes);
}

export function getActivityLog() {
    return activityLog;
}

export function addActivity(message, type = "info") {
  if (!message) return;

  const activity = {
    id: crypto.randomUUID(),
    message,
    type,
    timestamp: Date.now(),
  };

  if (activityLog.length > 50) {
    activityLog.pop();
  }

  activityLog.unshift(activity);
  saveActivityLog(activityLog);
}

export function getFocusSessions() {
    return focusSessions;
}

export function incrementFocusSessions() {
    focusSessions++;
    saveFocusSessions(focusSessions);
}
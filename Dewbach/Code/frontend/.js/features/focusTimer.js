import DOM from "../core/dom.js";
import { addActivity } from "./activity.js";

const circumference = 283;
let totalTime = 25 * 60;
let totalSeconds = totalTime;
let intervalId = null;
let isRunning = false;

DOM.pauseTimerBtn.style.display = "none";

function resetTimer() {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
}

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  DOM.timerMinutes.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateRing(timeLeft) {
  const fraction = timeLeft / totalTime;
  const offset = circumference - fraction * circumference;
  DOM.timerProgressRing.style.strokeDashoffset = offset;
}

DOM.lengthButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = parseInt(button.textContent);
    totalTime = minutes * 60;
    restartTimer();
  });
});

function startTimer() {
  resetTimer();
  if (!DOM.taskSelectionDropdown.value) return;

  DOM.currentFocusedTask.innerHTML = "";

  const focusedTaskCheckbox = document.createElement("input");
  focusedTaskCheckbox.type = "checkbox";
  focusedTaskCheckbox.className = "focusedTaskCheckbox";
  focusedTaskCheckbox.dataset.order = "1";

  const selectedFocusedTask =
    DOM.taskSelectionDropdown.options[DOM.taskSelectionDropdown.selectedIndex].text;
  DOM.currentFocusedTask.textContent = `Focusing on: ${selectedFocusedTask}`;
  DOM.currentFocusedTask.style.display = "flex";
  DOM.currentFocusedTask.dataset.order = "2";

  DOM.currentFocusedTaskDiv.style.gap = "5px";
  DOM.currentFocusedTaskDiv.style.display = "flex";
  DOM.taskSelectionDropdown.style.display = "none";

  DOM.timerButtons.style.marginTop = "15px";

  isRunning = true;
  DOM.startTimerBtn.style.display = "none";
  DOM.pauseTimerBtn.style.display = "inline";
  DOM.currentFocusedTask.appendChild(focusedTaskCheckbox);

  intervalId = setInterval(() => {
    totalSeconds--;
    updateTimerDisplay();
    updateRing(totalSeconds);

    if (totalSeconds <= 0) {
      clearInterval(intervalId);
      isRunning = false;
      if (Notification.permission === "granted") {
        new Notification("Focus timer finished! Take a break.");
      }
      updateFocusSessionsCount();
      restartTimer();
    }
  }, 1000);
  addActivity(`Started focus session: ${selectedFocusedTask}`, "focus");
}

function pauseTimer() {
  resetTimer();
  DOM.startTimerBtn.style.display = "inline";
  DOM.pauseTimerBtn.style.display = "none";
}

function restartTimer() {
  resetTimer();
  totalSeconds = totalTime;
  updateTimerDisplay();
  updateRing(totalSeconds);
  DOM.startTimerBtn.style.display = "inline";
  DOM.pauseTimerBtn.style.display = "none";
  DOM.currentFocusedTask.innerHTML = "";
  DOM.currentFocusedTask.style.display = "none";
  DOM.taskSelectionDropdown.style.display = "inline";
  DOM.timerButtons.style.marginTop = "0px";
}

DOM.startTimerBtn.addEventListener("click", startTimer);
DOM.pauseTimerBtn.addEventListener("click", pauseTimer);
DOM.restartTimerBtn.addEventListener("click", restartTimer);

updateTimerDisplay();
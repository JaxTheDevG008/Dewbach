const askForNotifications = document.querySelector(".askForNotifications");
const enableNotificationsBtn = document.querySelector(".enableNotificationsBtn",);
const closeNotiPopup = document.querySelector(".closeNotiPopup");
const navigation = document.querySelector(".navigation");
const currentDate = document.querySelector(".currentDate");
const dynamicGreeting = document.querySelector(".greeting");
const toDoList = document.querySelector(".toDoList");
const listAndKanbanToggle = document.querySelector(".listAndKanbanToggle");
const addBtn = document.querySelector(".addBtn");
const taskCreationDiv = document.querySelector(".taskCreationDiv");
const actualTaskCreation = document.querySelector(".actualTaskCreation");
const taskInput = document.querySelector(".taskInput");
const taskAttrCreation = document.querySelector(".taskAttrCreation");
const taskPrioritySelector = document.querySelector(".taskPrioritySelector");
const noPriorityOption = document.querySelector(".noPriorityOption");
const lowPriorityOption = document.querySelector(".lowPriorityOption");
const mediumPriorityOption = document.querySelector(".mediumPriorityOption");
const highPriorityOption = document.querySelector(".highPriorityOption");
const taskDateInput = document.querySelector(".taskDateInput");
const taskTimeInput = document.querySelector(".taskTimeInput");
const taskStatusSelector = document.querySelector(".taskStatusSelector");
const toDoStatus = document.querySelector(".toDoStatus");
const inProgressStatus = document.querySelector(".inProgressStatus");
const blockedStatus = document.querySelector(".blockedStatus");
const doneStatus = document.querySelector(".doneStatus");
const addAndCancelButtons = document.querySelector(".addAndCancelButtons");
const cancelTaskCreationBtn = document.querySelector(".cancelTaskCreationBtn");
const addTaskBtn = document.querySelector(".addTaskBtn");
const taskList = document.querySelector("ul");
const noTasksYetAlert = document.querySelector(".noTasksYetAlert");
const dropZones = document.querySelector(".dropZones");
const toDoDropZone = document.querySelector(".toDoDropZone");
const inProgressDropZone = document.querySelector(".inProgressDropZone");
const allDoneDropZone = document.querySelector(".allDoneDropZone");
const focusTimer = document.querySelector(".focusTimer");
const timerMinutesDiv = document.querySelector(".timerMinutesDiv");
const timerProgressRing = document.querySelector(".timerProgressRing");
const timerMinutes = document.querySelector(".timerMinutes");
const lengthButtons = document.querySelectorAll(".timerLengthOptions button");
const startTimerBtn = document.querySelector(".startTimerBtn");
const pauseTimerBtn = document.querySelector(".pauseTimerBtn");
const restartTimerBtn = document.querySelector(".restartTimerBtn");
const themeBtn = document.querySelector(".themeBtn");

let calendar;

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: "",
      center: "prev,title,next",
      right: ""
    }
  });
  calendar.render();
});

function responsiveWebsite() {
  if (window.innerWidth < 768) {
    console.log("Mobile");
  } else {
    console.log("Desktop");
  }
  requestAnimationFrame(responsiveWebsite);
}

responsiveWebsite();

window.addEventListener("load", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    taskList.innerHTML = savedTasks;
    // Reattach hover listeners for taskOptionsBtn
    document.querySelectorAll(".listItem").forEach((listItem) => {
      const mainTask = listItem.querySelector(".mainTask");
      const taskOptionsBtn = mainTask.querySelector(".taskOptionsBtn");
      mainTask.addEventListener("mouseenter", () => {
        taskOptionsBtn.style.display = "inline";
      });
      mainTask.addEventListener("mouseleave", () => {
        taskOptionsBtn.style.display = "none";
      });
    });
    updateTasksDoneCount();
    noTasksYetAlert.style.display = "none";
  }
})

const now = new Date();
const formattedCurrentDate = now.toLocaleDateString('en-US', { dateStyle: 'full' });

currentDate.textContent = formattedCurrentDate;

const currentHour = now.getHours();

if (currentHour < 12) {
  dynamicGreeting.textContent = "Good morning, Jaxon!";
} else if (currentHour >= 12 && currentHour <= 17) {
  dynamicGreeting.textContent = "Good afternoon, Jaxon!";
} else {
  dynamicGreeting.textContent = "Good evening, Jaxon!";
}

enableNotificationsBtn.addEventListener("click", () => {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      askForNotifications.style.display = "none";
      localStorage.setItem("askForNotiDisplay", "none");
    } else {
      askForNotifications.style.display = "inline";
      localStorage.setItem("askForNotiDisplay", "visible");
    }
  });
});

closeNotiPopup.addEventListener("click", () => {
  toDoList.style.marginTop = "0px";
  navigation.style.marginTop = "0px";
  askForNotifications.style.display = "none";
  localStorage.setItem("askForNotiDisplay", "none");

  const notiReminder = document.createElement("div");
  notiReminder.className = "notiReminder";
  notiReminder.textContent = "You can always setup notifications in settings.";
  notiReminder.classList.add("show");
  document.body.appendChild(notiReminder);
  setTimeout(() => {
    if (notiReminder.parentNode) {
      notiReminder.parentNode.removeChild(notiReminder);
    }
  }, 4000);
});

window.addEventListener("load", () => {
  const savedAskForNotiDisplay = localStorage.getItem("askForNotiDisplay");
  if (savedAskForNotiDisplay) {
    askForNotifications.style.display = "none";
    navigation.style.marginTop = "0px";
    toDoList.style.marginTop = "0px";
  } else {
    askForNotifications.style.display = "inline";
    navigation.style.marginTop = "44px";
    toDoList.style.marginTop = "44px";
  }
});

themeBtn.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

const newTheme = localStorage.getItem("theme");
if (newTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
} else {
  document.documentElement.removeAttribute("data-theme");
}

noTasksYetAlert.style.display = "inline";

let isDraggable = false;

listAndKanbanToggle.addEventListener("click", () => {
    isDraggable = !isDraggable;

    const allTasks = document.querySelectorAll(".mainTask");
    allTasks.forEach(task => {
      task.draggable = isDraggable;

      task.style.cursor = "grab";

      const checkbox = task.querySelector(".checkbox");

      if (checkbox && checkbox.checked) {
        allDoneDropZone.appendChild(task);
      } else {
        toDoDropZone.appendChild(task);
      }
    });

    toDoList.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("mainTask")) {
        e.target.classList.add("dragging");
      }
    });

    toDoList.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("mainTask")) {
        e.target.classList.remove("dragging");
      };
    });

    taskList.classList.toggle("drag-mode", isDraggable);

    dropZones.style.display = isDraggable ? "flex" : "none";

    noTasksYetAlert.style.display = "none";
});

[toDoDropZone, inProgressDropZone, allDoneDropZone].forEach(zone => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over-active");
      })

      zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over-active");
      })

      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over-active");

        const draggedTask = document.querySelector(".dragging");

        if (draggedTask) {
          zone.appendChild(draggedTask);
        }
    });
});

addBtn.addEventListener("click", () => {
  taskCreationDiv.style.display = "flex";
});

cancelTaskCreationBtn.addEventListener("click", () => {
  taskCreationDiv.style.display = "none";
})

addTaskBtn.addEventListener("click", () => {
  noTasksYetAlert.style.display = "none";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";

  const taskText = taskInput.value.trim();

  const taskPriority = taskPrioritySelector.value;

  const taskDate = taskDateInput.value;

  let formattedDate = "";

  if (taskDate) {
    const dateObject = new Date(taskDate + "T00:00:00");
    formattedDate = dateObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }

  const taskTime = taskTimeInput.value;

  const taskStatus = taskStatusSelector.value;

  const taskOptionsBtnDiv = document.createElement("div");
  taskOptionsBtnDiv.className = "taskOptionsBtnDiv";

  const taskOptionsBtn = document.createElement("button");
  taskOptionsBtn.className = "taskOptionsBtn"
  taskOptionsBtn.innerHTML = `<img class="taskOptionsBtnIcon" src="../../Images/Task Options Icon.png" alt="Task Options Icon">`
  taskOptionsBtn.style.display = "none";

  const taskOptions = document.createElement("div");
  taskOptions.className = "taskOptions";
  taskOptions.style.display = "none";
  taskOptions.style.zIndex = "9999";

  const editOption = document.createElement("div");
  editOption.className = "taskOption";
  editOption.textContent = "Edit";

  const deleteOption = document.createElement("div");
  deleteOption.className = "taskOption";
  deleteOption.textContent = "Delete";
  deleteOption.style.color = "red";

  taskOptions.appendChild(editOption);
  taskOptions.appendChild(deleteOption);


  const taskPriorityValue = taskPrioritySelector.value;

  let eventColor = newTheme === "dark" ? "#06bdf9" : "#a9d6fb"; 

  if (taskPriorityValue === "Low") {
      eventColor = "#90ee90";
  } else if (taskPriorityValue === "Medium") {
      eventColor = "#ffcc00";
  } else if (taskPriorityValue === "High") {
      eventColor = "#ff6b6b";
  } else {
      eventColor = newTheme === "dark" ? "#06bdf9" : "#a9d6fb";
  }

  if (taskText !== "") {
    const listItem = document.createElement("li");
    listItem.className = "listItem";
    listItem.dataset.dateNotified = "false";
    listItem.dataset.timeNotified = "false";
    listItem.dataset.dueDate = taskDate;
    listItem.dataset.dueTime = taskTime;

    const mainTask = document.createElement("label");
    mainTask.className = "mainTask";
    mainTask.draggable = isDraggable;

    const taskContents = document.createElement("div");
    taskContents.className = "taskContents";

    const taskTextAndCheckbox = document.createElement("div");
    taskTextAndCheckbox.className = "taskTextAndCheckbox";

    const taskTextSpan = document.createElement("span");
    taskTextSpan.className = "taskTextSpan";
    taskTextSpan.textContent = taskText;

    const taskAttributes = document.createElement("div");
    taskAttributes.className = "taskAttributes";

    const taskPrioritySpan = document.createElement("span");
    taskPrioritySpan.className = "taskPrioritySpan";
    taskPrioritySpan.textContent = taskPriority;

    const taskDateAndTime = document.createElement("div");
    taskDateAndTime.className = "taskDateAndTime";

    const taskDateAndTimeSpan = document.createElement("span");
    taskDateAndTimeSpan.className = "taskDateAndTimeSpan";

    const taskDateImg = document.createElement("img");
    taskDateImg.className = "taskDateImg";
    taskDateImg.src = "../Images/Date Icon.png";
    taskDateImg.alt = "Date Icon";

    taskDateAndTimeSpan.textContent =
      (formattedDate ? "Due " + formattedDate : "") + (taskTime ? " at " + taskTime : "");

    const taskStatusSpan = document.createElement("span");
    taskStatusSpan.className = "taskStatusSpan";
    taskStatusSpan.textContent = taskStatus;

    taskTextAndCheckbox.prepend(checkbox);
    checkbox.addEventListener("change", (e) => {
      updateTasksDoneCount();
      e.stopPropagation();
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        taskTextSpan.style.color = checkbox.checked ? "gray" : "white";
      } else {
        taskTextSpan.style.color = checkbox.checked ? "gray" : "black";
      }
    });
    taskTextAndCheckbox.appendChild(taskTextSpan);
    taskContents.appendChild(taskTextAndCheckbox);
    taskAttributes.appendChild(taskPrioritySpan);
    taskDateAndTime.appendChild(taskDateImg);
    taskDateAndTime.appendChild(taskDateAndTimeSpan);
    if(taskDate || taskTime) {
      
    }
    taskAttributes.appendChild(taskStatusSpan);
    taskContents.appendChild(taskAttributes);
    mainTask.appendChild(taskContents);
    taskOptionsBtnDiv.appendChild(taskOptionsBtn);
    taskOptionsBtn.addEventListener("click", () => {
      taskOptions.style.display = taskOptions.style.display === "none" ? "inline" : "none";
    });
    taskOptionsBtnDiv.appendChild(taskOptions);
    mainTask.appendChild(taskOptionsBtnDiv);
    listItem.appendChild(mainTask);
    if (taskDate) {
      const startDateTime = taskTime ? `${taskDate}T${taskTime}` : taskDate;
      calendar.addEvent({
        title: taskText,
        start: startDateTime,
        allDay: !taskTime,
        backgroundColor: eventColor,
        extendedProps: {
          priority: taskPrioritySelector.value,
          status: taskStatusSelector.value
        }
      })
    }
    mainTask.addEventListener("mouseenter", () => {
      taskOptionsBtn.style.display = "inline";
    })
    mainTask.addEventListener("mouseleave", () => {
      taskOptionsBtn.style.display = "none";
    })
    mainTask.addEventListener("click", () => {
      updateTasksDoneCount();
      if (e.target === checkbox) return;

      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    })
    taskList.appendChild(listItem);
    localStorage.setItem("tasks", taskList.innerHTML);
    updateTasksDoneCount();
    taskInput.value = "";
    taskDateInput.value = "";
    taskTimeInput.value = "";
  } else {
  }
  taskCreationDiv.style.display = "none";
});

/* taskList.innerHTML = "";
localStorage.setItem("tasks", "");
noTasksYetAlert.style.display = "inline";
updateTasksDoneCount(); */

function showNoTasksYet() {
  if (taskList.childElementCount === 0) {
    noTasksYetAlert.style.display = "inline";
  } else {
    noTasksYetAlert.style.display = "none";
  }
}

function updateTasksDoneCount() {
  const totalTasks = taskList.querySelectorAll(".checkbox").length;
  const doneTasks = taskList.querySelectorAll(".checkbox:checked").length;
  const tasksLeft = totalTasks - doneTasks;

  const doneDisplay = document.querySelector(".numberOfTasksDone");
  if (doneDisplay) {
    doneDisplay.textContent = doneTasks;
  } else {
    doneDisplay.textContent = "0";
  }

  const tasksLeftDisplay = document.querySelector(".numberOfTasksLeft");
  if (tasksLeftDisplay) {
    tasksLeftDisplay.textContent = tasksLeft;
  } else {
    tasksLeftDisplay.textContent = "0";
  }

  const totalTasksDisplay = document.querySelector(".numberOfTasksTotal")
  if (totalTasksDisplay) {
    totalTasksDisplay.textContent = `of ${totalTasks} total`;
  }
}

function checkTaskDue(listItem, taskText) {
  const checkbox = listItem.querySelector("input[type='checkbox']");
  if (Notification.permission !== "granted" || checkbox?.checked) return;

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const dueDate = listItem.dataset.dueDate;
  const dueTime = listItem.dataset.dueTime;
  if (dueDate === today && listItem.dataset.dateNotified !== "true") {
    new Notification("Task Due Today", {
      body: `Your task "${taskText}" is due today.`,
    });
    listItem.dataset.dateNotified = "true";
  }

  if (
    dueDate === today &&
    dueTime &&
    listItem.dataset.timeNotified !== "true"
  ) {
    const [hour, minute] = dueTime.split(":").map(Number);

    const due = new Date(now);
    due.setHours(hour, minute, 0, 0);
    if (now >= due) {
      new Notification("Task Due Now", {
        body: `Your task "${taskText}" is due now.`,
      });
      listItem.dataset.timeNotified = "true";
    }
  }
}

setInterval(() => {
  document.querySelectorAll(".listItem").forEach((listItem) => {
    const span = listItem.querySelector("span");
    const text = span.dataset.taskText || span.textContent;
    checkTaskDue(listItem, text);
  });
}, 1000);

const circumference = 283;
let totalTime = 25 * 60;
let totalSeconds = totalTime;
let intervalId = null;
let isRunning = false;

pauseTimerBtn.style.display = "none";

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerMinutes.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateRing(timeLeft) {
  const fraction = timeLeft / totalTime;
  const offset = circumference - (fraction * circumference);
  timerProgressRing.style.strokeDashoffset = offset;
}

lengthButtons.forEach(button => {
  button.addEventListener("click", () => {
    const minutes = parseInt(button.textContent);
    totalTime = minutes * 60;
    restartTimer();
  })
})

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTimerBtn.style.display = "none";
  pauseTimerBtn.style.display = "inline";

  intervalId = setInterval(() => {
    totalSeconds--;
    updateTimerDisplay();
    updateRing(totalSeconds);

    if (totalSeconds <= 0) {
      clearInterval(intervalId);
      isRunning = false;
      new Notification("Focus timer finished! Take a break.")
      restartTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(intervalId);
  isRunning = false;
  startTimerBtn.style.display = "inline";
  pauseTimerBtn.style.display = "none";
}

function restartTimer() {
  clearInterval(intervalId);
  isRunning = false;
  totalSeconds = totalTime
  updateTimerDisplay();
  updateRing(totalTime);
  startTimerBtn.style.display = "inline";
  pauseTimerBtn.style.display = "none";
}

startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
restartTimerBtn.addEventListener("click", restartTimer);

updateTimerDisplay();
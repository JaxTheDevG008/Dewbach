import DOM from "../core/dom.js";
import { tasks } from "core/state.js";

let currentDraggedTask = null;

function bindTaskEvents(listTask, task) {
    const taskId = task.id;
    const mainTask = listTask.querySelector(".mainTask");
    const checkbox = listTask.querySelector(".checkbox");
    const taskOptionsBtn = listTask.querySelector(".taskOptionsBtn");
    const taskOptions = listTask.querySelector(".taskOptions");
    const editOption = listTask.querySelector("[data-role='edit']");
    const deleteOption = listTask.querySelector("[data-role='delete']");

    mainTask.addEventListener("mouseenter", () => {
    const taskOptionsBtn = mainTask.querySelector(".taskOptionsBtn");
    if (!taskOptionsBtn) return;

    taskOptionsBtn.classList.add("show");
    });

    mainTask.addEventListener("mouseleave", () => {
    const taskOptionsBtn = mainTask.querySelector(".taskOptionsBtn");
    if (!taskOptionsBtn) return;

    taskOptionsBtn.classList.remove("show");
    });

    mainTask.addEventListener("dragstart", (e) => {
    currentDraggedTask = mainTask;
    mainTask.classList.add("dragging");

    e.dataTransfer.setData("text/plain", taskId);
    });

    mainTask.addEventListener("dragend", () => {
    currentDraggedTask = null;
    mainTask.classList.remove("dragging");
    });

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;

        listTask.classList.toggle("completed", task.completed);

        saveTasks();
        updateTasksDoneCount();
    });

    taskOptionsBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const rect = taskOptionsBtn.getBoundingClientRect();

    taskOptions.style.position = "fixed";
    taskOptions.style.top = `${rect.bottom}px`;
    taskOptions.style.left = `${rect.left}px`;

    taskOptions.classList.toggle("show");
    });

    taskOptions.addEventListener("click", (e) => {
    e.stopPropagation();
    });

    editOption.addEventListener("click", () => {
    editingTaskId = taskId;
    isEditing = true;

    taskInput.blur();

    resetTaskForm();

    const task = tasks.find(t => String(t.id) === String(editingTaskId));

    taskOptions.classList.remove("show");

    document.body.appendChild(taskCreationDiv);

    DOM.taskCreationDiv.style.display = "flex";
    DOM.taskCreationDiv.style.position = "fixed";
    DOM.taskCreationDiv.style.zIndex = "9999";
    DOM.taskCreationDiv.style.top = "50%";
    DOM.taskCreationDiv.style.left = "50%";
    DOM.taskCreationDiv.style.transform = "translate(-50%, -50%)";

    DOM.addTaskBtn.textContent = "Save Task";
    DOM.addTaskBtn.style.padding = "0px 8px";

    showOverlay();

    if (task) {
        DOM.taskInput.value = task.title;
        DOM.taskPrioritySelector.value = task.priority || "None";
        DOM.taskDateInput.value = task.dueDate || "";
        DOM.taskTimeInput.value = task.dueTime || "";
        DOM.taskStatusSelector.value = task.status || "To Do";
    }

    cancelTaskCreationBtn.onclick = () => {
        DOM.taskCreationDiv.style.display = "none";
        DOM.taskCreationDiv.style.position = "relative";
        DOM.taskCreationDiv.style.top = "0px";
        DOM.taskCreationDiv.style.left = "0px";
        DOM.taskCreationDiv.style.transform = "none";
        DOM.taskCreationDiv.style.order = "0";
        DOM.taskCreationDiv.style.zIndex = "0";

        hideOverlay();
        toDoList.insertBefore(taskCreationDiv, toDoListHeader.nextSibling);

        resetTaskForm();

        console.log("Value AFTER:", taskInput.value);
    };
    });

    deleteOption.addEventListener("click", () => {
    const taskIndex = tasks.findIndex(t => String(t.id) === String(taskId));
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        refreshTaskDropdown();
    }
    saveTasks();

    updateTasksDoneCount();
    showNoTasksYet();
    refreshTaskDropdown();
    addActivity(`Deleted task: ${task.title}`, "delete");
    listTask.remove();
    taskOptions.classList.remove("show");
    });
}

function renderTask(task) {
    const taskId = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = task.completed;

    const taskText = task.title;


    let taskPriority = task.priority;
    if (taskPriority === "None") {
    taskPriority = "";
    }

    const taskDate = task.dueDate;

    let formattedDate = "";

    if (taskDate) {
    const dateObject = new Date(taskDate + "T00:00:00");
    formattedDate = dateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
    }

    const taskTime = task.dueTime;

    const taskStatus = task.status;

    const taskOptionsBtnDiv = document.createElement("div");
    taskOptionsBtnDiv.className = "taskOptionsBtnDiv";

    const taskOptionsBtn = document.createElement("button");
    taskOptionsBtn.className = "taskOptionsBtn";
    taskOptionsBtn.innerHTML = `<img class="taskOptionsBtnIcon" src="Images/Task-Options-Icon.png" alt="Task Options Icon">`;

    const taskOptions = document.createElement("div");
    taskOptions.className = "taskOptions";

    const editOption = document.createElement("div");
    editOption.className = "taskOption";
    editOption.textContent = "Edit";
    editOption.dataset.role = "edit";

    const deleteOption = document.createElement("div");
    deleteOption.className = "taskOption";
    deleteOption.textContent = "Delete";
    deleteOption.style.color = "red";
    deleteOption.dataset.role = "delete";

    taskOptions.append(editOption, deleteOption);

    const listTask = document.createElement("li");
    listTask.className = "listTask";
    if (task.completed) {
    listTask.classList.add("completed");
    }
    listTask.dataset.dateNotified = "false";
    listTask.dataset.timeNotified = "false";
    listTask.dataset.priority = taskPriority;
    listTask.dataset.dueDate = taskDate;
    listTask.dataset.dueTime = taskTime;
    listTask.dataset.status = normalizeTaskStatus(task.status);
    listTask.id = taskId;

    const mainTask = document.createElement("label");
    mainTask.className = "mainTask";
    mainTask.draggable = isDraggable;
    mainTask.dataset.id = taskId;

    const taskContents = document.createElement("div");
    taskContents.className = "taskContents";

    const taskTextAndCheckbox = document.createElement("div");
    taskTextAndCheckbox.className = "taskTextAndCheckbox";

    const taskTextSpan = document.createElement("span");
    taskTextSpan.className = "taskTextSpan";
    taskTextSpan.textContent = taskText;
    taskTextSpan.dataset.taskText = taskText;
    taskTextSpan.dataset.originalTaskText = taskTextSpan.textContent;

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
    taskDateImg.src = "Images/Date-Icon.png";
    taskDateImg.alt = "Date Icon";

    taskDateAndTimeSpan.textContent =
    (formattedDate ? "Due " + formattedDate : "") +
    (taskTime ? " at " + taskTime : "");

    const taskStatusSpan = document.createElement("span");
    taskStatusSpan.className = "taskStatusSpan";
    taskStatusSpan.textContent = taskStatus;

    taskTextAndCheckbox.prepend(checkbox);

    taskTextAndCheckbox.appendChild(taskTextSpan);
    taskContents.appendChild(taskTextAndCheckbox);

    taskAttributes.appendChild(taskPrioritySpan);
    taskDateAndTime.appendChild(taskDateImg);
    taskDateAndTime.appendChild(taskDateAndTimeSpan);
    taskAttributes.appendChild(taskStatusSpan);
    taskContents.appendChild(taskAttributes);

    mainTask.appendChild(taskContents);
    taskOptionsBtnDiv.appendChild(taskOptionsBtn);
    mainTask.appendChild(taskOptionsBtnDiv);
    listTask.appendChild(mainTask);
    listTask.appendChild(taskOptions);
    return listTask;
}

function mountTask(task) {
    const el = renderTask(task);
    bindTaskEvents(el, task);
    DOM.taskList.appendChild(el);
}

export function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const task = {
    id: crypto.randomUUID(),
    title: taskText,
    priority: taskPrioritySelector.value,
    dueDate: taskDateInput.value || null,
    dueTime: taskTimeInput.value || null,
    status: taskStatusSelector.value,
    completed: false,
    };

    tasks.push(task);
    saveTasks();

    mountTask(task);
    addTaskToCalendar(task);
    refreshTaskDropdown();
    updateTasksDoneCount();
    addActivity(`Added task: ${taskText}`, "task");

    DOM.toDoList.style.height = "328.5px";
    DOM.focusTimer.style.height = "330px";
    DOM.taskCreationDiv.style.display = "none";
    resetTaskForm();
}

function saveEditedTask() {
  const task = tasks.find(t => String(t.id) === String(editingTaskId));
  if (!task) return;
  
  task.title = taskInput.value.trim();
  task.priority = taskPrioritySelector.value;
  task.dueDate = taskDateInput.value || null;
  task.dueTime = taskTimeInput.value || null;
  task.status = taskStatusSelector.value;

  saveTasks();
  DOM.taskList.innerHTML = "";
  tasks.forEach(mountTask);
  editingTaskId = null;
  isEditing = false;
  DOM.taskCreationDiv.style.display = "none";
  hideOverlay();
}

export function normalizeTaskStatus(status) {
  if (!status) return "to-do";
  const normalized = status.toLowerCase().replace(/\s/g, "-");

  if (normalized === "todo") return "to-do";
  if (normalized === "in-progress") return "in-progress";
  if (normalized === "done") return "done";

  return normalized;
}

DOM.listAndKanbanToggle.addEventListener("click", () => {
  isDraggable = !isDraggable;

  const allTasks = document.querySelectorAll(".mainTask");
  allTasks.forEach((task) => {
    task.draggable = isDraggable;

    task.style.cursor = isDraggable ? "grab" : "default";

    if (task.dataset.status === "done") {
      DOM.allDoneDropZone.appendChild(task);
    } else if (task.dataset.status === "in-progress") {
      DOM.inProgressDropZone.appendChild(task);
    } else {
      DOM.toDoDropZone.appendChild(task);
    }
  });

  DOM.taskList.classList.toggle("drag-mode", isDraggable);
  document.body.classList.toggle("isKanbanView");

  DOM.dropZones.style.display = isDraggable ? "flex" : "none";

  DOM.noTasksYetAlert.style.display = "none";
});

[DOM.toDoDropZone, DOM.inProgressDropZone, DOM.allDoneDropZone].forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over-active");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over-active");
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over-active");

    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const draggedTask = document.querySelector(`[data-id="${taskId}"]`);
    if (!draggedTask) return;

    const task = tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    const newStatus = normalizeTaskStatus(zone.dataset.status);
    task.status = newStatus;

    draggedTask.dataset.status = zone.dataset.status;
    draggedTask.classList.toggle("completed", newStatus === "done");
    zone.appendChild(draggedTask);

    saveTasks();
  });
});

addBtn.addEventListener("click", () => {
  DOM.taskCreationDiv.style.display = "flex";
  resetTaskForm();
  DOM.toDoList.style.height = "495px";
  DOM.focusTimer.style.height = "496.5px";
});

cancelTaskCreationBtn.addEventListener("click", () => {
  DOM.taskCreationDiv.style.display = "none";
  DOM.toDoList.style.height = "328.5px";
  DOM.focusTimer.style.height = "330px";
});

addTaskBtn.addEventListener("click", () => {
  if (editingTaskId) {
    saveEditedTask();
  } else {
    addTask();
  }
  showNoTasksYet();
});

export function showNoTasksYet() {
  if (DOM.taskList.children.length === 0) {
    DOM.noTasksYetAlert.style.display = "inline";
  } else {
    DOM.noTasksYetAlert.style.display = "none";
  }
}

export function checkTaskDue(listTask, taskText, task) {
  if (Notification.permission !== "granted" || task.completed) return;

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const dueDate = listTask.dataset.dueDate;
  const dueTime = listTask.dataset.dueTime;
  if (dueDate === today && listTask.dataset.dateNotified !== "true") {
    new Notification("Task Due Today", {
      body: `Your task "${taskText}" is due today.`,
    });
    listTask.dataset.dateNotified = "true";
  }

  if (
    dueDate === today &&
    dueTime &&
    listTask.dataset.timeNotified !== "true"
  ) {
    const [hour, minute] = dueTime.split(":").map(Number);

    const due = new Date(now);
    due.setHours(hour, minute, 0, 0);
    if (now >= due) {
      new Notification("Task Due Now", {
        body: `Your task "${taskText}" is due now.`,
      });
      listTask.dataset.timeNotified = "true";
    }
  }
}

function resetTaskForm() {
    DOM.taskInput.value = "";
    DOM.taskPrioritySelector.value = "None";
    DOM.taskDateInput.value = "";
    DOM.taskTimeInput.value = "";
    DOM.taskStatusSelector.value = "To Do";
}
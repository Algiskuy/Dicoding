document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

const todos = [];
const RENDER_EVENT = "render-todo";
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completed-todos");
  completedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});
function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", function () {
      editTask(todoObject);
    });
    container.append(checkButton, editButton, trashButton);
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
  }

  return container;
}

function editTask(todoObject) {
  const todoTarget = findTodoIndex(todoObject.id);

  if (todoTarget !== -1) {
    const textTitle = document.getElementById("title");
    const textTimestamp = document.getElementById("date");

    textTitle.value = todos[todoTarget].task;
    textTimestamp.value = todos[todoTarget].timestamp;

    const submitButton = document.querySelector(".btn-submit");
    submitButton.innerText = "Update";

    const existingCancelButton = document.querySelector("#cancel-button");
    if (existingCancelButton) {
      existingCancelButton.remove();
    }

    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancel-button");
    cancelButton.setAttribute("class", "cancel-button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", function () {
      cancelEdit();
    });

    const box = document.querySelector(".box-button");
    box.append(cancelButton);

    submitButton.onclick = function () {
      updateTask(todoTarget, textTitle.value, textTimestamp.value);
    };
  }
}

function cancelEdit() {
  const submitButton = document.querySelector(".btn-submit");
  submitButton.onclick = addTodo;

  const cancelButton = document.querySelector("#cancel-button");
  if (cancelButton) {
    cancelButton.remove();
  }
  const textTitle = document.getElementById("title");
  const textTimestamp = document.getElementById("date");
  submitButton.innerText = "Submit";
  textTitle.value = "";
  textTimestamp.value = "";
}

function updateTask(index, newTask, newTimestamp) {
  if (index >= 0 && index < todos.length) {
    todos[index].task = newTask;
    todos[index].timestamp = newTimestamp;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    const submitButton = document.querySelector(".btn-submit");
    submitButton.innerText = "Submit";
    const cancelButton = document.querySelector("#cancel-button");
    cancelButton.classList.add("hidden");

    submitButton.onclick = addTodo;
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
  }
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}
function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {});
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

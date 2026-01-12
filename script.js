
let taskData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');

let draggedTask = null;

/*  TASK FUNCTIONS --- */

function addTask(title, desc, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete">Delete</button>
    `;

    addDragEvents(div);

    // delete
    div.querySelector(".delete").addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    column.appendChild(div);
}

/*  DRAG FUNCTIONS --- */

function addDragEvents(task) {
    task.addEventListener("dragstart", () => {
        draggedTask = task;
        task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
        draggedTask = null;
        task.classList.remove("dragging");
        updateTaskCount();
    });
}

/*  COLUMN EVENTS --- */

function addDragEventsOnColumn(column) {
    column.addEventListener("dragover", e => e.preventDefault());

    column.addEventListener("drop", () => {
        if (draggedTask) {
            column.appendChild(draggedTask);
        }
    });
}

[todo, progress, done].forEach(addDragEventsOnColumn);

/*  SAVE & COUNT --- */

function updateTaskCount() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll(".task");
        col.querySelector(".right").innerText = tasks.length;

        taskData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector("h2").innerText,
            desc: t.querySelector("p").innerText
        }));
    });

    localStorage.setItem("task", JSON.stringify(taskData));
}

/*  LOAD FROM STORAGE --- */

if (localStorage.getItem("task")) {
    taskData = JSON.parse(localStorage.getItem("task"));

    for (const col in taskData) {
        const column = document.querySelector(`#${col}`);
        taskData[col].forEach(t =>
            addTask(t.title, t.desc, column)
        );
    }
    updateTaskCount();
}

/* MODAL --- */

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.onclick = () => modal.classList.add("active");
modalBg.onclick = () => modal.classList.remove("active");

/* ADD NEW TASK --- */

addTaskButton.addEventListener("click", () => {
    const title = document.querySelector("#task-title-input").value.trim();
    const desc = document.querySelector("#task-desc-input").value.trim();

    if (!title || !desc) return;

    addTask(title, desc, todo);
    updateTaskCount();

    modal.classList.remove("active");
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
});

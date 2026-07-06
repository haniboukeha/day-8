const display = document.querySelector(".display");
const reset = document.querySelector(".reset");
const buttons = document.querySelectorAll(".buttons button");

let a = null;
let b = null;
let operator = "";

reset.addEventListener("click", () => {
    display.textContent = "0";
    a = null;
    b = null;
    operator = "";
});

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        // If an operator is pressed
        if (value === "+" || value === "-" || value === "*" || value === "/") {
            a = Number(display.textContent);
            operator = value;
            display.textContent = "0";
        }

        // If = is pressed
        else if (value === "=") {
            b = Number(display.textContent);

            let result;

            if (operator === "+") {
                result = a + b;
            } else if (operator === "-") {
                result = a - b;
            } else if (operator === "*") {
                result = a * b;
            } else if (operator === "/") {
                result = a / b;
            }

            display.textContent = result;
        }

        // If a number or . is pressed
        else {
            if (display.textContent === "0") {
                display.textContent = value;
            } else {
                display.textContent += value;
            }
        }
    });
});
const taskInput = document.querySelector(".task-input");
const addBtn = document.querySelector(".add-btn");
const taskList = document.  querySelector(".task-list");
const tasksLeft = document.querySelector(".tasks-left");
const clearCompleted = document.querySelector(".clear-completed");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
// =========================
// Save
// =========================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =========================
// Update Counter
// =========================

function updateCounter() {
    const remaining = tasks.filter(task => !task.completed).length;

    tasksLeft.textContent =
        `${remaining} task${remaining !== 1 ? "s" : ""} left`;
}

// =========================
// Render
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

       

        if (currentFilter === "active" && task.completed) return;

        if (currentFilter === "completed" && !task.completed) return;

         const li = document.createElement("li");
        li.classList.add("task");

        li.innerHTML = `
            <input
                type="checkbox"
                class="task-check"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text"
            style="
                text-decoration:${task.completed ? "line-through" : "none"};
                opacity:${task.completed ? ".5" : "1"};
            ">
                ${task.text}
            </span>

            <button class="delete-btn">Delete</button>
        `;
    // Create the <li> here...


        // Checkbox
        li.querySelector(".task-check").onclick = () => {
            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            renderTasks();
        };

        // Delete
        li.querySelector(".delete-btn").onclick = () => {

            tasks.splice(index, 1);

            saveTasks();
            renderTasks();

        };

        taskList.appendChild(li);

    });

    updateCounter();

}

renderTasks();

// =========================
// Add Task
// =========================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();

    renderTasks();

}
filters.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons
        filters.forEach(btn => btn.classList.remove("active"));

        // Add active class to the clicked button
        button.classList.add("active");

        currentFilter = button.textContent.toLowerCase();

        renderTasks();

    });

});

addBtn.onclick = addTask;

// Enter key
taskInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        addTask();

    }

});

// =========================
// Clear Completed
// =========================

clearCompleted.onclick = () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

};
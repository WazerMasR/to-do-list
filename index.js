let tasks = [];

// LocalStorage 
function taskStorage() {
  // JSON.stringify => convert json or array into string
  let tasksString = JSON.stringify(tasks);
  localStorage.setItem("tasks", tasksString);
};

// JSON.parse => convert string into json or arry 
tasks = JSON.parse(localStorage.getItem("tasks") || "[]");



// Tost Message
function showToast(message, type = "success") {
  let toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove(); 
    }, 500);
  }, 3000); 
}
// 



let index = 0;
function renderTasks() {

  let taskContainer = document.getElementById("tasks")
  taskContainer.innerHTML = "";

  // Check if there are tasks or not.
  if (tasks.length === 0) {
    taskContainer.innerHTML = `<h2 class="no-tasks"><span>No Tasks</span>, Please Enter Your Tasks</h2>`;
}

tasks.forEach((task, index) => {
  let content = document.createElement("div");
  content.classList.add("table", "table-content", "flex");


  if (task.isDone) {
    content.classList.add("completed");
  }

  content.innerHTML = `
    <div class="left">
      <h2>${task.title}</h2>
      <div class="calendar">
        <span class="material-icons">calendar_month</span>
        <span>${task.date}</span>
      </div>
    </div>
    <div class="right flex">
        ${task.isDone? `
        <button onclick="toggleTaskCompletion(${index})" class="circle cancle-btn" data-index=${index}>
        <span class="material-icons complete">cancel</span>
        </button>
        ` : `
        <button onclick="toggleTaskCompletion(${index})" class="circle complete-btn" data-index=${index}>
        <span class="material-icons complete">task_alt</span>
        </button>
      `}
      <button onclick="editTask(${index})" class="circle edit-btn" data-index=${index}>
        <span class="material-icons edit">edit</span>
      </button>
      <button onclick="deleteTask(${index})" class="circle delete-btn" data-index=${index}>
        <span class="material-icons delete">delete</span>
      </button>
    </div>
  `;

  taskContainer.appendChild(content);
  index++
});
}

renderTasks();

let btnAddPost = document.getElementById("btn-add-post")
btnAddPost.addEventListener("click", function() {

  // Show Input
  let inputContainer = document.getElementById("input-container");
    inputContainer.classList.add("show");

  // give browser some time then focus on input
  let input = document.getElementById("input")
  setTimeout(() => input.focus(), 30);

document.getElementById("add-task").onclick = function(event) {
  event.preventDefault();

    // Check if input empty
    let input = document.getElementById("input");
    let taskTitle = input.value.trim();
    if (taskTitle === "") {
        alert("Task title can't be empty!");
        return;
    }

    // Date and Time
    function getCurrentDateTime() {
      let now = new Date();

      // Get Date
      let day = now.getDate();
      let month = now.getMonth() + 1; // الأشهر تبدأ من 0 لذلك نضيف 1
      let year = now.getFullYear();
  
      // Get Time
      let hours = now.getHours() % 12 || 12; // convert hours from 24 to 12
      let minutes = now.getMinutes().toString().padStart(2, "0"); // add 0 if minutes < 10
      let amPm = now.getHours() < 12 ? "AM" : "PM"; // check Time if AM or PM

      return `${day}/${month}/${year} | ${hours}:${minutes} ${amPm}`;
  }

    // create Obj to push in array
    let taskObj = {
      title: input.value,
      date: getCurrentDateTime(),
      isDone: false,
    };
    tasks.push(taskObj); // push obj in array
    showToast("Task added successfully", "success");
    taskStorage();
    renderTasks(); // render Function 
    input.value = "";
  };


  // add task when press on Enter
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") { 
      document.getElementById("add-task").onclick();
    }
  });
})

// Delete item from array 
function deleteTask (del) {
  // Confirmation message
  let task = tasks[del]
  let isConfirmed = confirm(`Are you sure you are deleting: ${task.title}`);

  // Check if user want to delete task or not 
  if(isConfirmed) {
    tasks.splice(del, 1);
    showToast("Task deleted successfully", "error");
    taskStorage();
    renderTasks();
  }
}

// Another way to delete item from array
// document.addEventListener("click", function (event) {
//   if (event.target.closest(".delete-btn")) { 
//       let index = event.target.closest(".delete-btn").getAttribute("data-index"); 
//       tasks.splice(index, 1); 
//       renderTasks(); 
//   }
// });

// edit item in array 
function editTask (update) {
  let task = tasks[update]
  input.value = task.title;
  let editTask = document.getElementById("add-task");
  editTask.innerHTML = "Update" 
  let originalOnClick = editTask.onclick;

  let inputContainer = document.getElementById("input-container");
    inputContainer.classList.add("show");


  editTask.onclick = function () {
    if (input.value.trim() === "") {
      alert("Task title can't be empty!");
      return;
  }

    task.title = input.value.trim();
    input.value = "";
    editTask.innerHTML = "Add Task";
    editTask.onclick = originalOnClick;
    showToast("Task updated successfully", "info");
    taskStorage();
    renderTasks();
  }
}
//

// toggle Tasks Completions
function toggleTaskCompletion(index) {
  let task = tasks[index]
  task.isDone = !task.isDone;
  taskStorage();
  renderTasks();
}


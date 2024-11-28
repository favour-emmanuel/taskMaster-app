const taskListContainer = document.getElementById("task-list");
const priorityFilter = document.getElementById("priority-filter");

const fetchTasks = async (filter = "") => {
  try {
    let url = "http://localhost:5000/api/tasks";
    if (filter) {
      url += `?priority=${filter}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/loginPage.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    taskListContainer.innerHTML = "<p>Unable to load tasks.</p>";
  }
};

const renderTasks = (tasks) => {
  taskListContainer.innerHTML = "";
  if (tasks.length === 0) {
    taskListContainer.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    taskItem.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Deadline:</strong> ${
        task.deadline
          ? new Date(task.deadline).toLocaleDateString()
          : "No deadline"
      }</p>
      <div class="task-actions">
        <button onclick="editTask('${
          task._id
        }')">Update <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><g class="edit-outline"><g fill="currentColor" fill-rule="evenodd" class="Vector" clip-rule="evenodd"><path d="M2 6.857A4.857 4.857 0 0 1 6.857 2H12a1 1 0 1 1 0 2H6.857A2.857 2.857 0 0 0 4 6.857v10.286A2.857 2.857 0 0 0 6.857 20h10.286A2.857 2.857 0 0 0 20 17.143V12a1 1 0 1 1 2 0v5.143A4.857 4.857 0 0 1 17.143 22H6.857A4.857 4.857 0 0 1 2 17.143z"/><path d="m15.137 13.219l-2.205 1.33l-1.033-1.713l2.205-1.33l.003-.002a1.2 1.2 0 0 0 .232-.182l5.01-5.036a3 3 0 0 0 .145-.157c.331-.386.821-1.15.228-1.746c-.501-.504-1.219-.028-1.684.381a6 6 0 0 0-.36.345l-.034.034l-4.94 4.965a1.2 1.2 0 0 0-.27.41l-.824 2.073a.2.2 0 0 0 .29.245l1.032 1.713c-1.805 1.088-3.96-.74-3.18-2.698l.825-2.072a3.2 3.2 0 0 1 .71-1.081l4.939-4.966l.029-.029c.147-.15.641-.656 1.24-1.02c.327-.197.849-.458 1.494-.508c.74-.059 1.53.174 2.15.797a2.9 2.9 0 0 1 .845 1.75a3.15 3.15 0 0 1-.23 1.517c-.29.717-.774 1.244-.987 1.457l-5.01 5.036q-.28.281-.62.487m4.453-7.126s-.004.003-.013.006z"/></g></g></svg></button>
        <button onclick="deleteTask('${
          task._id
        }')">Delete <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.687 6.213L6.8 18.976a2.5 2.5 0 0 0 2.466 2.092h3.348m6.698-14.855L17.2 18.976a2.5 2.5 0 0 1-2.466 2.092h-3.348m-1.364-9.952v5.049m3.956-5.049v5.049M2.75 6.213h18.5m-6.473 0v-1.78a1.5 1.5 0 0 0-1.5-1.5h-2.554a1.5 1.5 0 0 0-1.5 1.5v1.78z"/></svg></button>
      </div>
    `;

    taskListContainer.appendChild(taskItem);
  });
};

const editTask = (taskId) => {
  window.location.href = `/index.html?id=${taskId}`;
};

const filterTasks = () => {
  const filterValue = priorityFilter.value;
  fetchTasks(filterValue);
};

const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    alert("Task deleted successfully!");
    fetchTasks(priorityFilter.value);
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Unable to delete task.");
  }
};

fetchTasks();

const searchBar = document.getElementById("search-bar");

const searchTasks = async () => {
  try {
    const keyword = searchBar.value.trim();
    let url = "http://localhost:5000/api/tasks";

    if (keyword) {
      url = `http://localhost:5000/api/tasks/search?keyword=${encodeURIComponent(
        keyword
      )}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to search tasks");
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error searching tasks:", error);
    taskListContainer.innerHTML = "<p>Unable to search tasks.</p>";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/loginPage.html";
    });
  }
});

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
      // Token is invalid or expired
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
          <button onclick="editTask('${task._id}')">Update</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      `;

    taskListContainer.appendChild(taskItem);
  });
};

const editTask = (taskId) => {
  window.location.href = `/edit-task.html?id=${taskId}`;
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

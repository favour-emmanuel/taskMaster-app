document.addEventListener("DOMContentLoaded", () => {
  const checkAuthentication = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/loginPage.html";
      return false;
    }

    return true;
  };

  if (!checkAuthentication()) {
    return;
  }

  // Only add event listener if the task form exists on this page
  const taskForm = document.getElementById("task-form");
  if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("task-title").value;
      const description = document.getElementById("task-desc").value;
      const deadline = document.getElementById("task-deadline").value;
      const priority = document.getElementById("task-priority").value;

      const newTask = { title, description, priority, deadline };

      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Task created successfully!");
          console.log(result);
          
          // Reset form
          taskForm.reset();

          // If on dashboard, refresh tasks
          if (typeof fetchTasks === 'function') {
            fetchTasks();
          }
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error("Error creating task:", error);
        alert("An error occurred while creating the task. Please try again.");
      }
    });
  }
});
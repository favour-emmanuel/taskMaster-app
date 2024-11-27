document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/loginPage.html";
    return;
  }

  // Add event listener for form submission
  document.getElementById("edit-task-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const taskId = document.getElementById("task-id").value;
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const deadline = document.getElementById("task-deadline").value;
    const priority = document.getElementById("task-priority").value;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          deadline,
          priority
        })
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/loginPage.html";
        return;
      }

      if (!response.ok) {
        // Enhanced error logging
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const updatedTask = await response.json();
      alert("Task updated successfully!");
      
      window.location.href = "/dashboard.html";

    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Unable to update task: ${error.message}`);
    }
  });

  // Fetch task details for editing
  try {
    const taskId = new URLSearchParams(window.location.search).get("id");
    
    if (!taskId) {
      throw new Error("No task ID provided");
    }

    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/loginPage.html";
      return;
    }

    if (!response.ok) {
      // Enhanced error logging
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const task = await response.json();

    // Populate form fields with existing task data
    document.getElementById("task-id").value = task._id;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-priority").value = task.priority;

    // Format deadline for date input
    if (task.deadline) {
      const deadlineDate = new Date(task.deadline);
      const formattedDeadline = deadlineDate.toISOString().split("T")[0];
      document.getElementById("task-deadline").value = formattedDeadline;
    }

  } catch (error) {
    console.error("Detailed Error loading task:", error);
    alert(`Unable to load task for editing: ${error.message}`);
    window.location.href = "/dashboard.html";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Login form functionality
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        console.log("Response:", response);

        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok) {
          console.log("Login successful!", data);
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard.html";
        } else {
          alert(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Server error, please try again later");
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: name, email, password }),
          }
        );

        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok) {
          alert("Registration successful! Please login.");
          window.location.href = "/loginPage.html";
        } else {
          alert(data.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
      }
    });
  }
});

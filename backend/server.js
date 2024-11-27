import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import auth from "./middleware/auth.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend")));

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/tasks", auth, taskRoutes); 

app.get("/dashboard.html", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dashboard.html"));
});


app.get("/edit-task.html", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "edit-task.html"));
});

// Catch-all route for login/signup pages
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "frontend", "loginPage.html"));
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
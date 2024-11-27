// routes/tasks.js
import express from "express";
import auth from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

// Get all tasks for a user with optional filtering
router.get("/", auth, async (req, res) => {
  try {
    const { priority } = req.query;
    const query = { user: req.userId };

    if (priority) {
      query.priority = priority;
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;
    const task = new Task({
      user: req.userId,
      title,
      description,
      priority,
      deadline: deadline ? new Date(deadline) : undefined,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single task by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Update a task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search tasks
router.get("/search", auth, async (req, res) => {
  try {
    const { keyword } = req.query;
    const tasks = await Task.find({
      user: req.userId,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

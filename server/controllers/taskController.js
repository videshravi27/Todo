const Task = require("../models/Task.js");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ clerkId: req.clerkId }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, clerkId: req.clerkId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = new Task({
      clerkId: req.clerkId,
      title,
      description,
      dueDate,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, clerkId: req.clerkId },
      { title, description, dueDate, status },
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({
      _id: id,
      clerkId: req.clerkId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

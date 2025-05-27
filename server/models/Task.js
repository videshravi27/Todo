const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Open", "Completed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

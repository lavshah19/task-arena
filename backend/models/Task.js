const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isDueDateChangeable: {
      type: Boolean,
      default: false, // initially, they can't change the due date
    },
    deletedAt: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Task", taskSchema);

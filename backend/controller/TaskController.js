const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, tags, isDueDateChangeable } = req.body;

    // Check if the dueDate is in the past
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be in the past.",
      });
    }

    // Split the tags if it's a string and remove extra spaces
    const formattedTags = Array.isArray(tags)
      ? tags
      : tags.split(' ').map((tag) => tag.trim()).filter((tag) => tag.length > 0);

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      tags: formattedTags, // Save the formatted tags
      user: req.userInfo.userId,
      isDueDateChangeable: isDueDateChangeable || false, // default to false
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: savedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create task.",
    });
  }
};

  
  
// Get All Tasks
const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userInfo.userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    if(!tasks || tasks.length===0){
        res.status(200).json({
            success: false,
            message: "empty task ."
          });
    }
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks.",
    });
  }
};

// Get Single Task
const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userInfo.userId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully.",
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task.",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { dueDate, tags } = req.body;

    // Check if the task exists
    const task = await Task.findOne({ _id: req.params.id, user: req.userInfo.userId, isDeleted: false });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // If due date is being updated, check if it's in the past
    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be in the past.",
      });
    }

    // If due date can't be changed, prevent updating the due date
    if (!task.isDueDateChangeable && dueDate) {
    req.body.dueDate = task.dueDate; // Keep the original due date
    }

    // Format tags if provided as a string
    if (tags && typeof tags === 'string') {
      req.body.tags = tags.split(' ').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    // Proceed with updating task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userInfo.userId, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update task.",
    });
  }
};

  
  

// Soft Delete Task
const deleteTask = async (req, res) => {
    try {
      const deletedTask = await Task.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.userInfo.userId,
          isDeleted: false,
        },
        {
          isDeleted: true,
          deletedAt: new Date(), // set current date and time
        },
        { new: true }
      );
  
      if (!deletedTask) {
        return res.status(404).json({
          success: false,
          message: "Task not found or already deleted.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Task soft-deleted successfully.",
        task: deletedTask,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to soft delete task.",
      });
    }
  };
  

const deleteTaskPermanently = async (req, res) => {
    try {
      // Find the task by ID and user, making sure it's not marked as deleted
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.userInfo.userId,
        isDeleted: true,
      });
  
      // If the task doesn't exist or is already soft deleted
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found or already deleted.",
        });
      }
  
      // Permanently delete the task from the database
      await Task.deleteOne({ _id: req.params.id });
  
      res.status(200).json({
        success: true,
        message: "Task permanently deleted.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to permanently delete task.",
      });
    }
  };


  const getDeletedTasks = async (req, res) => {
    try {
      const tasks = await Task.find({
        user: req.userInfo.userId,
        isDeleted: true,
      }).sort({ deletedAt: -1 });
  
      if (!tasks || tasks.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No soft-deleted tasks found.",
          tasks: [],
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Soft-deleted tasks fetched successfully.",
        tasks,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch soft-deleted tasks.",
      });
    }
  };
  

  
  const restoreDeletedTask = async (req, res) => {
    try {
      const restoredTask = await Task.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.userInfo.userId,
          isDeleted: true,
        },
        {
          isDeleted: false,
          deletedAt: null,
        },
        { new: true }
      );
  
      if (!restoredTask) {
        return res.status(404).json({
          success: false,
          message: "Task not found or not deleted.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Task restored successfully.",
        task: restoredTask,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to restore task.",
      });
    }
  };




  const updateTaskCompletionStatus = async (req, res) => {
  try {
    const { completed } = req.body;

    // Validate input
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid value for 'complete'. It must be a boolean.",
      });
    }

    // Find and update the task
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userInfo.userId,
        isDeleted: false,
      },
      { completed },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task completion status updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update task completion status.",
    });
  }
};

  
  
module.exports = {
  createTask,
  getAllTask,
  getSingleTask,
  updateTask,
  deleteTask,
  deleteTaskPermanently,
  restoreDeletedTask,
  getDeletedTasks,
  updateTaskCompletionStatus,

};

const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTask,
  getSingleTask,
  updateTask,
  deleteTask,
  deleteTaskPermanently,
  getDeletedTasks,
  restoreDeletedTask,
  updateTaskCompletionStatus,
} = require("../controller/TaskController");
const authMiddleware = require("../middleware/auth-Middleware");

router.post("/create", authMiddleware, createTask);
router.get("/get", authMiddleware, getAllTask);
router.get("/get/:id", authMiddleware, getSingleTask);
router.put("/update/:id", authMiddleware, updateTask);
router.put("/delete/:id", authMiddleware, deleteTask);
router.delete("/delete/permanent/:id", authMiddleware, deleteTaskPermanently);
router.get("/get-deleted", authMiddleware, getDeletedTasks);
router.patch("/restore/:id", authMiddleware, restoreDeletedTask);
router.patch("/complete/:id", authMiddleware, updateTaskCompletionStatus);

module.exports = router;

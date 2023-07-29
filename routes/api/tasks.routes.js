const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/tasks.controller");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/task.model");

router.post(
  "/",
  authenticate,
  validateBody(schemas.addTaskSchema, `missing fields`),
  ctrl.postTask
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.updateTaskSchema, `missing fields`),
  ctrl.updateTask
);

router.delete("/:id", authenticate, isValidId, ctrl.deleteTask);

module.exports = router;

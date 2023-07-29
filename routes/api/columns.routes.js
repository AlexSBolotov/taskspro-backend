const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/columns.controller");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/column.model");

router.post(
  "/",
  authenticate,
  validateBody(schemas.commonColumnSchema, `missing fields`),
  ctrl.postColumn
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.commonColumnSchema, `missing fields`),
  ctrl.updateColumn
);

router.delete("/:id", authenticate, isValidId, ctrl.deleteColumn);

module.exports = router;

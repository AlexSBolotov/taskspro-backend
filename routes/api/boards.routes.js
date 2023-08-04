const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/boards.controller");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/board.model");

// router.get("/", authenticate, ctrl.geAllContacts);

router.get("/:id", authenticate, isValidId, ctrl.getOneBoard);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addBoardSchema, `missing fields`),
  ctrl.postBoard
);

// router.patch(
//   "/:id/favorite",
//   authenticate,
//   isValidId,
//   validateBody(schemas.updateFavoriteSchema, `missing field favorite`),
//   ctrl.updateContactStatus
// );

router.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.updateBoardSchema, `missing fields`),
  ctrl.updateBoard
);

router.delete("/:id", authenticate, isValidId, ctrl.deleteBoard);

module.exports = router;

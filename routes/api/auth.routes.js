const express = require("express");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user.model");
const ctrl = require("../../controllers/auth.controller");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.authUserSchema, "missing fields"),
  ctrl.registerUser
);
router.post(
  "/login",
  validateBody(schemas.authUserSchema, "missing fields"),
  ctrl.loginUser
);
router.get("/current", authenticate, ctrl.getCurrentUser);
router.post("/logout", authenticate, ctrl.logoutUser);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateUserSubscription, "missing field subscription"),
  ctrl.updateUserSubscription
);

module.exports = router;

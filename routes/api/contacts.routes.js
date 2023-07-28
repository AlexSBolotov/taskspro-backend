const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts.controller");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact.model");

router.get("/", authenticate, ctrl.geAllContacts);

router.get("/:id", authenticate, isValidId, ctrl.getOneContact);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema, `missing fields`),
  ctrl.postContact
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema, `missing field favorite`),
  ctrl.updateContactStatus
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema, `missing fields`),
  ctrl.updateContact
);

router.delete("/:id", authenticate, isValidId, ctrl.deleteContact);

module.exports = router;

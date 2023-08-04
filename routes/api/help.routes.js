const express = require("express");
const router = express.Router();

const { authenticate, validateBody } = require("../../middlewares");
const { helpSchemaJoi } = require("../../models/help.model");

const { sendEmail } = require("../../controllers/help.controller");

router.post("/", authenticate, validateBody(helpSchemaJoi), sendEmail);

module.exports = router;

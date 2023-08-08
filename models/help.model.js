const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const { emailRegexp } = require("../constants.js");

const helpSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const sendEmail = model("sendEmail", helpSchema);
helpSchema.post("save", handleMongooseError);

const helpSchemaJoi = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  comment: Joi.string().required().messages({
    "any.required": "missing required comment field",
  }),
});

module.exports = {
  sendEmail,
  helpSchemaJoi,
};

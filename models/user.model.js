const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const subscriptionTypes = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionTypes,
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const authUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
  subscription: Joi.string().valid(...subscriptionTypes),
});
const updateUserSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionTypes)
    .required(),
});

const schemas = {
  authUserSchema,
  updateUserSubscription,
};
const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};

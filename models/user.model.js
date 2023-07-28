const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const themeTypes = ["light", "dark", "violet"];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
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
    theme: {
      type: String,
      enum: themeTypes,
      default: "light",
    },
    avatarURL: {
      type: String,
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
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
  theme: Joi.string().valid(...themeTypes),
});
const updateUserSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...themeTypes)
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

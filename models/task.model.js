const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const { ptiorityTypes } = require("../constants.js");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for task"],
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ptiorityTypes,
      default: "Without",
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

taskSchema.post("save", handleMongooseError);

const addTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  description: Joi.string(),
  priority: Joi.string().valid(...ptiorityTypes),
  deadline: Joi.date(),
  column: Joi.string().required().messages({
    "any.required": "missing required column field",
  }),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  description: Joi.string().required().messages({
    "any.required": "missing required description field",
  }),
  priority: Joi.string()
    .required()
    .valid(...ptiorityTypes)
    .messages({
      "any.required": "missing required priority field",
    }),
  deadline: Joi.date().required().messages({
    "any.required": "missing required deadline field",
  }),
});

const replaceTaskSchema = Joi.object({
  column: Joi.string().required().messages({
    "any.required": "missing required column field",
  }),
});

const schemas = {
  addTaskSchema,
  updateTaskSchema,
  replaceTaskSchema,
};
const Task = model("task", taskSchema);

module.exports = {
  Task,
  schemas,
};

const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const ptiorityTypes = ["Without", "Low", "Medium", "High"];

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for task"],
      // unique: true,
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
    // board: {
    //   type: Schema.Types.ObjectId,
    //   ref: "board",
    // },
    column: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: true,
    },
  },
  { versionKey: false }
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

const schemas = {
  addTaskSchema,
  updateTaskSchema,
};
const Task = model("task", taskSchema);

module.exports = {
  Task,
  schemas,
};

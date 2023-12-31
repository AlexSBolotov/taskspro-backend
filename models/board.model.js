const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const { iconTypes, backgroundTypes } = require("../constants.js");

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for board"],
    },
    icon: {
      type: String,
      enum: iconTypes,
      default: "icon-project",
    },
    background: {
      type: String,
      enum: backgroundTypes,
      default: "00",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: "column",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

boardSchema.post("save", handleMongooseError);

const addBoardSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  icon: Joi.string().valid(...iconTypes),
  background: Joi.string().valid(...backgroundTypes),
});
const updateBoardSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  icon: Joi.string()
    .required()
    .valid(...iconTypes)
    .messages({
      "any.required": "missing required icon field",
    }),
  background: Joi.string()
    .required()
    .valid(...backgroundTypes)
    .messages({
      "any.required": "missing required background field",
    }),
});

const schemas = {
  addBoardSchema,
  updateBoardSchema,
};
const Board = model("board", boardSchema);

module.exports = {
  Board,
  schemas,
};

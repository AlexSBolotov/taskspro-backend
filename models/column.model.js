const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for column"],
      // unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "board",
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

columnSchema.post("save", handleMongooseError);

const commonColumnSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
  }),
  board: Joi.string().required().messages({
    "any.required": "missing required board field",
  }),
});

const schemas = {
  commonColumnSchema,
};
const Column = model("column", columnSchema);

module.exports = {
  Column,
  schemas,
};

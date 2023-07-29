const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for column"],
      unique: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

columnSchema.post("save", handleMongooseError);

const commonColumnSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "missing required title field",
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

const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const passRegex = /^[a-zA-Z0-9]+$/;
const themeTypes = ['light', 'dark', 'violet'];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    theme: {
      type: String,
      enum: themeTypes,
      default: 'dark',
    },
    avatarURL: {
      type: String,
    },
    activeBoard: {
      type: String,
      default: '',
    },
    token: {
      type: String,
      default: '',
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const registerUserSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.pattern.base': 'Name can only contain Latin letters, numbers',
    'any.required': 'Name is required',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(32).pattern(passRegex).required().messages({
    'string.pattern.base': 'Password can only contain Latin letters, numbers',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password must not exceed {#limit} characters',
    'any.required': 'Password is required',
  }),
  theme: Joi.string().valid(...themeTypes),
});

const loginUserSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'You must enter a password.',
  }),
  email: Joi.string().required().messages({
    'any.required': 'You must enter a email',
  }),
});

// const updateUserSubscription = Joi.object({
//   subscription: Joi.string()
//     .valid(...themeTypes)
//     .required(),
// });

const schemas = {
  registerUserSchema,
  loginUserSchema,
  //   updateUserSubscription,
};

const User = model('user', userSchema);

module.exports = {
  User,
  schemas,
};

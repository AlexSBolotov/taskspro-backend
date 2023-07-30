const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: '',
    activeBoard: '',
  });

  const { _id: id } = newUser;

  const payload = { id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

  await User.findByIdAndUpdate(id, { token });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      theme: newUser.theme,
      avatarURL: newUser.avatarURL,
      activeBoard: newUser.activeBoard,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const comparePassword = await bcryptjs.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token: token,
    user: {
      name: user.name,
      email: user.email,
      theme: user.theme,
      avatarURL: user.avatarURL,
      activeBoard: user.activeBoard,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, name, theme, avatarURL, activeBoard } = req.user;
  res.status(200).json({
    name,
    email,
    theme,
    avatarURL,
    activeBoard,
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json({
    message: 'Logout success',
  });
};

// const updateUserSubscription = async (req, res) => {
//   const { _id } = req.user;
//   const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
//   res.status(200).json({
//     message: 'Subscription successfully changed',
//     currentSubscription: result.subscription,
//   });
// };

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutUser: ctrlWrapper(logoutUser),
  //   updateUserSubscription: ctrlWrapper(updateUserSubscription),
};

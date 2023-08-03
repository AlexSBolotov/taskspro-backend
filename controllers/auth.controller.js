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
    theme: 'dark',
    avatarURL: '',
    boards: [],
  });

  const { _id: id } = newUser;

  const payload = { id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

  await User.findByIdAndUpdate(id, { token }, { new: true })
    .populate('boards', {
      _id: 1,
      title: 1,
      icon: 1,
      background: 1,
      updatedAt: 1,
    })
    .then((user) => {
      res.json({
        token: token,
        user: {
          name: user.name,
          email: user.email,
          theme: user.theme,
          avatarURL: user.avatarURL,
          boards: user.boards,
        },
      });
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
  await User.findByIdAndUpdate(user._id, { token }, { new: true })
    .populate('boards', {
      _id: 1,
      title: 1,
      icon: 1,
      background: 1,
      updatedAt: 1,
    })
    .then((user) => {
      res.json({
        token: token,
        user: {
          name: user.name,
          email: user.email,
          theme: user.theme,
          avatarURL: user.avatarURL,
          boards: user.boards,
        },
      });
    });
};

const getCurrentUser = async (req, res) => {
  const { email, name, theme, avatarURL, boards } = req.user;
  res.status(200).json({
    name,
    email,
    theme,
    avatarURL,
    boards,
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json({
    message: 'Logout success',
  });
};

const updateTheme = async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;
  console.log(_id);
  const result = await User.findByIdAndUpdate(_id, req.body);
  if (!result) throw HttpError(404);

  res.json({
    theme,
    message: `The theme has been changed. Now it's a ${req.body} theme `,
  });
};

const updateProfileUser = async (req, res) => {
  const { _id: id, email } = req.user;
  const { email: newEmail, name: newName, password: newPassword } = req.body;

  const isEmailInUse = await User.findOne({ email: newEmail });
  if (email !== newEmail && isEmailInUse)
    throw HttpError(409, 'Please, choose another email');

  const userNewData = {
    email: newEmail,
    name: newName,
  };

  if (newPassword) {
    userNewData.password = await bcryptjs.hash(newPassword, 10);
  }

  if (req.file) {
    userNewData.avatarURL = req.file.path;
  }

  const result = await User.findByIdAndUpdate(id, userNewData, {
    new: true,
  });
  if (!result) throw HttpError(404);

  res.json({
    name: result.name,
    email: result.email,
    theme: result.theme,
    avatarURL: result.avatarURL,
  });
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateTheme: ctrlWrapper(updateTheme),
  updateProfileUser: ctrlWrapper(updateProfileUser),
};

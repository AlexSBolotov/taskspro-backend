const {
  HttpError,
  ctrlWrapper,
  isElementDuplicateCreate,
  isElementDuplicateUpdate,
} = require("../helpers");
const { Board } = require("../models/board.model");
const { User } = require("../models/user.model");
const { Column } = require("../models/column.model");
const { Task } = require("../models/task.model");

const getOneBoard = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await Board.findById(id).populate({
    path: "columns",
    select: {
      _id: 1,
      updatedAt: 1,
      title: 1,
      tasks: 1,
    },
    populate: {
      path: "tasks",
      select: {
        _id: 1,
        updatedAt: 1,
        title: 1,
        description: 1,
        priority: 1,
        deadline: 1,
      },
    },
  });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  if (result.user.toString() !== userId.toString()) {
    throw HttpError(404, `Not found`);
  }
  const { _id, title, icon, background, columns, updatedAt } = result;
  res.status(200).json({
    _id,
    title,
    icon,
    background,
    updatedAt,
    columns,
  });
};

const postBoard = async (req, res) => {
  const { _id: user } = req.user;
  const isBoardExist = await isElementDuplicateCreate(
    "boards",
    User,
    user,
    req
  );
  if (isBoardExist) {
    throw HttpError(409, `Board ${req.body.title} already exist`);
  }

  const result = await Board.create({ ...req.body, user });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      $push: { boards: result._id },
    },
    { new: true }
  );
  const { _id, title, icon, background, updatedAt, columns } = result;
  res.status(201).json({ _id, title, icon, background, updatedAt, columns });
};

const updateBoard = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedBoard = await Board.findById(id);
  if (!askedBoard) {
    throw HttpError(404, `Not found`);
  }
  if (askedBoard.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }
  const isBoardExist = await isElementDuplicateUpdate(
    "boards",
    User,
    user,
    req
  );
  if (isBoardExist) {
    throw HttpError(409, `Board ${req.body.title} already exist`);
  }
  const result = await Board.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  const { _id, title, icon, background, updatedAt } = result;
  res.status(200).json({ _id, title, icon, background, updatedAt });
};

const deleteBoard = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedBoard = await Board.findById(id);
  if (!askedBoard) {
    throw HttpError(404, "Not found");
  }
  if (askedBoard.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }

  askedBoard.columns.map(async (column) => {
    const askedColumn = await Column.findById(column);
    if (!askedColumn) {
      throw HttpError(404, "Not found");
    }
    askedColumn.tasks.map(async (task) => {
      await Task.findByIdAndDelete(task);
    });
    await Column.findByIdAndDelete(column);
  });
  const result = await Board.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      $pull: { boards: id },
    },
    { new: true }
  );
  res.status(200).json({ id, message: "Board deleted" });
};

module.exports = {
  getOneBoard: ctrlWrapper(getOneBoard),
  postBoard: ctrlWrapper(postBoard),
  updateBoard: ctrlWrapper(updateBoard),
  deleteBoard: ctrlWrapper(deleteBoard),
};

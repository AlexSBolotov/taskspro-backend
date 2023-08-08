const {
  HttpError,
  ctrlWrapper,
  isElementDuplicateCreate,
  isElementDuplicateUpdate,
} = require("../helpers");
const { Column } = require("../models/column.model");
const { Board } = require("../models/board.model");
const { Task } = require("../models/task.model");

const postColumn = async (req, res) => {
  const { _id: user } = req.user;
  const { board: boardId } = req.body;
  const isColumnExist = await isElementDuplicateCreate(
    "columns",
    Board,
    boardId,
    req
  );
  if (isColumnExist) {
    throw HttpError(409, `Column ${req.body.title} already exist`);
  }
  const result = await Column.create({ ...req.body, user });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  await Board.findByIdAndUpdate(
    boardId,
    {
      $push: { columns: result._id },
    },
    { new: true }
  );
  const { _id, title, updatedAt, board, tasks } = result;
  res.status(201).json({ _id, title, updatedAt, board, tasks });
};

const updateColumn = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedColumn = await Column.findById(id);
  if (askedColumn.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }
  const { board: boardId } = req.body;
  const isColumnExist = await isElementDuplicateUpdate(
    "columns",
    Board,
    boardId,
    req
  );
  if (isColumnExist) {
    throw HttpError(409, `Column ${req.body.title} already exist`);
  }
  const result = await Column.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  const { _id, title, updatedAt, board } = result;
  res.status(200).json({ _id, title, updatedAt, board });
};

const deleteColumn = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedColumn = await Column.findById(id);
  if (askedColumn.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }
  askedColumn.tasks.map(async (task) => {
    await Task.findByIdAndDelete(task);
  });
  const result = await Column.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  await Board.findByIdAndUpdate(
    (_id = result.board),
    {
      $pull: { columns: result._id },
    },
    { new: true }
  );
  res.status(200).json({ id, message: "Column deleted" });
};

module.exports = {
  postColumn: ctrlWrapper(postColumn),
  updateColumn: ctrlWrapper(updateColumn),
  deleteColumn: ctrlWrapper(deleteColumn),
};

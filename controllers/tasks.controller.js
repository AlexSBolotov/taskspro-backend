const { HttpError, ctrlWrapper } = require("../helpers");
const { Column } = require("../models/column.model");
const { Task } = require("../models/task.model");

const postTask = async (req, res) => {
  const { _id: user } = req.user;
  const { column } = req.body;
  const result = await Task.create({ ...req.body, user });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  await Column.findByIdAndUpdate(
    column,
    {
      $push: { tasks: result._id },
    },
    { new: true }
  );
  const { _id, title, description, priority, deadline, updatedAt } = result;
  res
    .status(201)
    .json({ _id, title, description, priority, deadline, updatedAt });
};

const updateTask = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedTask = await Task.findById(id);
  if (askedTask.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  const { _id, title, description, priority, deadline, updatedAt } = result;
  res
    .status(200)
    .json({ _id, title, description, priority, deadline, updatedAt });
};

const replaceTask = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedTask = await Task.findById(id);
  if (askedTask.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }
  const { column: newColumn } = req.body;

  const { column: oldColumn } = await Task.findById(id);

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  await Column.findByIdAndUpdate(
    (_id = oldColumn),
    {
      $pull: { tasks: result._id },
    },
    { new: true }
  );
  await Column.findByIdAndUpdate(
    (_id = newColumn),
    {
      $push: { tasks: result._id },
    },
    { new: true }
  );
  res.status(200).json({ message: "Task replaced" });
};

const deleteTask = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
  const askedTask = await Task.findById(id);
  if (askedTask.user.toString() !== user.toString()) {
    throw HttpError(404, `Not found`);
  }
  const result = await Task.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  await Column.findByIdAndUpdate(
    (_id = result.column),
    {
      $pull: { tasks: result._id },
    },
    { new: true }
  );
  res.status(200).json({ _id: id, message: "Task deleted" });
};

module.exports = {
  postTask: ctrlWrapper(postTask),
  updateTask: ctrlWrapper(updateTask),
  replaceTask: ctrlWrapper(replaceTask),
  deleteTask: ctrlWrapper(deleteTask),
};

const { HttpError, ctrlWrapper } = require("../helpers");
const { Column } = require("../models/column.model");
const { Task } = require("../models/task.model");

const postTask = async (req, res) => {
  const { _id: user } = req.user;
  const { column } = req.body;
  const result = await Task.create({ ...req.body, user });
  await Column.findByIdAndUpdate(
    (_id = column),
    {
      $push: { tasks: result._id },
    },
    { new: true }
  );
  res.status(201).json(result);
};
const updateTask = async (req, res) => {
  const { id } = req.params;

  const result = await Task.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.status(200).json(result);
};
const replaceTask = async (req, res) => {
  const { id } = req.params;
  // const { column: oldColumn } = req.task;
  const { column: newColumn } = req.body;
  console.log(newColumn);
  const { column: oldColumn } = await Task.findById(id);
  console.log(oldColumn);
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
  res.status(200).json(result);
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
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
  res.status(200).json({ message: "Task deleted" });
};

module.exports = {
  postTask: ctrlWrapper(postTask),
  updateTask: ctrlWrapper(updateTask),
  replaceTask: ctrlWrapper(replaceTask),
  deleteTask: ctrlWrapper(deleteTask),
};

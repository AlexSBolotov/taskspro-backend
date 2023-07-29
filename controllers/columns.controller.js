const { HttpError, ctrlWrapper } = require("../helpers");
const { Column } = require("../models/column.model");

const postColumn = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Column.create({ ...req.body, owner });
  res.status(201).json(result);
};
const updateColumn = async (req, res) => {
  const { id } = req.params;
  const result = await Column.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(result);
};
const deleteColumn = async (req, res) => {
  const { id } = req.params;
  const result = await Column.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "Column deleted" });
};

module.exports = {
  postColumn: ctrlWrapper(postColumn),
  updateColumn: ctrlWrapper(updateColumn),
  deleteColumn: ctrlWrapper(deleteColumn),
};

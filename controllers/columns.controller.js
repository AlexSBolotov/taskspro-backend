const { HttpError, ctrlWrapper } = require("../helpers");
const { Column } = require("../models/column.model");
const { Board } = require("../models/board.model");

const postColumn = async (req, res) => {
  const { _id: user } = req.user;
  const { board } = req.body;
  console.log(req.body);
  const result = await Column.create({ ...req.body, user });
  await Board.findByIdAndUpdate(
    (_id = board),
    {
      $push: { columns: result._id },
    },
    { new: true }
  );
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
  await Board.findByIdAndUpdate(
    (_id = result.board),
    {
      $pull: { columns: result._id },
    },
    { new: true }
  );
  res.status(200).json({ message: "Column deleted" });
};

module.exports = {
  postColumn: ctrlWrapper(postColumn),
  updateColumn: ctrlWrapper(updateColumn),
  deleteColumn: ctrlWrapper(deleteColumn),
};

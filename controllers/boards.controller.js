const { HttpError, ctrlWrapper } = require("../helpers");
const { Board } = require("../models/board.model");
const { User } = require("../models/user.model");

// const geAllContacts = async (req, res) => {
//   const { _id: owner } = req.user;
//   const { page = 1, limit = 20, favorite } = req.query;
//   const skip = (page - 1) * limit;
//   if (favorite === undefined) {
//     const result = await Contact.find({ owner }, "", {
//       skip,
//       limit,
//     }).populate("owner", "email");
//     res.status(200).json(result);
//   } else {
//     const result = await Contact.find({ owner, favorite }, "", {
//       skip,
//       limit,
//     }).populate("owner", "email");
//     res.status(200).json(result);
//   }
// };
const getOneBoard = async (req, res) => {
  const { id } = req.params;
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
  const result = await Board.create({ ...req.body, user });
  console.log(result);
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
  const { id } = req.params;
  const result = await Board.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  const { _id, title, icon, background, updatedAt, columns } = result;
  res.status(200).json({ _id, title, icon, background, updatedAt, columns });
};
// const updateContactStatus = async (req, res) => {
//   const { id } = req.params;
//   const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
//   if (!result) {
//     throw HttpError(404, `Not found`);
//   }
//   res.status(200).json(result);
// };
const deleteBoard = async (req, res) => {
  const { _id: user } = req.user;
  const { id } = req.params;
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
  //   geAllContacts: ctrlWrapper(geAllContacts),
  //   getOneContact: ctrlWrapper(getOneContact),
  getOneBoard: ctrlWrapper(getOneBoard),
  postBoard: ctrlWrapper(postBoard),
  updateBoard: ctrlWrapper(updateBoard),
  //   updateContactStatus: ctrlWrapper(updateContactStatus),
  deleteBoard: ctrlWrapper(deleteBoard),
};

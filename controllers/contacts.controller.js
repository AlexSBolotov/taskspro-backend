const { HttpError, ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contact.model");

const geAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  if (favorite === undefined) {
    const result = await Contact.find({ owner }, "", {
      skip,
      limit,
    }).populate("owner", "email");
    res.status(200).json(result);
  } else {
    const result = await Contact.find({ owner, favorite }, "", {
      skip,
      limit,
    }).populate("owner", "email");
    res.status(200).json(result);
  }
};
const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(result);
};
const postContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};
const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(result);
};
const updateContactStatus = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(result);
};
const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
  geAllContacts: ctrlWrapper(geAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  postContact: ctrlWrapper(postContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactStatus: ctrlWrapper(updateContactStatus),
  deleteContact: ctrlWrapper(deleteContact),
};

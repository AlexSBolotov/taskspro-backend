const isElementDuplicateUpdate = async (collectionName, model, id, req) => {
  const result = await model.findById(id, { new: true }).populate({
    path: `${collectionName}`,
    select: {
      _id: 1,
      title: 1,
    },
  });

  const currentElIdx = result[collectionName].findIndex(
    (el) => el._id.toString() === req.params.id
  );

  result[collectionName].splice(currentElIdx, 1);

  return result[collectionName].some((el) => el.title === req.body.title);
};

module.exports = isElementDuplicateUpdate;

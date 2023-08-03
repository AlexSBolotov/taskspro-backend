const isElementDuplicate = async (collectionName, model, id, req) => {
  const result = await model.findById(id).populate({
    path: `${collectionName}`,
    select: {
      title: 1,
    },
  });
  return result[collectionName].some((el) => el.title === req.body.title);
};

module.exports = isElementDuplicate;

const router = require("express").Router();

const User = require("../models/User");
const ReadingList = require("../models/ReadingList");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  const username = req.decodedToken.username;
  console.log(req.decodedToken, username);
  const user = await User.findOne({ where: { username: username } });
  const { blogId } = req.body;
  await ReadingList.create({ blogId, userId: user.id });
  res.send({ blogId, userId: user.id });
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const readingList = await ReadingList.findByPk(req.params.id);
    console.log(readingList);
    if (user.id !== readingList.userId) {
      throw new Error("You have no permission to change Reading List");
    }
    await readingList.update({ read: req.body.read });
    res.status(200).json({ readingList });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

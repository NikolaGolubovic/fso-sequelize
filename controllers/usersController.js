const router = require("express").Router();
const { Op } = require("sequelize");

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
      },
    ],
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ errorMsg: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const whereList = {};
  if (req.query.read) {
    whereList["read"] = req.query.read;
  }
  const user = await User.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt", "readingState"],
        },
        through: {
          where: whereList,
          as: "readinglist",
          attributes: ["id", "read"],
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;

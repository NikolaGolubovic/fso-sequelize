const router = require("express").Router();
const { Blog } = require("../models");
const { User } = require("../models");
const { tokenExtractor } = require("../util/middleware");
const { Op } = require("sequelize");
const { sequelize } = require("../util/db");

router.get("/", async (req, res, next) => {
  try {
    const queries = {};
    const where = {};
    if (req.query.search) {
      queries.title = {
        [Op.iLike]: `%${req.query.search}%` ? `%${req.query.search}%` : "",
      };
      queries.author = {
        [Op.iLike]: `%${req.query.search}%` ? `%${req.query.search}%` : "",
      };
      where[Op.or] = [{ title: queries.title }, { author: queries.author }];
    }
    const blogs = await Blog.findAll({
      where,
      order: [["likes", "DESC"]],
      include: {
        model: User,
        attributes: ["username"],
      },
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.get("/authors", async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      group: ["author"],
      attributes: [
        "author",
        [sequelize.fn("count", sequelize.col("author")), "articles"],
        [sequelize.fn("sum", sequelize.col("likes")), "likes"],
      ],
    });
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { author, url, title, year: yearParams } = req.body;
    const year = new Date(`${yearParams}-01-01`);
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      author,
      url,
      title,
      userId: user.id,
      year,
    });
    return res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);
    if (blog === null) {
      throw new Error("Blog is not found");
    }
    res.json({ msg: "ok", blog });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);
    if (blog.userId !== req.decodedToken.id) {
      throw new Error("Your don't have permision for the action");
    }
    if (blog === null) {
      throw new Error("Blog is not found");
    }
    await blog.update({ likes: req.body.likes });
    await blog.save();
    return res.json({ msg: "ok", blog });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await Blog.destroy({ where: { id } });
    res.status(200).send("Record is successfuly deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

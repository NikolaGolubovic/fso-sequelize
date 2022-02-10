const router = require("express").Router();
const Blog = require("../models/Blog");

router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { author, url, title } = req.body;
    const blog = await Blog.create({ author, url, title });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(400).json({ error });
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

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);
    if (blog === null) {
      throw new Error("Blog is not found");
    }
    blog.likes = 3;
    await blog.save();
    res.json({ msg: "ok", blog });
  } catch (error) {
    next("put api/blogs", error);
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

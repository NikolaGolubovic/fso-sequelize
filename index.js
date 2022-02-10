require("dotenv").config();
const Blog = require("./models/Blog");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const { author, url, title } = req.body;
    const blog = await Blog.create({ author, url, title });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Blog.destroy({ where: { id } });
    res.status(200).send("Record is successfuly deleted");
  } catch (error) {
    console.log("/api/blogs/:id delete", error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");

// 게시글 작성
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "제목과 내용을 모두 입력해주세요" });
  }

  try {
    const post = new Post({ user, password, title, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 작성 실패" });
  }
});

// 전체 게시글 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({}, "title user date").sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 목록 조회 실패" });
  }
});

// 상세 게시글 조회
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 조회 실패" });
  }
});

// 게시글 수정
router.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { password, title, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다" });
    }

    if (post.password !== password) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다" });
    }

    post.title = title;
    post.content = content;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 수정 실패" });
  }
});

// 게시글 삭제
router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다" });
    }

    if (post.password !== password) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다" });
    }

    await post.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 삭제 실패" });
  }
});

module.exports = router;

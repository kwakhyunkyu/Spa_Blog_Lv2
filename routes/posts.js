const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 목록 조회 실패" });
  }
});

// 게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { userId, nickname } = res.locals.user;

  if (!title || !content) {
    return res.status(400).json({ error: "제목과 내용을 모두 입력해주세요." });
  }

  try {
    const post = new Post({
      title,
      content,
      userId,
      nickname,
    });

    await post.save();

    res.json({ message: "게시글이 작성되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 작성 실패" });
  }
});

// 게시글 수정
router.put("/posts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    if (post.userId !== userId) {
      return res
        .status(401)
        .json({ error: "자신이 작성한 게시글만 수정할 수 있습니다." });
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
router.delete("/posts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId } = res.locals.user;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    if (post.userId !== userId) {
      return res
        .status(401)
        .json({ error: "자신이 작성한 게시글만 삭제할 수 있습니다." });
    }

    await post.deleteOne();
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시글 삭제 실패" });
  }
});

module.exports = router;

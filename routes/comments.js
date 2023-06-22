const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
const Post = require("../schemas/post");
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 목록 조회
router.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ postId: id }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 목록 조회 실패" });
  }
});

// 댓글 작성
router.post("/posts/:id/comments", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { userId, nickname } = res.locals.user;

  if (!content) {
    return res.status(400).json({ error: "댓글 내용을 입력해주세요." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const comment = new Comment({
      postId: id,
      userId,
      nickname,
      content,
    });

    await comment.save();

    res.json({ message: "댓글이 작성되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 작성 실패" });
  }
});

// 댓글 수정
router.put("/posts/:postId/comments/:id", authMiddleware, async (req, res) => {
  const { postId, id } = req.params;
  const { content } = req.body;
  const { userId } = res.locals.user;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
    }

    if (comment.userId !== userId) {
      return res
        .status(401)
        .json({ error: "자신이 작성한 댓글만 수정할 수 있습니다." });
    }

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 수정 실패" });
  }
});

// 댓글 삭제
router.delete(
  "/posts/:postId/comments/:id",
  authMiddleware,
  async (req, res) => {
    const { postId, id } = req.params;
    const { userId } = res.locals.user;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
      }

      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
      }

      if (comment.userId !== userId) {
        return res
          .status(401)
          .json({ error: "자신이 작성한 댓글만 삭제할 수 있습니다." });
      }

      await comment.deleteOne();
      res.json({ message: "댓글이 삭제되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "댓글 삭제 실패" });
    }
  }
);

module.exports = router;

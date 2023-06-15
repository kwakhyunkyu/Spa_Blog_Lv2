const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');

// 댓글 목록 조회
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '댓글 목록 조회 실패' });
  }
});

// 댓글 작성
router.post('/', async (req, res) => {
    const { _postId, user, password, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: '댓글 내용을 입력해주세요' });
    }
  
    try {
      const comment = new Comment({ _postId, user, password, content });
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '댓글 작성 실패' });
    }
  });

// 댓글 수정
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { password, content } = req.body;
  if (!content) {
    return res.status(400).json({ error: '댓글 내용을 입력해주세요' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다' });
    }

    if (comment.password !== password) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
    }

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '댓글 수정 실패' });
  }
});

// 댓글 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다' });
    }

    if (comment.password !== password) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
    }

    await comment.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '댓글 삭제 실패' });
  }
});

module.exports = router;

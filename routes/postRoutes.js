const express = require('express');
const router = express.Router();
const { createPost, getFeed, getUserProfile, updatePost, deletePost } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');

router.post('/posts', protect, createPost);
router.get('/feed', getFeed);
router.get('/profile/:userId', getUserProfile);

router.put('/posts/:postId', protect, updatePost);
router.delete('/posts/:postId', protect, deletePost);

module.exports = router;

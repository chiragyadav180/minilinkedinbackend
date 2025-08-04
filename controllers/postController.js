const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  try {
    const post = await Post.create({ author: req.user._id, content: req.body.content });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post' });
  }
};

const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feed' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });


    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ message: 'Error getting profile' });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    post.content = req.body.content || post.content;
    await post.save();

    res.json({ message: 'Post updated successfully', post });
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};


const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};



module.exports = { createPost, getFeed, getUserProfile,updatePost,deletePost };

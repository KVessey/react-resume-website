const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password'); //Do not want to send the password back, just user id

      const newPost = new Post({
        text: req.body.text,
        // Name and avatar come from user model
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Sorting by a date of -1 will give most recent post first
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    // If the error is equal to ObjectId, it means its not a formatted object id which means no post will be found
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a posts
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Sorting by a date of -1 will give most recent post first
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Make sure the user deleting the post is the user which is logged in
    // Must convert post.user (which is an object) to a string to match against the req.user.id string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Removed' });
  } catch (err) {
    console.error(err.message);
    // If the error is equal to ObjectId, it means its not a formatted object id which means no post will be found
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    // Find post from Post model by id in request parameters
    const post = await Post.findById(req.params.id);

    // Check if post has already been liked by this user
    // Check if the post liked by user === the user which is logged in(from the request)
    // The filter will only return a value if like.user.toString() === req.user.id. If the length is > 0, that means the post is already liked by this user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    // If the post is not already liked, we push it onto the array using unshift, which adds the post to the beginning
    post.likes.unshift({ user: req.user.id });

    // Save to database
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    // Find post from Post model by id in request parameters
    const post = await Post.findById(req.params.id);

    /* Check if post has already been liked by this user
       Check if the post liked by user === the user which is logged in(from the request)
       The filter will only return a value if like.user.toString() === req.user.id. 
       If the length is === 0, that means we have not liked the post yet so we cannot "unlike" it
    */
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    // For each like, return like.user in string format. Then we get the index of the id which was sent in the request
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    // Splice out of the array
    post.likes.splice(removeIndex, 1);

    // Save to database
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a Post
// @access  Private
// @todo Add likes into comments like we did for posts
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password'); //Do not want to send the password back, just user id

      // Get post by id
      const post = await Post.findById(req.params.id);

      // Construct a new comment
      const newComment = {
        text: req.body.text,
        // Name and avatar come from user model
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      // Add new comment to the beginning with unshift
      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post (need both post and comment id)
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    // Get post by id
    const post = await Post.findById(req.params.id);

    // Pull out comment from post array
    // For each comment => check if comment id === the comment id send via the request parameters
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure the comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user that is deleting the comment is the user which made the comment
    // Check if comment.user object id (converted to a string) is not equal to logged in user, then return 401
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    // For each like, return like.user in string format. Then we get the index of the id which was sent in the request
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    // Splice out of the array
    post.comments.splice(removeIndex, 1);

    // Save to database
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @todo Add functionality to update comments
module.exports = router;

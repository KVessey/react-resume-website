const mongoose = require('mongoose');
const Schema = mongoose.Schema; //make a variable to shorthand Schema later instead of writing mongoose.Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users', //reference users model
  },
  text: {
    type: String,
    required: true,
  },
  // Putting name and avatar in post model in case the user is deleted, we can still show the post in the blog page
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        // reference users to know which likes came from which users
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  comments: [
    {
      user: {
        // reference users to know which comments came from which users
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model('post', Post);

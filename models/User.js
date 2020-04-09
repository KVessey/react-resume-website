const mongoose = require('mongoose');

// Create schema for user model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// set User variable to mongoose model name user and schema we just created.
// A new user model will be instantiated by: user = new User in the routes
module.exports = User = mongoose.model('user', UserSchema);

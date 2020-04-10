const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); //Bring in auth middleware

const User = require('../../models/User'); // Bring in User model

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    /* Since this is a protected route, and we used the token which contains the id, 
        and in middleware we set req.user = decoded.user (which is the user in the token
        We can just pass req.user */
    const user = await User.findById(req.user.id).select('-password'); //-password will leave off the password in the data
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

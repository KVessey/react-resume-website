const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth'); //Bring in auth middleware
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

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

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring so we dont have to keep doing req.body to pull email and pw from json
    const { email, password } = req.body;

    try {
      // See if users exists - if exists send back error for duplicate
      let user = await User.findOne({ email }); //instead of doing email: email -> since the variable from req.body is already email we can just findOne({email})

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Compare password to verify password is correct
      const isMatch = await bcrypt.compare(password, user.password); // takes in plain text password, then encrypted password

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken so that user gets logged in right away when registering
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Signing the token, must pass payload, secret (which we defined in default.json)
      jwt.sign(
        payload, //pass in the payload
        config.get('jwtSecret'), // get secret defined in default.json
        { expiresIn: 3600 }, //in production, set to 3600 seconds which is 1 hour
        (err, token) => {
          if (err) throw err; // if error is caught, we are throwing the error message
          res.json({ token }); //else the response is the json token which we send back to the client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

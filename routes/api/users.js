const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Bring in User model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring so we dont have to keep doing req.body to pull name email and pw from json
    // This is used below in the new user instance
    const { name, email, password } = req.body;

    try {
      // See if users exists - if exists send back error for duplicate
      let user = await User.findOne({ email }); //instead of doing email: email -> since the variable from req.body is already email we can just findOne({email})

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', //size of 200px
        r: 'pg', //rating of pg
        d: 'mm', //generic defualt gravitar
      });

      //This creates a new instance of the user. It is not saved at this point. Must call User.save to actually save to db
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password using bcryptjs
      // Create salt to do hashing with. The 10 in genSalt is the number of rounds this password will be encrypted
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt); //takes plaintext password and salt, then stores into user.password instance

      // Save the user to the database
      await user.save();

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
          // Note: This token will be taken later and passed in the header to access protected routes
          // An example response is:
          /*{
            "user": {  - This is the user from the payload above
              "id": "5e90ac39d391c7359473668a"   - this corresponds to the user id in the mongo database
            },
            "iat": 1586539578,  - issued at timestamp
            "exp": 1586899578   - expires at timestamp
          }*/
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token'); // Need to send token in x-auth-token in header

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No Token, authorization denied' });
  }

  // Verify token
  try {
    // jwtVerify will decode the token. We pass in the token from the header, along with the secret key from config
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user; // Setting request.user to the decoded user from the payload defined in the users route
    next(); //Must call next in the middleware to continue on to the next item
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

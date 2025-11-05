// /server/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. Get the token from the 'Authorization' header
  // The header looks like: "Bearer YOUR_TOKEN_HERE"
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 2. Check if it's a "Bearer" token
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ message: 'Token is not valid (must be Bearer)' });
  }

  const token = tokenParts[1];

  try {
    // 3. Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user's info to the request object
    req.user = decoded;

    // 5. Call 'next()' to pass the request to the *next* function (the controller)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = authMiddleware;

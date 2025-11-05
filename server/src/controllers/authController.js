// /server/src/controllers/authController.js

const bcryt = require('bcrypt.js');
const jwt = require('jsonwebtoken');
const user = require('../models/User');

// Helper function to create a token
function createToken(userId) {
  // Signs the token with our private key
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h', // Token will expire in 24 hours
  });
}

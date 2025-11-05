// /server/src/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Our User model

// Helper function to create a token
function createToken(userId) {
  // Put JWT "secret" in the .env file
  // This signs the token with our private key
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }, // The token will expire in 24 hours
  );
}

const authController = {
  /**
   * Register a new user
   */
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Please provide email and password' });
      }

      // 2. Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // 3. Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 4. Create new user in the database
      const newUser = await User.create(email, passwordHash);

      // 5. Create a token for the new user
      const token = createToken(newUser.id);

      // 6. Send back the token and user info
      res.status(201).json({
        token,
        user: { id: newUser.id, email: newUser.email },
      });
    } catch (err) {
      res.status(500).json({
        message: 'Server error during registration',
        error: err.message,
      });
    }
  },

  /**
   * Log in an existing user
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Please provide email and password' });
      }

      // 2. Find the user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' }); // "Unauthorized"
      }

      // 3. Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' }); // "Unauthorized"
      }

      // 4. Create a token
      const token = createToken(user.id);

      // 5. Send back the token and user info
      res.status(200).json({
        token,
        user: { id: user.id, email: user.email },
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Server error during login', error: err.message });
    }
  },
};

module.exports = authController;

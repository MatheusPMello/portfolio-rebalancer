const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { z } = require('zod');

const userController = {
  // @desc Update user email
  // @route PUT /api/users/email
  // @access Private
  updateEmail: async (req, res) => {
    try {
      const email = req.body.email?.toLowerCase().trim();
      const id = req.user.id;

      // 1. Validate input
      if (!email) {
        return res.status(400).json({ message: 'Please provide email' });
      }

      const emailValidator = z.string().toLowerCase().trim().pipe(z.email()).safeParse(email);
      if (!emailValidator.success) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.email === email) {
        return res.status(400).json({ message: 'Email is the same as current email' });
      }

      // 2. Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // 3. Update user email
      await User.updateEmail(id, email);
      res.status(200).json({ message: 'Email updated successfully', email: email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during email update' });
    }
  },

  // @desc Update user password
  // @route PUT /api/users/password
  // @access Private
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const id = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Invalid input' });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password must differ from current password' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await User.updatePassword(id, passwordHash);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during password update' });
    }
  },

  // @desc Delete user account
  // @route DELETE /api/users/account
  // @access Private
  deleteAccount: async (req, res) => {
    try {
      const { password } = req.body;
      const id = req.user.id;

      if (!password) {
        return res.status(400).json({ message: 'Invalid input' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      await User.deleteAccount(id);
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error during account deletion' });
    }
  },
};

module.exports = userController;

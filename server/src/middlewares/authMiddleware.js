// /server/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // --- DEBUG LOGS START ---
  const authHeader = req.header('Authorization');
  console.log('\n🔍 Bouncer (Middleware) Check:');
  console.log('   1. Header received:', authHeader);

  if (!authHeader) {
    console.log('   ❌ Result: No header found.');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.log('   ❌ Result: Header format is wrong.');
    return res.status(401).json({ message: 'Token is not valid (must be Bearer)' });
  }

  const token = tokenParts[1];
  console.log('   2. Token extracted!');

  try {
    // Check if secret exists
    if (!process.env.JWT_SECRET) {
      console.log('   ❌ CRITICAL ERROR: JWT_SECRET is missing in .env!');
      throw new Error('JWT_SECRET is missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('   ✅ Result: Token verified! User ID:', decoded.id);

    req.user = decoded;
    next();
  } catch (err) {
    console.error('   ❌ Result: Verification Failed ->', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
  // --- DEBUG LOGS END ---
}

module.exports = authMiddleware;

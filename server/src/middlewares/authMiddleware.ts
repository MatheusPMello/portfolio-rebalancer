import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken extends jwt.JwtPayload {
  id: number;
  email?: string;
}

/**
 * Middleware to protect routes by verifying JWT tokens in the Authorization header.
 *
 * @param req - Express request object. Expects "Authorization: Bearer <token>" header.
 * @param res - Express response object.
 * @param next - Express next function to pass execution to the next handler.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // --- DEBUG LOGS START ---
  const authHeader = req.header('Authorization');
  console.log('\n🔍 Bouncer (Middleware) Check:');

  if (!authHeader) {
    console.log('   ❌ Result: No header found.');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  console.log('   1. Header received');

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.log('   ❌ Result: Header format is wrong.');
    return res.status(401).json({ message: 'Token is not valid (must be Bearer)' });
  }

  const token = tokenParts[1];
  console.log('   2. Token extracted');

  try {
    // Check if secret exists
    if (!process.env.JWT_SECRET) {
      console.log('   ❌ CRITICAL ERROR: JWT_SECRET is missing in .env!');
      throw new Error('JWT_SECRET is missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    console.log('   ✅ Result: Token verified! User ID:', decoded.id);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (err: any) {
    console.error('   ❌ Result: Verification Failed ->', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
  // --- DEBUG LOGS END ---
}

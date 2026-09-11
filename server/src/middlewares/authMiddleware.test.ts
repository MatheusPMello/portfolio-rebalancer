import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './authMiddleware.js';

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('should return 401 if Authorization header is missing', () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header does not start with Bearer', () => {
    (req.header as jest.Mock).mockReturnValue('Basic 12345');

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid (must be Bearer)' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token has invalid format', () => {
    (req.header as jest.Mock).mockReturnValue('Bearer');

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid (must be Bearer)' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired', () => {
    (req.header as jest.Mock).mockReturnValue('Bearer invalid.jwt.token');

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    const token = jwt.sign({ id: 1 }, 'any-secret');
    (req.header as jest.Mock).mockReturnValue(`Bearer ${token}`);

    authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and call next() when token is valid', () => {
    const payload = { id: 42, email: 'investor@example.com' };
    const validToken = jwt.sign(payload, 'test-secret');
    (req.header as jest.Mock).mockReturnValue(`Bearer ${validToken}`);

    authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({
      id: 42,
      email: 'investor@example.com',
    });
    expect(res.status).not.toHaveBeenCalled();
  });
});

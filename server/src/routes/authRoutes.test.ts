import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../server.js';
import { User } from '../models/User.js';

jest.mock('../models/User.js');
jest.mock('bcryptjs');

describe('Auth Routes Integration Tests', () => {
  const secret = 'test-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if email or password missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'test@example.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide email and password');
    });

    it('should return 400 if email already in use', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already in use');
    });

    it('should return 201 with token and user info on successful registration', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_pwd');
      (User.create as jest.Mock).mockResolvedValueOnce({ id: 5, email: 'new@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({ id: 5, email: 'new@example.com' });
    });

    it('should return 500 on database error during registration', async () => {
      (User.findByEmail as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'err@example.com', password: 'password123' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error during registration');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email or password missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ password: 'pwd' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide email and password');
    });

    it('should return 401 if user not found', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unknown@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 401 if password does not match', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        password_hash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 200 with token and user on successful login', async () => {
      (User.findByEmail as jest.Mock).mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        password_hash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'correctpassword' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toEqual({ id: 1, email: 'user@example.com' });
    });

    it('should return 500 on server error during login', async () => {
      (User.findByEmail as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'err@example.com', password: 'password123' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error during login');
    });
  });
});

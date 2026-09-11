import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../server.js';
import { User } from '../models/User.js';

jest.mock('../models/User.js');
jest.mock('bcryptjs');

describe('User Routes Integration Tests', () => {
  const secret = 'test-secret';
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ id: 1, email: 'current@example.com' }, secret);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user/profile', () => {
    it('should return 401 when unauthorized', async () => {
      const res = await request(app).get('/api/user/profile');
      expect(res.status).toBe(401);
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return 200 with profile', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        email: 'current@example.com',
      });

      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, email: 'current@example.com' });
    });

    it('should return 500 on database error', async () => {
      (User.findById as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/user/email', () => {
    it('should return 400 if input is missing', async () => {
      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: '' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide email and current password');
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'not-an-email', currentPassword: 'secret' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid email format');
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'valid@example.com', currentPassword: 'secret' });

      expect(res.status).toBe(404);
    });

    it('should return 400 if current password is incorrect', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
        email: 'old@example.com',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'valid@example.com', currentPassword: 'wrong' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 400 if email is the same as current email', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
        email: 'same@example.com',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'same@example.com', currentPassword: 'secret' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email is the same as current email');
    });

    it('should return 400 if new email is already in use by another user', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
        email: 'old@example.com',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (User.findByEmail as jest.Mock).mockResolvedValueOnce({ id: 2, email: 'taken@example.com' });

      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'taken@example.com', currentPassword: 'secret' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already in use');
    });

    it('should return 200 on successful email update', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
        email: 'old@example.com',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (User.findByEmail as jest.Mock).mockResolvedValueOnce(null);
      (User.updateEmail as jest.Mock).mockResolvedValueOnce(undefined);

      const res = await request(app)
        .put('/api/user/email')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'new@example.com', currentPassword: 'secret' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Email updated successfully');
      expect(User.updateEmail).toHaveBeenCalledWith(1, 'new@example.com');
    });
  });

  describe('PUT /api/user/password', () => {
    it('should return 400 if inputs are missing', async () => {
      const res = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input');
    });

    it('should return 400 if new password equals current password', async () => {
      const res = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'samepassword', newPassword: 'samepassword' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('New password must differ from current password');
    });

    it('should return 400 if new password is too short (< 6 chars)', async () => {
      const res = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'currentpassword', newPassword: '123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Password must be at least 6 characters');
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'currentpassword', newPassword: 'newpassword123' });

      expect(res.status).toBe(404);
    });

    it('should return 400 if current password is incorrect', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'wrongpassword', newPassword: 'newpassword123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 200 on successful password update', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('new_hashed_pwd');
      (User.updatePassword as jest.Mock).mockResolvedValueOnce(undefined);

      const res = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'correctpassword', newPassword: 'newpassword123' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password updated successfully');
      expect(User.updatePassword).toHaveBeenCalledWith(1, 'new_hashed_pwd');
    });
  });

  describe('DELETE /api/user/account', () => {
    it('should return 400 if password missing', async () => {
      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input');
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'anypassword' });

      expect(res.status).toBe(404);
    });

    it('should return 400 if password does not match', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'wrongpassword' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 200 on successful account deletion', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        password_hash: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (User.deleteAccount as jest.Mock).mockResolvedValueOnce(undefined);

      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'correctpassword' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Account deleted successfully');
      expect(User.deleteAccount).toHaveBeenCalledWith(1);
    });
  });
});

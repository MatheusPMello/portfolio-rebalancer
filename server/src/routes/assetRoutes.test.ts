import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import { Asset } from '../models/Asset.js';

jest.mock('../models/Asset.js');

describe('Asset Routes Integration Tests', () => {
  const secret = 'test-secret';
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ id: 1, email: 'user@example.com' }, secret);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/assets', () => {
    it('should return 401 when unauthorized', async () => {
      const res = await request(app).get('/api/assets');
      expect(res.status).toBe(401);
    });

    it('should return 200 with assets list', async () => {
      const mockAssets = [{ id: 1, user_id: 1, name: 'Apple', current_value: 100 }];
      (Asset.findByUserId as jest.Mock).mockResolvedValueOnce(mockAssets);

      const res = await request(app)
        .get('/api/assets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockAssets);
      expect(Asset.findByUserId).toHaveBeenCalledWith(1);
    });

    it('should return 500 on database failure', async () => {
      (Asset.findByUserId as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .get('/api/assets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('POST /api/assets', () => {
    it('should return 401 when unauthorized', async () => {
      const res = await request(app).post('/api/assets').send({ name: 'Apple' });
      expect(res.status).toBe(401);
    });

    it('should return 400 when missing required fields', async () => {
      const res = await request(app)
        .post('/api/assets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Incomplete' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide all required fields');
    });

    it('should return 201 with created asset', async () => {
      const created = {
        id: 10,
        user_id: 1,
        name: 'VT',
        target_percentage: 50,
        current_value: 1000,
        currency: 'USD',
      };
      (Asset.create as jest.Mock).mockResolvedValueOnce(created);

      const res = await request(app)
        .post('/api/assets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'VT',
          target_percentage: 50,
          current_value: 1000,
          currency: 'USD',
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
      expect(Asset.create).toHaveBeenCalledWith(1, 'VT', 50, 1000, 'USD');
    });

    it('should return 500 on database failure', async () => {
      (Asset.create as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .post('/api/assets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'VT',
          target_percentage: 50,
          current_value: 1000,
          currency: 'USD',
        });

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/assets/:id', () => {
    it('should return 400 for non-numeric asset id', async () => {
      const res = await request(app)
        .put('/api/assets/abc')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid asset ID');
    });

    it('should return 404 if asset is not found', async () => {
      (Asset.updateById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .put('/api/assets/99')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Asset not found or user not authorized');
    });

    it('should return 200 with updated asset', async () => {
      const updated = { id: 1, name: 'Updated' };
      (Asset.updateById as jest.Mock).mockResolvedValueOnce(updated);

      const res = await request(app)
        .put('/api/assets/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('should return 500 on database failure', async () => {
      (Asset.updateById as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .put('/api/assets/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/assets/:id', () => {
    it('should return 400 for non-numeric asset id', async () => {
      const res = await request(app)
        .delete('/api/assets/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid asset ID');
    });

    it('should return 404 if asset is not found', async () => {
      (Asset.deleteById as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .delete('/api/assets/99')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Asset not found or user not authorized');
    });

    it('should return 200 with success message on delete', async () => {
      (Asset.deleteById as jest.Mock).mockResolvedValueOnce({ id: 1 });

      const res = await request(app)
        .delete('/api/assets/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Asset deleted successfully');
    });

    it('should return 500 on database failure', async () => {
      (Asset.deleteById as jest.Mock).mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app)
        .delete('/api/assets/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
    });
  });
});

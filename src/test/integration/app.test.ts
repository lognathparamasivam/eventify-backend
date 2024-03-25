import request from 'supertest';
import app from '../../app';
import { databaseClose, databaseConnect, databaseExist } from '../../database/datasource';

export default () => {

  beforeAll(async () => {
    await databaseExist() ? 'Already Exist' : await databaseConnect()
  })

  afterAll(async () => {

    await databaseClose();
  });

  describe('Integration tests', () => {
    it('should return status 200 for GET /', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toEqual('Welcome to Eventify');
    });

    it('should return status 200 for GET /health', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'UP' });
    });

    it('should return status 500 for GET /error', async () => {
      const response = await request(app).get('/error');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal Server Error' });
    });

    it('should return status 401 for unauthorized access', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(401);
    });

  });
}
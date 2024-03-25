import request from 'supertest';
import { databaseClose, databaseConnect, databaseExist } from '../../database/datasource';
import jwt from 'jsonwebtoken';
import properties from '../../properties';
import app from '../../app';
import testData from '../testData.json';
import { User } from '../../entities/users';
export default () => {

    beforeAll(async () => {
        await databaseExist() ? 'Already Exist' : await databaseConnect()
    })

    const testUser = testData.users[0];
    const token = jwt.sign({ user_id: testUser.id, email: testUser.email, }, properties.secretKey, { expiresIn: '15m' });
    const updateUserMobile = '9965659660';

    describe('User Integration tests', () => {

        it('should return status 401 No Auth Token for GET /', async () => {
            const response = await request(app).get('/api/v1/users')
            expect(response.status).toBe(401);
        });

        it('should create a new user with status 200 for POST /api/v1/users', async () => {
            const response = await request(app)
                .post('/api/v1/users')
                .set('Authorization', `Bearer ${token}`)
                .send(testUser);
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.id).toBe(testUser.id);
            expect(response.body.data.firstName).toBe(testUser.firstName);
            expect(response.body.data.email).toBe(testUser.email);
        });

        it('should return status 200 for PATCH /api/v1/users/:id', async () => {
            const updatedUser = { ...testUser, mobileNo: updateUserMobile };
            const response = await request(app)
                .patch(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUser);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(testUser.id);
            expect(response.body.data.mobileNo).toBe(updateUserMobile);
        });

        it('should return status 200 for GET userById', async () => {
            const response = await request(app).get(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(testUser.id);
            expect(response.body.data.firstName).toBe(testUser.firstName);
        });


        it('should return status 200 for GET /', async () => {
            const response = await request(app).get('/api/v1/users')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.some((user: User) => user.id === testUser.id)).toBe(true);
        });


        it('should return status 200 for DELETE /api/v1/users/:id (Delete user)', async () => {
            const response = await request(app)
                .delete(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return status 404 for GET userById for Invalid User ', async () => {
            const response = await request(app).get(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('User not found');
        });

        it('should return status 404 for Patch /api/v1/users/:id for Invalid User ', async () => {
            const updatedUser = { ...testUser, mobileNo: updateUserMobile };
            const response = await request(app)
                .patch(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUser);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('User not found');
        });

    });

    afterAll(async () => {
        await databaseClose();
    });
}
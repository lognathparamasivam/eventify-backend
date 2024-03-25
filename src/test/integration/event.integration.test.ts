import request from 'supertest';
import { databaseClose, databaseConnect, databaseExist } from '../../database/datasource';
import jwt from 'jsonwebtoken';
import properties from '../../properties';
import app from '../../app';
import testData from '../testData.json';
import { Event } from '../../entities/events';
export default () => {

    jest.mock('../../services/calendarService');

    beforeAll(async () => {
        await databaseExist() ? 'Already Exist' : await databaseConnect()
    })

    const testEvent = testData.events;
    const testUser = testData.users[0];
    const updateLocation = 'Chennai';
    const updateImage = ['https://example.com/avatar.jpg'];
    const token = jwt.sign({ user_id: testUser.id, email: testUser.email, }, properties.secretKey, { expiresIn: '15m' });

    describe('Events Integration tests', () => {

        beforeAll(async () => {
            await request(app)
                .post('/api/v1/users')
                .set('Authorization', `Bearer ${token}`)
                .send(testUser);
        })

        it('should return status 401 No Auth Token for GET /', async () => {
            const response = await request(app).get('/api/v1/events')
            expect(response.status).toBe(401);
        });

        it('should create a new event with status 200 for POST /api/v1/events', async () => {
            const response = await request(app)
                .post('/api/v1/events')
                .set('Authorization', `Bearer ${token}`)
                .send(testEvent);
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.id).toBe(testEvent.id);
            expect(response.body.data.title).toBe(testEvent.title);
            expect(response.body.data.startDate).toBe(testEvent.startDate);
            expect(response.body.data.endDate).toBe(testEvent.endDate);

        });

        it('should return status 200 for PATCH /api/v1/events/:id', async () => {
            const updatedEvent = { ...testEvent, location: updateLocation, media: { images: updateImage } };
            const response = await request(app)
                .patch(`/api/v1/events/${testEvent.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedEvent);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(testEvent.id);
            expect(response.body.data.location).toBe(updateLocation);
            expect(response.body.data.media.images[0]).toBe(updateImage[0]);
        });

        it('should return status 404 for PUT /api/v1/events/:id for Invalid Event ', async () => {
            const updatedEvent = { ...testEvent, location: updateLocation };
            const response = await request(app)
                .patch(`/api/v1/events/0`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedEvent);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('Event not found');
        });

        it('should return status 200 for GET eventById', async () => {
            const response = await request(app).get(`/api/v1/events/${testEvent.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(testEvent.id);
            expect(response.body.data.title).toBe(testEvent.title);
            expect(response.body.data.location).toBe(updateLocation);
        });


        it('should return status 200 for GET /', async () => {
            const response = await request(app).get('/api/v1/events')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.some((event: Event) => event.id === testEvent.id)).toBe(true);
        });


        it('should return status 404 for GET eventById for Invalid Event ', async () => {
            const response = await request(app).get(`/api/v1/events/0`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('Event not found');
        });

        it('should return status 200 for DELETE /api/v1/event/:id (Delete Event)', async () => {
            const response = await request(app)
                .delete(`/api/v1/events/${testEvent.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        afterAll(async () => {
            await request(app)
                .delete(`/api/v1/users/${testUser.id}`)
                .set('Authorization', `Bearer ${token}`);
        });
    });

    afterAll(async () => {
        await databaseClose();
    });
}
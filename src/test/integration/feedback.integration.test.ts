import request from 'supertest';
import { databaseClose, databaseConnect, databaseExist } from '../../database/datasource';
import jwt from 'jsonwebtoken';
import properties from '../../properties';
import app from '../../app';
import testData from '../testData.json';
import { InvitationStatus } from '../../types/invitationStatus';
import { Feedback } from '../../entities/feedbacks';
import { feedbackRepository } from '../../respositories/feedbackRepository';

export default () => {

    jest.mock('../../services/calendarService');
    jest.mock('../../services/notificationService');
    jest.mock('../../services/emailService');

    beforeAll(async () => {
        await databaseExist() ? 'Already Exist' : await databaseConnect()
    })

    const testEvent = testData.events;
    const testEventUser = testData.users[0];
    const testParticipantUser = testData.users[1];
    const testInvitation = testData.invitations;
    const token = jwt.sign({ user_id: testEventUser.id, email: testEventUser.email, }, properties.secretKey, { expiresIn: '15m' });
    const participantUsertoken = jwt.sign({ user_id: testParticipantUser.id, email: testParticipantUser.email, }, properties.secretKey, { expiresIn: '15m' });
    const testFeedback = testData.feedbacks;

    describe('Feedback Integration tests', () => {
        let invitationId: number;
        let feedbackId: number;

        beforeAll(async () => {

            await request(app)
                .post('/api/v1/users')
                .set('Authorization', `Bearer ${token}`)
                .send(testEventUser);
            await request(app)
                .post('/api/v1/users')
                .set('Authorization', `Bearer ${token}`)
                .send(testParticipantUser);
            await request(app)
                .post('/api/v1/events')
                .set('Authorization', `Bearer ${token}`)
                .send(testEvent);
            const response = await request(app)
                .post('/api/v1/invitations')
                .set('Authorization', `Bearer ${token}`)
                .send(testInvitation);
            invitationId = response.body.data[0].id
        })



        it('should return status 401 No Auth Token for GET /', async () => {
            const response = await request(app).get('/api/v1/feedbacks')
            expect(response.status).toBe(401);
        });


        it('should create a new feedback with status 404 for POST /api/v1/feedbacks for invalid Event', async () => {
            const response = await request(app)
                .post('/api/v1/feedbacks')
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send({ ...testFeedback, eventId: 0 });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
        });

        it('should create a new feedback with status 403 for POST /api/v1/feedbacks for not checkedin', async () => {
            const response = await request(app)
                .post('/api/v1/feedbacks')
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(testFeedback);
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
        });

        it('should create a new feedback with status 200 for POST /api/v1/feedbacks', async () => {
            const updatedInvitatoin = { status: InvitationStatus.ACCEPTED };
            await request(app)
                .patch(`/api/v1/invitations/${invitationId}/respond`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(updatedInvitatoin);
            await request(app)
                .patch(`/api/v1/invitations/${invitationId}/checkin`)
                .set('Authorization', `Bearer ${participantUsertoken}`)

            const response = await request(app)
                .post('/api/v1/feedbacks')
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(testFeedback);
            expect(response.status).toBe(200);
            feedbackId = response.body.data.id
            expect(response.body.success).toBe(true);
            expect(response.body.data.comment).toBe(testFeedback.comment)
            expect(response.body.data.userId).toBe(testParticipantUser.id)
        });

        it('should return status 200 for GET /', async () => {
            const response = await request(app).get('/api/v1/feedbacks')
                .set('Authorization', `Bearer ${participantUsertoken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.some((feedback: Feedback) => feedback.id === feedbackId)).toBe(true);
        });

        it('should return status 200 for GET feedbackById', async () => {
            const response = await request(app).get(`/api/v1/feedbacks/${feedbackId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(feedbackId);
            expect(response.body.data.comment).toBe(testFeedback.comment);
        });

        it('should return status 404 for GET feedbackById for invalid feedback', async () => {
            const response = await request(app).get(`/api/v1/feedbacks/${0}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
        });


        afterAll(async () => {
            const updatedInvitatoin = { ...testInvitation, userIds: [] };
            feedbackRepository.delete({ id: feedbackId })
            await request(app)
                .patch(`/api/v1/invitations`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedInvitatoin);
            await request(app)
                .delete(`/api/v1/events/${testEvent.id}`)
                .set('Authorization', `Bearer ${token}`);
            await request(app)
                .delete(`/api/v1/users/${testParticipantUser.id}`)
                .set('Authorization', `Bearer ${participantUsertoken}`);
            await request(app)
                .delete(`/api/v1/users/${testEventUser.id}`)
                .set('Authorization', `Bearer ${token}`);
        });
    });

    afterAll(async () => {
        await databaseClose();
    });
}
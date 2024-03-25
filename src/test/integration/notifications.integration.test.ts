import request from 'supertest';
import { databaseClose, databaseConnect, databaseExist } from '../../database/datasource';
import jwt from 'jsonwebtoken';
import properties from '../../properties';
import app from '../../app';
import testData from '../testData.json';
import { InvitationStatus } from '../../types/invitationStatus';
import { notificationRepository } from '../../respositories/notificationRepository';

export default () => {

    jest.mock('../../services/calendarService');
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
    const expectedMessageKeys = [
        `You have been Invited for Event ${testEvent.title}`,
        `You have been Removed from Event ${testEvent.title}`,
        `You have responded to ${testEvent.title} as ${InvitationStatus.ACCEPTED}`,
        'Thanks: You have checkedIn'
    ];
    describe('Notification Integration tests', () => {
        let invitationId: number;
        let notificationId: number;

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
            const response = await request(app).get('/api/v1/notifications')
            expect(response.status).toBe(401);
        });

        it('should return status 200 for GET for Event User', async () => {
            const response = await request(app).get('/api/v1/notifications')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(0);

        });

        it('should return status 200 for GET for Participant User', async () => {
            const response = await request(app).get('/api/v1/notifications')
                .set('Authorization', `Bearer ${participantUsertoken}`);
            expect(response.status).toBe(200);
            notificationId = response.body.data[0].id
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0].message.includes(expectedMessageKeys[0])).toBe(true);

        });

        it('should return status 200 for GET for Participant User Acceptance', async () => {
            const updatedInvitatoin = { status: InvitationStatus.ACCEPTED };
            await request(app)
                .patch(`/api/v1/invitations/${invitationId}/respond`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(updatedInvitatoin);

            const response = await request(app).get('/api/v1/notifications')
                .set('Authorization', `Bearer ${participantUsertoken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0].message.includes(expectedMessageKeys[2])).toBe(true);

        });

        it('should return status 200 for GET for Participant User Checkin', async () => {
            await request(app)
                .patch(`/api/v1/invitations/${invitationId}/checkin`)
                .set('Authorization', `Bearer ${participantUsertoken}`)

            const response = await request(app).get('/api/v1/notifications')
                .set('Authorization', `Bearer ${participantUsertoken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0].message.includes(expectedMessageKeys[3])).toBe(true);

        });

        it('should return status 200 for GET notificationById', async () => {
            const response = await request(app).get(`/api/v1/notifications/${notificationId}`)
                .set('Authorization', `Bearer ${participantUsertoken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(notificationId);
            expect(response.body.data.read).toBe(0);
        });

        it('should return status 404 for GET feedbackById for invalid notifications', async () => {
            const response = await request(app).get(`/api/v1/notifications/${0}`)
                .set('Authorization', `Bearer ${participantUsertoken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
        });

        it('should return status 200 for Patch /api/v1/notifications/:id for Invalid notification ', async () => {
            const response = await request(app)
                .patch(`/api/v1/notifications/${0}`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send({ read: 1 });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('Notification not found');
        });

        it('should return status 200 for Patch /api/v1/notifications/:id for notification ', async () => {
            const response = await request(app)
                .patch(`/api/v1/notifications/${notificationId}`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send({ read: 1 });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.read).toBe(1);
        });


        afterAll(async () => {
            const updatedInvitatoin = { ...testInvitation, userIds: [] };
            await notificationRepository.delete({ userId: testParticipantUser.id })
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
import request from 'supertest';
import { databaseClose, databaseConnect, databaseExist } from '../../database/datasource';
import jwt from 'jsonwebtoken';
import properties from '../../properties';
import app from '../../app';
import testData from '../testData.json';
import { Invitation } from '../../entities/invitations';
import { InvitationStatus } from '../../types/invitationStatus';
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
    const testUpdateRsvp = { title: 'Are you available ?' }
    const token = jwt.sign({ user_id: testEventUser.id, email: testEventUser.email, }, properties.secretKey, { expiresIn: '15m' });
    const participantUsertoken = jwt.sign({ user_id: testParticipantUser.id, email: testParticipantUser.email, }, properties.secretKey, { expiresIn: '15m' });

    describe('Events Integration tests', () => {

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
        })

        let invitationId: number;

        it('should return status 401 No Auth Token for GET /', async () => {
            const response = await request(app).get('/api/v1/events')
            expect(response.status).toBe(401);
        });


        it('should create a new invitation with status 200 for POST /api/v1/invitations', async () => {
            const response = await request(app)
                .post('/api/v1/invitations')
                .set('Authorization', `Bearer ${token}`)
                .send(testInvitation);
            expect(response.status).toBe(200);
            invitationId = response.body.data[0].id
            expect(response.body.data[0].eventId).toBe(testInvitation.eventId)
            expect(response.body.data[0].rsvp.title).toBe(testInvitation.rsvp.title)
        });

        it('should return status 200 for PATCH /api/v1/invitations', async () => {
            const updatedInvitatoin = { ...testInvitation, rsvp: testUpdateRsvp };
            const response = await request(app)
                .patch(`/api/v1/invitations`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedInvitatoin);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data[0].id).toBe(invitationId);
        });

        it('should return status 404 for PATCH /api/v1/invitations/:id for non organizer user', async () => {
            const updatedInvitatoin = { ...testInvitation, rsvp: testUpdateRsvp };
            const response = await request(app)
                .patch(`/api/v1/invitations`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(updatedInvitatoin);
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
        });

        it('should return status 404 for PUT /api/v1/invitations/:id for Invalid Event ', async () => {
            const updatedInvitatoin = { ...testInvitation, eventId: 0 };
            const response = await request(app)
                .patch(`/api/v1/invitations`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedInvitatoin);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('Event not found');
        });

        it('should return status 200 for GET invitationById', async () => {
            const response = await request(app).get(`/api/v1/invitations/${invitationId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(invitationId);
            expect(response.body.data.rsvp.title).toBe(testUpdateRsvp.title);
        });


        it('should return status 200 for GET /', async () => {
            const response = await request(app).get('/api/v1/invitations')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.some((invitation: Invitation) => invitation.id === invitationId)).toBe(true);
        });


        it('should return status 404 for GET invitationById for Invalid Invitation ', async () => {
            const response = await request(app).get(`/api/v1/invitations/0`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);
            expect(response.body.error.message).toBe('Invitation not found');
        });

        it('should return status 404 for PATCH /api/v1/invitations/id for respondInvitation on invalid id', async () => {
            const updatedInvitatoin = { status: InvitationStatus.ACCEPTED };
            const response = await request(app)
                .patch(`/api/v1/invitations/${0}/respond`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(updatedInvitatoin);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        it('should return status 200 for PATCH /api/v1/invitations/id for checkinInvitation for not Accepted User', async () => {
            const response = await request(app)
                .patch(`/api/v1/invitations/${invitationId}/checkin`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
            expect(response.status).toBe(402);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);

        });

        it('should return status 200 for PATCH /api/v1/invitations/id for respondInvitation', async () => {
            const updatedInvitatoin = { status: InvitationStatus.ACCEPTED };
            const response = await request(app)
                .patch(`/api/v1/invitations/${invitationId}/respond`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
                .send(updatedInvitatoin);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return status 200 for PATCH /api/v1/invitations/id for checkinInvitation', async () => {
            const response = await request(app)
                .patch(`/api/v1/invitations/${invitationId}/checkin`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });


        it('should return status 402 for PATCH /api/v1/invitations/id for already checkinInvitation', async () => {
            const response = await request(app)
                .patch(`/api/v1/invitations/${invitationId}/checkin`)
                .set('Authorization', `Bearer ${participantUsertoken}`)
            expect(response.status).toBe(402);
            expect(response.body.success).toBe(false);
            expect(response.body.error.error).toBe(true);

        });

        afterAll(async () => {
            const updatedInvitatoin = { ...testInvitation, userIds: [] };
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
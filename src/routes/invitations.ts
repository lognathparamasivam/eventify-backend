import express from 'express';
import { InvitationController } from '../controllers/invitations';
import { container } from 'tsyringe';
import { checkEventOrganizer, checkRemindAuthorized } from '../middleware/authenticateToken';
import { validateInvitationData, validateUpdateInvitationData } from '../middleware/dataValidation';

const router = express.Router();
const invitationController = container.resolve(InvitationController);
/**
 * @swagger
 * /api/v1/invitations:
 *   post:
 *     summary: Create a new Invitation
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Endpoint to create a new Invitation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/createInvitationRequest'
 *     responses:
 *       200:
 *         description: A object of Invitation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invitation'
 *       400:
 *         description: Bad request
 */
router.post('/',validateInvitationData,checkEventOrganizer, invitationController.createInvitation.bind(invitationController));
/**
 * @swagger
 * /api/v1/invitations:
 *   patch:
 *     summary: Update an invitation by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Update an invitation's information by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/updateInvitationRequest'
 *     responses:
 *       200:
 *         description: A object of Invitation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invitation'
 *       404:
 *         description: Invitation not found
 */
router.patch('/',validateUpdateInvitationData,checkEventOrganizer, invitationController.updateInvitation.bind(invitationController));
/**
 * @swagger
 * /api/v1/invitations:
 *   get:
 *     summary: Get all invitations
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Retrieve a list of all invitations.
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: number
 *         description: Event ID.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: number
 *         description: User ID.
 *     responses:
 *       200:
 *         description: A list of invitations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invitation'
 */
router.get('/', invitationController.getInvitations.bind(invitationController));
/**
 * @swagger
 * /api/v1/invitations/{invitationId}:
 *   get:
 *     summary: Get an invitations by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Retrieve an invitations by its ID
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the event to retrieve
 *     responses:
 *       200:
 *         description: A object of Invitation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invitation'
 *       404:
 *         description: Invitation not found
 */
router.get('/:invitationId', invitationController.getInvitationById.bind(invitationController));
/**
 * @swagger
 * /api/v1/invitations/{invitationId}/respond:
 *   patch:
 *     summary: Respond an invitation by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Respond to an invitation's information by its ID.
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the invitation to respond
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['PENDING','ACCEPTED','REJECTED','TENTATIVE']
 *                 description: Indicates the respond status of invitation
 *     responses:
 *       200:
 *         description: A object of Invitation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invitation'
 *       404:
 *         description: Invitation not found
 */
router.patch('/:invitationId/respond', invitationController.respondToInvitation.bind(invitationController));
/**
 * @swagger
 * /api/v1/invitations/{invitationId}/checkin:
 *   patch:
 *     summary: Checkin an invitation by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Checkin to an invitation's information by its ID.
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the invitation to checkin
 *     responses:
 *       200:
 *         description: A object of Invitation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invitation'
 *       404:
 *         description: Invitation not found
 */
router.patch('/:invitationId/checkin', invitationController.checkIn.bind(invitationController));
/**
 * @swagger
 * /api/v1/invitations/{invitationId}/remind:
 *   patch:
 *     summary: Send Reminder to User by Invitation ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Invitations]
 *     description: Send Reminder to User by Invitation ID
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the invitation to send reminder
 *     responses:
 *       200:
 *         description: Invitation update successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/successResponse'
 *       404:
 *         description: Invitation not found
 */
router.patch('/:invitationId/remind',checkRemindAuthorized, invitationController.remind.bind(invitationController));

export default router;

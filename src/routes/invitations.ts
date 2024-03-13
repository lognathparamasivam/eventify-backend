import express from 'express';
import { InvitationController } from '../controllers/invitations';
import { container } from 'tsyringe';
import { checkEventOrganizer } from '../middleware/authenticateToken';
import { validateInvitationData, validateUpdateInvitationData } from '../middleware/dataValidation';

const router = express.Router();
const invitationController = container.resolve(InvitationController);

router.post('/',validateInvitationData,checkEventOrganizer, invitationController.createInvitation.bind(invitationController));
router.patch('/:invitationId',validateUpdateInvitationData,checkEventOrganizer, invitationController.updateInvitation.bind(invitationController));
router.get('/', invitationController.getInvitations.bind(invitationController));
router.get('/:invitationId', invitationController.getInvitationById.bind(invitationController));
router.patch('/:invitationId/respond', invitationController.respondToInvitation.bind(invitationController));
router.patch('/:invitationId/checkin', invitationController.checkIn.bind(invitationController));
router.patch('/:invitationId/remind', invitationController.remind.bind(invitationController));

export default router;

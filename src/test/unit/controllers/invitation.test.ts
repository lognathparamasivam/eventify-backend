import 'reflect-metadata';
import { Request, Response } from 'express';
import { InvitationController } from '../../../controllers/invitations';
import { InvitationService } from '../../../services/invitationService';
import { Invitation } from '../../../entities/invitations';
import { UserService } from '../../../services/userService';
import { EventService } from '../../../services/eventService';
import { MailService } from '../../../services/emailService';
import { InvitationStatus } from '../../../types/invitationStatus';
import { User } from '../../../entities/users';
import { Event } from '../../../entities/events';
import { sendSuccess } from '../../../utils/sendResponse';
import { getAuthUserId } from '../../../utils/common';

jest.mock('../../../utils/common', () => ({
    ...jest.requireActual('../../../utils/common'),
    getAuthUserId: jest.fn(),
  }));
jest.mock('../../../services/invitationService');
jest.mock('../../../utils/sendResponse');

describe('InvitationController', () => {
  let invitationController: InvitationController;
  let invitationServiceMock: jest.Mocked<InvitationService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockInvitation: Invitation = {
    id: 1,
    eventId: 1,
    userId: 1,
    rsvp: { title: 'Are you attending the Event ?' },
    rsvpResponse: { options: { yes: false, no: false, maybe: false } },
    status: InvitationStatus.PENDING,
    user: new User(),
    event: new Event(),
    checkin: 0,
    checkinTime: null
  };

  beforeEach(() => {
    invitationServiceMock = new InvitationService(new UserService(),new EventService(), new MailService()) as jest.Mocked<InvitationService>;
    invitationController = new InvitationController(invitationServiceMock);
    req = {};
    res = {};
  });

  describe('createInvitation', () => {
    it('should create a new invitation', async () => {
      req.body = mockInvitation;
      (getAuthUserId as jest.Mock).mockReturnValue(1);
      invitationServiceMock.createInvitation.mockResolvedValue([mockInvitation]);

      await invitationController.createInvitation(req as Request, res as Response);

      expect(invitationServiceMock.createInvitation).toHaveBeenCalledWith(mockInvitation,1);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, [mockInvitation]);
    });

  });

  describe('updateInvitation', () => {
    it('should update an existing invitation', async () => {
      req.body = mockInvitation;
      req.params = { invitationId: '1' };
      (getAuthUserId as jest.Mock).mockReturnValue(1);
      invitationServiceMock.updateInvitation.mockResolvedValue([mockInvitation]);

      await invitationController.updateInvitation(req as Request, res as Response);

      expect(invitationServiceMock.updateInvitation).toHaveBeenCalledWith(1,mockInvitation,1);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, [mockInvitation]);
    });

  });

  describe('getIvitations', () => {
    it('should return an array of invitations', async () => {
      const mockInvitations: Invitation[] = [mockInvitation];
      (getAuthUserId as jest.Mock).mockReturnValue(1);

      invitationServiceMock.getInvitations.mockResolvedValue(mockInvitations);

      await invitationController.getInvitations(req as Request, res as Response);

      expect(invitationServiceMock.getInvitations).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockInvitations);
    });
  });

  describe('getInvitationById', () => {
    it('should return an invitation by ID', async () => {
      req.params = { invitationId: '1' };
      (getAuthUserId as jest.Mock).mockReturnValue(1);

      invitationServiceMock.getInvitationById.mockResolvedValue(mockInvitation);

      await invitationController.getInvitationById(req as Request, res as Response);

      expect(invitationServiceMock.getInvitationById).toHaveBeenCalledWith(1,1);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockInvitation);
    });
  });

});

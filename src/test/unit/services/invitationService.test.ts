import { EventMedia } from "../../../entities/eventMedia";
import { Event } from "../../../entities/events";
import { Invitation } from "../../../entities/invitations";
import { User } from "../../../entities/users";
import { invitationRepository } from "../../../respositories/invitationRepository";
import { userRepository } from "../../../respositories/userRepository";
import { MailService } from "../../../services/emailService";
import { EventService } from "../../../services/eventService";
import { InvitationService } from "../../../services/invitationService";
import { NotificationService } from "../../../services/notificationService";
import { UserService } from "../../../services/userService";
import { EventStatus } from "../../../types/eventStatus";
import { FilterDto } from "../../../types/filterDto";
import { CreateInvitationDto } from "../../../types/invitationDto";
import { InvitationStatus } from "../../../types/invitationStatus";

jest.mock('../../../respositories/eventRepository');
jest.mock('../../../respositories/userRepository');
jest.mock('../../../respositories/notificationRepository');
jest.mock('../../../respositories/tokenRepository');
jest.mock('../../../respositories/invitationRepository');
jest.mock('../../../services/eventService');
jest.mock('../../../services/userService');
jest.mock('../../../services/emailService');
jest.mock('../../../services/calendarService');

describe('InvitationService', () => {
  let invitationService: InvitationService;
  const eventService = new EventService();
  const userService = new UserService();
  const notificationService = new NotificationService();

  beforeEach(() => {

    invitationService = new InvitationService(
      userService,
      eventService,
      new MailService(),
      notificationService
    );
  });
  const mockEventId = 7;
  const mockCreateInvitationDto: CreateInvitationDto = {
    rsvp: { title: 'Are you attending the Event ?' },
    rsvpResponse: { options: { yes: false, no: false, maybe: false } },
    userIds: [6],
    eventId: 7
  };
  const mockUpdateInvitationDto: CreateInvitationDto = {
    rsvp: { title: "Are you attending the Event ?" },
    rsvpResponse: { options: { "yes": true, "no": false, "maybe": false } },
    userIds: [6],
    eventId: mockEventId
  };
  const mockEvent: Event = {
    id: 7,
    title: 'Test Event',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date(),
    userId: 1,
    invitations: [],
    location: '',
    user: new User,
    media: new EventMedia(),
    feedbacks: [],
    calendarId: "",
    status: EventStatus.CONFIRMED
  };

  const mockInvitationId = 1;
      const mockInvitation: Invitation = {
          id: mockInvitationId,
          eventId: 7,
          userId: 6,
          rsvp: { title: "Are you attending the Event ?" },
          rsvpResponse: { options: { yes: false, no: false, maybe: false } },
          status: InvitationStatus.PENDING,
          user: new User,
          event: new Event,
          checkin: 0,
          checkinTime: null
      };

  describe('createInvitation', () => {
    it('should create invitations for valid data', async () => {
      
      (eventService.getEventById as jest.Mock).mockResolvedValue(mockEvent);
      (userService.getUserById as jest.Mock).mockResolvedValue({ id: 6, email: 'test@example.com' });
      (invitationRepository.save as jest.Mock).mockResolvedValue([mockCreateInvitationDto]);

      await invitationService.createInvitation(mockCreateInvitationDto, 1);

      expect(invitationRepository.save).toHaveBeenCalledTimes(1);
      expect(invitationRepository.save).toHaveBeenCalledWith(expect.any(Array));

      expect(eventService.getEventById).toHaveBeenCalledWith(mockCreateInvitationDto.eventId,1);
      expect(userService.getUserById).toHaveBeenCalledWith(6);
    });

    it('should throw an error if the event does not exist', async () => {
      (eventService.getEventById as jest.Mock).mockResolvedValue(null);

      await expect(invitationService.createInvitation(mockCreateInvitationDto, 1)).rejects.toThrow('Event not found');
    });

    it('should throw an error if a user does not exist', async () => {

      (eventService.getEventById as jest.Mock).mockResolvedValue(mockEvent);
      (userService.getUserById as jest.Mock).mockResolvedValue(null);
     

      await expect(invitationService.createInvitation(mockCreateInvitationDto, 1)).rejects.toThrow('User not found');
    });
  });

  describe('updateInvitation', () => {
    it('should update invitations for valid data', async () => {
      const mockInvitationId = 1;
      
      const mockInvitation: Invitation = {
          id: mockInvitationId,
          eventId: mockEventId,
          userId: 6,
          rsvp: mockUpdateInvitationDto.rsvp,
          rsvpResponse: mockUpdateInvitationDto.rsvpResponse,
          status: InvitationStatus.PENDING,
          user: new User,
          event: new Event,
          checkin: 0,
          checkinTime: null
      };
      (invitationRepository.findOneBy as jest.Mock).mockResolvedValue(mockInvitation);
      (eventService.getEventById as jest.Mock).mockResolvedValue({ id: mockEventId });
      (invitationRepository.findBy as jest.Mock).mockResolvedValue([mockInvitation]);
      (invitationRepository.save as jest.Mock).mockResolvedValue([mockInvitation]);

      const result = await invitationService.updateInvitation(mockUpdateInvitationDto, 1);

      expect(result).toHaveLength(1);
      expect(invitationRepository.save).toHaveBeenCalledTimes(3);
      expect(invitationRepository.save).toHaveBeenCalledWith(mockInvitation);
      expect(eventService.getEventById).toHaveBeenCalledWith(mockEventId, 1);
    });

  });

  describe.skip('deleteInvitation', () => {
    it('should delete the invitation for valid invitation ID', async () => {
      
      (invitationRepository.findOneBy as jest.Mock).mockResolvedValue(mockInvitation);
      (userRepository.findOne as jest.Mock).mockResolvedValue(6);

      (eventService.getEventById as jest.Mock).mockResolvedValue({ id: mockEventId });

      await invitationService.deleteInvitation(mockInvitationId);

      expect(invitationRepository.delete).toHaveBeenCalledWith({ id: mockInvitationId });
    });

    it('should throw an error if the invitation does not exist', async () => {
      (invitationRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const mockInvitationId = 1;

      await expect(invitationService.deleteInvitation(mockInvitationId)).rejects.toThrowError('Invitation not found');
    });
  });

  describe('getInvitations', () => {
    it('should return invitations for valid filter parameters', async () => {
      const mockFilter: FilterDto = {  };
      const mockInvitations: Invitation[] = [mockInvitation];
      (invitationRepository.find as jest.Mock).mockResolvedValue(mockInvitations);
      
      const result = await invitationService.getInvitations(mockFilter,1);

      expect(result).toEqual(mockInvitations);
    });

  });

  describe('getInvitationById', () => {
    it('should return the invitation for a valid invitation ID', async () => {
      (invitationRepository.findOne as jest.Mock).mockResolvedValue(mockInvitation);
      
      const result = await invitationService.getInvitationById(mockInvitationId,1);

      expect(result).toEqual(mockInvitation);
    });

    it('should throw an error if the invitation does not exist', async () => {
      const mockInvitationId = 1;
      (invitationRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(invitationService.getInvitationById(mockInvitationId,1)).rejects.toThrow('Invitation not found');
    });
  });

});

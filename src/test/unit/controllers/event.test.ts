import 'reflect-metadata';
import { Request, Response } from 'express';
import { EventController } from '../../../controllers/events';
import { EventService } from '../../../services/eventService';
import { User } from '../../../entities/users';
import { Event } from '../../../entities/events';
import { EventMedia } from '../../../entities/eventMedia';
import { CreateEventDto, UpdateEventDto } from '../../../types/eventDto';
import { sendSuccess } from '../../../utils/sendResponse';
import { getAuthUserId } from '../../../utils/common';

jest.mock('../../../utils/common', () => ({
    ...jest.requireActual('../../../utils/common'),
    getAuthUserId: jest.fn(),
  }));
jest.mock('../../../services/eventService');
jest.mock('../../../utils/sendResponse');

describe('EventController', () => {
  let eventController: EventController;
  let eventServiceMock: jest.Mocked<EventService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockEvent: Event = {
    title: 'Test Event',
    description: 'Test Description',
    startDate: new Date('2024-03-18T04:44:13.000Z'),
    endDate: new Date('2024-03-19T04:44:13.000Z'),
    user: new User(),
    userId: 5,
    invitations: [],
    location: '',
    media: new EventMedia(),
    id: 0,
    feedbacks: []
  };

  const mockCreateEventDto: CreateEventDto = {
    title: 'Test Event',
    description: 'Test Description',
    startDate: new Date('2024-03-18T04:44:13.000Z'),
    endDate: new Date('2024-03-19T04:44:13.000Z'),
  };

  const mockUpdateEventDto: UpdateEventDto = {
      title: 'Updated Event Title',
      description: 'Updated Event Description',
      startDate: new Date('2024-03-18T04:44:13.000Z'),
      endDate: new Date('2024-03-19T04:44:13.000Z'),
      location: 'Chennai'
  };

  beforeEach(() => {
    eventServiceMock = new EventService() as jest.Mocked<EventService>;
    eventController = new EventController(eventServiceMock);
    req = {};
    res = {};
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      req.body = mockCreateEventDto;
      (getAuthUserId as jest.Mock).mockReturnValue(1);
      eventServiceMock.createEvent.mockResolvedValue(mockEvent);

      await eventController.createEvent(req as Request, res as Response);

      expect(eventServiceMock.createEvent).toHaveBeenCalledWith(mockCreateEventDto,1);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockEvent);
    });
  });

  describe('getEvents', () => {
    it('should return an array of events', async () => {
      const mockEvents: Event[] = [mockEvent];
      (getAuthUserId as jest.Mock).mockReturnValue(1);

      eventServiceMock.getEvents.mockResolvedValue(mockEvents);

      await eventController.getEvents(req as Request, res as Response);

      expect(eventServiceMock.getEvents).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockEvents);
    });
  });

  describe('getEventById', () => {
    it('should return an event by ID', async () => {
      req.params = { eventId: '1' };
      (getAuthUserId as jest.Mock).mockReturnValue(1);

      eventServiceMock.getEventById.mockResolvedValue(mockEvent);

      await eventController.getEventById(req as Request, res as Response);

      expect(eventServiceMock.getEventById).toHaveBeenCalledWith(1,1);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      req.params = { eventId: '1' };
      req.body = mockUpdateEventDto;

      eventServiceMock.updateEvent.mockResolvedValue(mockEvent);

      await eventController.updateEvent(req as Request, res as Response);

      expect(eventServiceMock.updateEvent).toHaveBeenCalledWith(1, mockUpdateEventDto);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockEvent);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      req.params = { eventId: '1' };
      eventServiceMock.deleteEvent.mockResolvedValue(undefined);

      await eventController.deleteEvent(req as Request, res as Response);

      expect(eventServiceMock.deleteEvent).toHaveBeenCalledWith(1);
      expect(sendSuccess).toHaveBeenCalledWith(req, res);
    });
  });
});

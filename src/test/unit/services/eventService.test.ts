import { EventMedia } from "../../../entities/eventMedia";
import { Event } from "../../../entities/events";
import { User } from "../../../entities/users";
import { eventRepository } from "../../../respositories/eventRepository";
import { EventService } from "../../../services/eventService";
import { CreateEventDto, UpdateEventDto } from "../../../types/eventDto";
import { EventStatus } from "../../../types/eventStatus";
import { FilterDto } from "../../../types/filterDto";

jest.mock('../../../respositories/tokenRepository');
jest.mock('../../../services/calendarService');

jest.mock('../../../respositories/eventRepository', () => ({
    eventRepository: {
        save: jest.fn(),
        findOneBy: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        findOne: jest.fn(),
    },
}));
jest.mock('../../../respositories/eventMediaRepository', () => ({
    eventMediaRepository: {
        save: jest.fn(),
    },
}));

const createEventDto: CreateEventDto = {
    title: "Test Event",
    description: "Test Description",
    startDate: new Date('2024-03-18T04:44:13.000Z'),
    endDate: new Date('2024-03-19T04:44:13.000Z')
};
const userId = 1; 
const mockEvent: Event = {
    title: createEventDto.title,
    description: createEventDto.description,
    location: "",
    startDate: createEventDto.startDate,
    endDate: createEventDto.endDate,
    user: new User(),
    userId: userId,
    invitations: [],
    id: 0,
    media: new EventMedia(),
    feedbacks: [],
    calendarId: "",
    status: EventStatus.CONFIRMED
};

describe('EventService', () => {
    let eventService: EventService;

    beforeEach(() => {
        eventService = new EventService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createEvent', () => {
        it('should create a new event', async () => {

            (eventRepository.save as jest.Mock).mockResolvedValue(mockEvent);

            const result = await eventService.createEvent(createEventDto, userId);

            expect(eventRepository.save).toHaveBeenCalledWith({
                ...createEventDto,
                userId: userId,
            });
            expect(result).toEqual(mockEvent);
        });
    });

    describe('updateEvent', () => {
        it('should update an existing event', async () => {
            const eventId = 1; 
            const updateEventDto: UpdateEventDto = {
                title: "Updated Event",
                description: "Updated Description",
                startDate: new Date('2024-03-20T04:44:13.000Z'),
                endDate: new Date('2024-03-21T04:44:13.000Z'),
                location: ""
            };

            const existingEvent: Event = {
                id: eventId,
                title: "Existing Event",
                description: "Existing Description",
                startDate: new Date('2024-03-18T04:44:13.000Z'),
                endDate: new Date('2024-03-19T04:44:13.000Z'),
                userId: userId,
                user: new User(),
                invitations: [],
                media: new EventMedia(),
                location: "",
                feedbacks: [],
                calendarId: "",
    status: EventStatus.CONFIRMED
            };

            (eventRepository.findOneBy as jest.Mock).mockResolvedValue(existingEvent);

            const updatedEvent = await eventService.updateEvent(eventId, updateEventDto);

            expect(eventRepository.findOneBy).toHaveBeenCalledWith({ id: eventId });
            expect(updatedEvent).toEqual({
                ...existingEvent,
                ...updateEventDto,
            });
        });

        it('should throw error if Event not found', async () => {
            (eventRepository.findOne as jest.Mock).mockResolvedValue(null);
      
            await expect(eventService.getEventById(5,5)).rejects.toThrowError('Event not found');
          });
    });

    describe('getEvents', () => {
        it('should get a list of events based on filters', async () => {
            const filter: FilterDto = {}; 
            const mockEvents: Event[] = [mockEvent]; 
            (eventRepository.find as jest.Mock).mockResolvedValue(mockEvents);

            const events = await eventService.getEvents(filter, userId);

            expect(eventRepository.find).toHaveBeenCalledWith(expect.any(Object));
            expect(events).toEqual(mockEvents);
        });
    });

    describe('getEventById', () => {
        it('should get an event by ID', async () => {
            const eventId = 1; 
            const mockEvent = {}; 

            (eventRepository.findOne as jest.Mock).mockResolvedValue(mockEvent);

            const event = await eventService.getEventById(eventId, userId);

            expect(event).toEqual(mockEvent);
        });

        it('should throw error if Event not found', async () => {
            (eventRepository.findOne as jest.Mock).mockResolvedValue(null);
      
            await expect(eventService.getEventById(5,5)).rejects.toThrowError('Event not found');
          });
    });

    describe('deleteEvent', () => {
        it('should delete an event', async () => {
            const eventId = 1; 

            await eventService.deleteEvent(eventId);

            expect(eventRepository.delete).toHaveBeenCalledWith({ id: eventId });
        });

        it('should throw error if Event not found', async () => {
            (eventRepository.findOne as jest.Mock).mockResolvedValue(null);
      
            await expect(eventService.getEventById(5,5)).rejects.toThrowError('Event not found');
          });
    });
});

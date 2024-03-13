import { Event } from '../entities/events';
import { CreateEventDto, UpdateEventDto } from '../types/eventDto';
import { throwError } from '../utils/ErrorResponse';
import { eventRepository } from '../respositories/eventRepository';
import { eventMediaRepository } from '../respositories/eventMediaRepository';
import { injectable } from 'tsyringe';
import logger from '../logger';
import constants from '../utils/constants';
import { applyFilters, isFilterParamsValid, lookupReponseByEventStatus } from '../utils/common';
import { FilterDto } from '../types/filterDto';
import { createCalendarEvent, deleteCalendarEvent, getCalendarEvent, updateCalendarEvent } from './calendarService';

@injectable()
export class EventService {

  async createEvent(createEventDto: CreateEventDto, userId: number): Promise<Event> {
    const event = await eventRepository.save({
      ...createEventDto,
      userId: userId
    })
    const calendarId = await createCalendarEvent(userId, event, []);
    event.calendarId = calendarId
    return await eventRepository.save(event);
  }


  async updateEvent(eventId: number, updateEventDto: UpdateEventDto): Promise<Event | null> {
    try {
      const event = await eventRepository.findOneBy({ id: eventId })
      if (!event) {
        throwError({
          errorCategory: 'RESOURCE_NOT_FOUND',
          message: 'Event not found'
        })
      }

      Object.assign(event!, updateEventDto);

      await eventRepository.save(event!);

      if (updateEventDto.media) {
        await eventMediaRepository.save({
          eventId: event!.id,
          images: updateEventDto.media?.images ?? [],
          videos: updateEventDto.media?.videos ?? [],
          documents: updateEventDto.media?.documents ?? []
        })
      }
      const calenderEventData = await getCalendarEvent(event!.userId, event!.calendarId);
      if (calenderEventData) {
        calenderEventData.summary = event?.title;
        calenderEventData.description = event?.description;
        calenderEventData.start!.dateTime = new Date(event!.startDate!).toISOString()
        calenderEventData.end!.dateTime = new Date(event!.endDate!).toISOString();
        calenderEventData.location = event?.location
        calenderEventData.status = lookupReponseByEventStatus(event!.status)
        await updateCalendarEvent(event!.userId, event!.calendarId, calenderEventData)
      }

      return event;
    } catch (err) {
      logger.error(err);
      throwError({
        errorCategory: 'INTERNAL_SERVER_ERROR',
        message: constants.ERROR_MESSAGES[constants.INTERNAL_SERVER_ERROR]
      })
      return null;
    }
  }

  async getEvents(filter: FilterDto, userId: number): Promise<Event[]> {
    if (!isFilterParamsValid(filter, constants.EVENT_VALID_PARAMS)) {
      throwError({
        errorCategory: constants.ERROR_MESSAGES[constants.BAD_REQUEST],
        message: `Invalid Filter Parameter(s)`,
      })
    }

    const options = applyFilters(filter);

    options.where = [
      { ...options.where, userId: userId },
      { ...options.where, invitations: { userId: userId } },];

    return await eventRepository.find(options);
  }

  async getEventById(eventId: number, userId: number): Promise<Event | null> {

    const event = await eventRepository.findOne({
      where: [
        { id: eventId, userId: userId },
        { id: eventId, invitations: { userId: userId } }
      ]
    });

    if (!event) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Event not found'
      });
    }
    return event;
  }

  async getEventByCalendarId(calenderId: string): Promise<Event | null> {
    return await eventRepository.findOne({ where: { calendarId: calenderId } });
  }

  async deleteEvent(id: number): Promise<void> {
    try {
      const event = await eventRepository.findOneBy({ id: id })
      if (!event) {
        throwError({
          errorCategory: 'RESOURCE_NOT_FOUND',
          message: 'Event not found'
        })
      }
      await deleteCalendarEvent(event!.userId,event!.calendarId);
      await eventRepository.delete({ id: id });
    } catch (err) {
      throwError({
        errorCategory: 'INTERNAL_SERVER_ERROR',
        message: constants.ERROR_MESSAGES[constants.INTERNAL_SERVER_ERROR]
      })
      logger.error(`Error in deleteEvent with ${id}:`, err)
    }
  }
}

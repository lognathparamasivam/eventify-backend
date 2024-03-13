import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { sendError, sendSuccess } from '../utils/sendResponse';
import { CreateEventDto, UpdateEventDto } from '../types/eventDto';
import { Event } from '../entities/events';
import { injectable } from 'tsyringe';
import { getAuthUserId } from '../utils/common';
import logger from '../logger';
import { FilterDto } from '../types/filterDto';

@injectable()
export class EventController {

  constructor(private readonly eventService: EventService) {}

  async createEvent(req: Request, res: Response): Promise<void> {
    const createEventDto: CreateEventDto = req.body;
    await this.eventService.createEvent(createEventDto,getAuthUserId(req))
    .then((result: Event) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async getEvents(req: Request, res: Response): Promise<void> {
     await this.eventService.getEvents(req.query as FilterDto,getAuthUserId(req)).then((results: Event[] | null) => {
      sendSuccess(req, res, results);
    })
    .catch((error) => {
      logger.error(error)
      sendError(req, res, error);
    });
  }

  async getEventById(req: Request, res: Response): Promise<void> {
    const eventId: number = parseInt(req.params.eventId);
    await this.eventService.getEventById(eventId,getAuthUserId(req)).then((result: Event | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    const eventId: number = parseInt(req.params.eventId);
    const updateEventDto: UpdateEventDto = req.body;
    await this.eventService.updateEvent(eventId, updateEventDto).then((result: Event | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    const eventId: number = parseInt(req.params.eventId);
    await this.eventService.deleteEvent(eventId).then(() => {
      sendSuccess(req, res);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }
  
}

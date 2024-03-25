import { injectable } from 'tsyringe';
import { throwError } from '../utils/ErrorResponse';
import { feedbackRepository } from '../respositories/feedbackRepository';
import { Feedback } from '../entities/feedbacks';
import { CreateFeedbackDto } from '../types/feedbackDto';
import { FilterDto } from '../types/filterDto';
import { applyFilters, isFilterParamsValid } from '../utils/common';
import constants from '../utils/constants';
import { eventRepository } from '../respositories/eventRepository';

@injectable()
export class FeedBackService {
  
  async createFeedback(feedback: CreateFeedbackDto, userId: number): Promise<Feedback> {
    const event = await eventRepository.findOneBy({id: feedback.eventId})
    if(!event){
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Event not found'
      })
    }
    return await feedbackRepository.save({comment: feedback.comment, eventId: feedback.eventId, userId: userId});
  }

  async getFeedbacks(filter: FilterDto, userId: number): Promise<Feedback[]> {
    if (!isFilterParamsValid(filter, constants.FEEDBACKS_VALID_PARAMS)) {
      throwError({
        errorCategory: constants.ERROR_MESSAGES[constants.BAD_REQUEST],
        message: `Invalid Filter Parameter(s)`,
      })
    }
    const options = applyFilters(filter);
    options.where = [
      { ...options.where, userId: userId },
      { ...options.where, event: { userId: userId} }];
    return await feedbackRepository.find(options);
  
  }

  async getFeedbackById(feedbackId: number, userId: number): Promise<Feedback | null> {
    const feedback = await feedbackRepository.findOne({
      where: {
        id: feedbackId,
        event: { userId: userId}
      }
    })
    if(!feedback){
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Feedback not found'
      })
    }
    return feedback;
  }
  
}

import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../utils/sendResponse';
import { injectable } from 'tsyringe';
import { FeedBackService } from '../services/feedbackService';
import { CreateFeedbackDto } from '../types/feedbackDto';
import { Feedback } from '../entities/feedbacks';
import { FilterDto } from '../types/filterDto';
import { getAuthUserId } from '../utils/common';

@injectable()
export class FeedbackController {

  constructor(private readonly feedbackService: FeedBackService) {}

  async createFeedback(req: Request, res: Response): Promise<void> {
    const feedback: CreateFeedbackDto = req.body;
   await this.feedbackService.createFeedback(feedback,getAuthUserId(req)).then((result: Feedback | null) => {
    sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
    }

  async getFeedbacks(req: Request, res: Response): Promise<void> {
     await this.feedbackService.getFeedbacks(req.query as FilterDto, getAuthUserId(req)).then((results: Feedback[] | null) => {
      sendSuccess(req, res, results);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async getFeedbackById(req: Request, res: Response): Promise<void> {
    const feedbackId: number = parseInt(req.params.feedbackId);
    await this.feedbackService.getFeedbackById(feedbackId,getAuthUserId(req)).then((result: Feedback | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }
}

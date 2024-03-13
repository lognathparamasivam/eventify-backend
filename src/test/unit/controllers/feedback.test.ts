import 'reflect-metadata';
import { Request, Response } from 'express';
import { FeedbackController } from "../../../controllers/feedbacks";
import { Event } from "../../../entities/events";
import { Feedback } from "../../../entities/feedbacks";
import { User } from "../../../entities/users";
import { FeedBackService } from "../../../services/feedbackService";
import { sendSuccess } from "../../../utils/sendResponse";
import { getAuthUserId } from '../../../utils/common';

jest.mock('../../../utils/common', () => ({
    ...jest.requireActual('../../../utils/common'),
    getAuthUserId: jest.fn(),
  }));

jest.mock('../../../services/feedbackService');
jest.mock('../../../utils/sendResponse');

describe('FeedbackController', () => {
  let feedbackController: FeedbackController;
  let feedbackService: jest.Mocked<FeedBackService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    feedbackService = new FeedBackService() as jest.Mocked<FeedBackService>;
    feedbackController = new FeedbackController(feedbackService);
    req = {};
    res = {};
  });
  const mockFeedback: Feedback = {
    id: 1, comment: 'Test Feedback', userId: 1, eventId: 1,
    user: new User(),
    event: new Event()
};
  describe('createFeedback', () => {
    it('should create a new feedback and send success response', async () => {
      (feedbackService.createFeedback as jest.Mock).mockResolvedValue(mockFeedback);
    
      await feedbackController.createFeedback(req as Request, res as Response);
    
      expect(feedbackService.createFeedback).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockFeedback);
    });
    

  });

  describe('getFeedbacks', () => {
    it('should retrieve feedbacks and send success response', async () => {
      const mockFeedbacks: Feedback[] = [mockFeedback];
      (getAuthUserId as jest.Mock).mockReturnValue(1);

      (feedbackService.getFeedbacks as jest.Mock).mockResolvedValue(mockFeedbacks);

      await feedbackController.getFeedbacks(req as Request, res as Response);

      expect(feedbackService.getFeedbacks).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockFeedbacks);
    });
  });

  describe('getFeedbackById', () => {
    it('should retrieve a feedback by ID and send success response', async () => {
      req.params = { feedbackId: '1' };
      (getAuthUserId as jest.Mock).mockReturnValue(1);

      (feedbackService.getFeedbackById as jest.Mock).mockResolvedValue(mockFeedback);

      await feedbackController.getFeedbackById(req as Request, res as Response);

      expect(feedbackService.getFeedbackById).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockFeedback);
    });

  });
});

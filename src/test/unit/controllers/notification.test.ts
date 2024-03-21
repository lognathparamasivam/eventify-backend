import 'reflect-metadata';
import { Request, Response } from 'express';
import { NotificationController } from "../../../controllers/notification";
import { Notification } from "../../../entities/notifications";
import { NotificationService } from "../../../services/notificationService";
import { getAuthUserId } from "../../../utils/common";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import { User } from '../../../entities/users';
import { UpdateNotificationDto } from '../../../types/notificationDto';

jest.mock('../../../utils/common', () => ({
  ...jest.requireActual('../../../utils/common'),
  getAuthUserId: jest.fn(),
}));
jest.mock('../../../utils/sendResponse');

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: jest.Mocked<NotificationService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockNotification: Notification = {
    id: 1, message: 'Notification 1',
    user: new User(),
    userId: 5,
    read: 0
};
const updatedNotification: UpdateNotificationDto = {
    read: 1,
    message: ''
};
  beforeEach(() => {
    notificationService = new NotificationService() as jest.Mocked<NotificationService>;
    notificationController = new NotificationController(notificationService);
    req = {};
    res = {};
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should retrieve notifications and send success response', async () => {
      const mockNotifications: Notification[] = [mockNotification];
      const mockAuthUserId = 1;
      notificationService.getNotifications = jest.fn()
      notificationService.getNotifications.mockResolvedValue(mockNotifications);
      (getAuthUserId as jest.Mock).mockReturnValue(mockAuthUserId);

      await notificationController.getNotifications(req as Request, res as Response);

      expect(notificationService.getNotifications).toHaveBeenCalledWith(mockAuthUserId);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockNotifications);
    });

    it('should send error response if retrieval fails', async () => {
      const mockError = new Error('Failed to retrieve notifications');
      notificationService.getNotifications = jest.fn()

      notificationService.getNotifications.mockRejectedValue(mockError);

      await notificationController.getNotifications(req as Request, res as Response);

      expect(sendError).toHaveBeenCalledWith(req, res, mockError);
    });
  });

  describe('getNotificationById', () => {
    it('should retrieve a notification by ID and send success response', async () => {
      
      const notificationId = 1;
      const mockAuthUserId = 1;
      notificationService.getNotificationById = jest.fn()
      notificationService.getNotificationById.mockResolvedValue(mockNotification);
      (getAuthUserId as jest.Mock).mockReturnValue(mockAuthUserId);
      req.params = { notificationId: notificationId.toString() };

      await notificationController.getNotificationById(req as Request, res as Response);

      expect(notificationService.getNotificationById).toHaveBeenCalledWith(notificationId, mockAuthUserId);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockNotification);
    });

    it('should send error response if retrieval fails', async () => {
      req.params = { notificationId: '1' };
      const mockError = new Error('Failed to retrieve notification');
      notificationService.getNotificationById = jest.fn()
      notificationService.getNotificationById.mockRejectedValue(mockError);

      await notificationController.getNotificationById(req as Request, res as Response);

      expect(sendError).toHaveBeenCalledWith(req, res, mockError);
    });
  });

  describe('updateNotification', () => {
    it('should update a notification and send success response', async () => {
      const notificationId = 1;
      const mockAuthUserId = 1;

      const mockUpdatedNotification: Notification = {
          id: notificationId, message: 'Updated Notification', read: 1,
          user: new User,
          userId: 4
      };
      req.params = { notificationId: notificationId.toString() };
      req.body = updatedNotification;
      notificationService.updateNotification = jest.fn()
      notificationService.updateNotification.mockResolvedValue(mockUpdatedNotification);
      (getAuthUserId as jest.Mock).mockReturnValue(mockAuthUserId);

      await notificationController.updateNotification(req as Request, res as Response);

      expect(notificationService.updateNotification).toHaveBeenCalledWith(notificationId, mockAuthUserId, updatedNotification);
      expect(sendSuccess).toHaveBeenCalledWith(req, res, mockUpdatedNotification);
    });

    it('should send error response if update fails', async () => {
      const notificationId = 1;
      const mockAuthUserId = 1;
      const mockError = new Error('Failed to update notification');
      req.params = { notificationId: notificationId.toString() };
      req.body = updatedNotification;
      notificationService.updateNotification = jest.fn()

      notificationService.updateNotification.mockRejectedValue(mockError);
      (getAuthUserId as jest.Mock).mockReturnValue(mockAuthUserId);

      await notificationController.updateNotification(req as Request, res as Response);

      expect(sendError).toHaveBeenCalledWith(req, res, mockError);
    });
  });
});

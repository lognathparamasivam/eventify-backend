import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../utils/sendResponse';
import { injectable } from 'tsyringe';
import { NotificationService } from '../services/notificationService';
import { UpdateNotificationDto } from '../types/notificationDto';
import { Notification } from '../entities/notifications';
import { getAuthUserId } from '../utils/common';
@injectable()
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  async getNotifications(req: Request, res: Response): Promise<void> {
     await this.notificationService.getNotifications(getAuthUserId(req)).then((results: Notification[] | null) => {
      sendSuccess(req, res, results);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    const notificationId: number = parseInt(req.params.notificationId);
    await this.notificationService.getNotificationById(notificationId,getAuthUserId(req)).then((result: Notification | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    const notificationId: number = parseInt(req.params.notificationId);
    const updatedNotification: UpdateNotificationDto = req.body;
    await this.notificationService.updateNotification(notificationId,getAuthUserId(req), updatedNotification).then((result: Notification | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }
}

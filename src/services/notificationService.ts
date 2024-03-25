import { injectable } from 'tsyringe';
import { throwError } from '../utils/ErrorResponse';
import { CreateNotificationDto, UpdateNotificationDto } from '../types/notificationDto';
import { notificationRepository } from '../respositories/notificationRepository';
import { Notification } from '../entities/notifications';

@injectable()
export class NotificationService {

  async createNotification(notification: CreateNotificationDto): Promise<Notification> {
    return await notificationRepository.save(notification);
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return await notificationRepository.find({
      where: {
        userId: userId
      }, order: {
        id: 'DESC'
      }
    });
  }

  async getNotificationById(notificationId: number, userId: number): Promise<Notification | null> {
    const notification = await notificationRepository.findOne({
      where: {
        id: notificationId,
        userId: userId
      }
    })
    if (!notification) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Notification not found'
      })
    }
    return notification;
  }

  async updateNotification(notificationId: number, userId: number, updateNotificationData: UpdateNotificationDto): Promise<Notification> {
    const notification = await notificationRepository.findOne({
      where: {
        id: notificationId,
        userId: userId
      }
    })
    if (!notification) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Notification not found'
      })
    }
    Object.assign(notification!, updateNotificationData);
    return await notificationRepository.save(notification!);
  }
}

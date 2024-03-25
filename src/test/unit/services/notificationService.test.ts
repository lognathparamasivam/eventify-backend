import { Notification } from "../../../entities/notifications";
import { User } from "../../../entities/users";
import { notificationRepository } from "../../../respositories/notificationRepository";
import { NotificationService } from "../../../services/notificationService";
import { CreateNotificationDto, UpdateNotificationDto } from "../../../types/notificationDto";
import { throwError } from "../../../utils/ErrorResponse";

jest.mock('../../../utils/ErrorResponse');
jest.mock('../../../respositories/notificationRepository');

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
    jest.clearAllMocks();
  });
  const mockNotification: Notification = {
    id: 1, userId: 1, message: 'Test Notification',
    user: new User(),
    read: 0
};
const updateNotificationData: UpdateNotificationDto = {
    read: 0,
    message: ""
};
  describe('createNotification', () => {
    it('should create a new notification', async () => {
      
      const createNotificationDto: CreateNotificationDto = { userId: 1, message: 'Test Notification' };
      
      (notificationRepository.save as jest.Mock).mockResolvedValue(mockNotification);

      const result = await notificationService.createNotification(createNotificationDto);

      expect(notificationRepository.save).toHaveBeenCalledWith(createNotificationDto);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getNotifications', () => {
    it('should retrieve notifications by user ID', async () => {
      const userId = 1;
      const mockNotifications: Notification[] = [mockNotification];
      
      (notificationRepository.find as jest.Mock).mockResolvedValue(mockNotifications);

      const result = await notificationService.getNotifications(userId);

      expect(notificationRepository.find).toHaveBeenCalledWith({
        where: {
          userId: userId
        }, order: {
          id: 'DESC'
        }
      });
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('getNotificationById', () => {
    it('should retrieve a notification by ID and user ID', async () => {
      const notificationId = 1;
      const userId = 1;
      
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(mockNotification);

      const result = await notificationService.getNotificationById(notificationId, userId);

      expect(notificationRepository.findOne).toHaveBeenCalledWith({ where: { id: notificationId, userId } });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('updateNotification', () => {
    it('should update a notification by ID and user ID', async () => {
      const notificationId = 1;
      const userId = 1;
      
      
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(mockNotification);
      (notificationRepository.save as jest.Mock).mockResolvedValue(mockNotification);

      const result = await notificationService.updateNotification(notificationId, userId, updateNotificationData);

      expect(notificationRepository.findOne).toHaveBeenCalledWith({ where: { id: notificationId, userId } });
      expect(notificationRepository.save).toHaveBeenCalledWith({ ...mockNotification, ...updateNotificationData });
      expect(result).toEqual(mockNotification);
    });

    it('should throw an error if notification is not found', async () => {
      const notificationId = 1;
      const userId = 1;
      
      (notificationRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(notificationService.updateNotification(notificationId, userId, updateNotificationData)).rejects.toThrowError();
      expect(throwError).toHaveBeenCalledWith({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Notification not found',
      });
    });
  });
});

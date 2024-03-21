import express from 'express';
import { container } from 'tsyringe';
import { NotificationController } from '../controllers/notification';
import { validateUpdateNotificationData } from '../middleware/dataValidation';

const router = express.Router();
const notificationController = container.resolve(NotificationController);

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get Notifications
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     description: Retrieve a list of notifications for the current user
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/', notificationController.getNotifications.bind(notificationController));
/**
 * @swagger
 * /api/v1/notifications/{notificationId}:
 *   patch:
 *     summary: Update a notification
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     description: Updates a notifications for the given id
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               read:
 *                 type: integer
 *                 description: Indicates whether the notification has been read (0 for unread, 1 for read)
 *     responses:
 *       200:
 *         description: A object of notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       404:
 *          description: Notification not found
 */
router.patch('/:notificationId',validateUpdateNotificationData, notificationController.updateNotification.bind(notificationController));
/**
 * @swagger
 * /api/v1/notifications/{notificationId}:
 *   get:
 *     summary: Get a notification by Id
 *     security:
 *       - bearerAuth: []
 *     tags: [Notifications]
 *     description: Get a notifications for the given id
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the notification
 *     responses:
 *       200:
 *         description: A object of notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       404:
 *          description: Notification not found
 */
router.get('/:notificationId', notificationController.getNotificationById.bind(notificationController));

export default router;

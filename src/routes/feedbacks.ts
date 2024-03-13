import express from 'express';
import { container } from 'tsyringe';
import { FeedbackController } from '../controllers/feedbacks';
import { checkFeedbackAuthorized } from '../middleware/authenticateToken';
import { validateCreateFeedbackData } from '../middleware/dataValidation';

const router = express.Router();
const feedbackController = container.resolve(FeedbackController);

/**
 * @swagger
 * /api/v1/feedbacks:
 *   post:
 *     summary: Create a new feedback
 *     security:
 *       - bearerAuth: []
 *     tags: [Feedbacks]
 *     description: Endpoint to create a new feedback.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/createFeedbackRequest'
 *     responses:
 *       200:
 *         description: A object of feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Bad request
 */
router.post('/',validateCreateFeedbackData, checkFeedbackAuthorized, feedbackController.createFeedback.bind(feedbackController));
/**
 * @swagger
 * /api/v1/feedbacks:
 *   get:
 *     summary: Get all feedbacks
 *     security:
 *       - bearerAuth: []
 *     tags: [Feedbacks]
 *     description: Retrieve a list of all feedbacks.
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Feedback filter for events.
 *     responses:
 *       200:
 *         description: A list of feedbacks
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
 *                     $ref: '#/components/schemas/Feedback'
 */
router.get('/', feedbackController.getFeedbacks.bind(feedbackController));
/**
 * @swagger
 * /api/v1/feedbacks/{feedbackId}:
 *   get:
 *     summary: Get an feedback by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Feedbacks]
 *     description: Retrieve an feedback by its ID
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         schema:
 *           type: string
 *         description: Numeric ID of the feedback to retrieve
 *     responses:
 *       200:
 *         description: A object of feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 */
router.get('/:feedbackId', feedbackController.getFeedbackById.bind(feedbackController));

export default router;

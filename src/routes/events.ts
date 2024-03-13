import express from 'express';
import { EventController } from '../controllers/events';
import { checkEventOrganizer } from '../middleware/authenticateToken';
import { container } from 'tsyringe';
import { validateEventData, validateEventUpdateData } from '../middleware/dataValidation';

const router = express.Router();
const eventController = container.resolve(EventController);

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     description: Endpoint to create a new event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/createEventRequest'
 *     responses:
 *       200:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 */
router.post('/',validateEventData, eventController.createEvent.bind(eventController));
/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     description: Retrieve a list of all events.
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title filter for events.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter for events in ISO 8601 format.
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/eventResponse'
 */
router.get('/', eventController.getEvents.bind(eventController));
/**
 * @swagger
 * /api/v1/events/{eventId}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     description: Retrieve an event by its ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the event to retrieve
 *     responses:
 *       200:
 *         description: A single event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get('/:eventId', eventController.getEventById.bind(eventController));
/**
 * @swagger
 * /api/v1/events/{eventId}:
 *   patch:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     description: Update an event's information by its ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateEventRequest'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */

router.patch('/:eventId',validateEventUpdateData,checkEventOrganizer, eventController.updateEvent.bind(eventController));
/**
 * @swagger
 * /api/v1/events/{eventId}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     description: Delete an event by its ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/successResponse'
 *       404:
 *         description: Event not found
 */

router.delete('/:eventId',checkEventOrganizer, eventController.deleteEvent.bind(eventController));

export default router;

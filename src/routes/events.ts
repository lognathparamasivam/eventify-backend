import express from 'express';
import { EventController } from '../controllers/events';
import { checkEventOrganizer } from '../middleware/authenticateToken';
import { container } from 'tsyringe';
import { validateEventData, validateEventUpdateData } from '../middleware/dataValidation';

const router = express.Router();
const eventController = container.resolve(EventController);

router.post('/', validateEventData, eventController.createEvent.bind(eventController));
router.get('/',eventController.getEvents.bind(eventController));
router.get('/:eventId', eventController.getEventById.bind(eventController));
router.patch('/:eventId',validateEventUpdateData,checkEventOrganizer, eventController.updateEvent.bind(eventController));
router.delete('/:eventId',checkEventOrganizer, eventController.deleteEvent.bind(eventController));

export default router;

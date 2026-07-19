import { Router } from 'express';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventById
} from '../controllers/eventController';
import { protect, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createEventSchema, updateEventSchema } from '../validations/event.schema';

const router = Router();

router.route('/')
  .post(protect, authorize('Organizer'), validate(createEventSchema), createEvent)
  .get(getEvents);

router.route('/:id')
  .get(getEventById)
  .put(protect, authorize('Organizer'), validate(updateEventSchema), updateEvent)
  .delete(protect, authorize('Organizer'), deleteEvent);

export default router;

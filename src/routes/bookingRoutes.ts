import { Router } from 'express';
import {
  bookTickets,
  getMyBookings,
  getEventBookings
} from '../controllers/bookingController';
import { protect, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../validations/booking.schema';

const router = Router();

// Customers can book tickets and view their own bookings
router.route('/')
  .post(protect, authorize('Customer'), validate(createBookingSchema), bookTickets)
  .get(protect, authorize('Customer'), getMyBookings);

// Organizers can view bookings for their specific events (the controller verifies ownership)
router.route('/event/:id')
  .get(protect, authorize('Organizer'), getEventBookings);

export default router;

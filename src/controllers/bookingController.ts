import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Event from '../models/Event';
import Booking from '../models/Booking';
import Customer from '../models/Customer';
import { sendSuccess, sendError } from '../utils/responseHandler';
import jobQueue from '../events/eventEmitter';

export const bookTickets = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, ticketsCount } = req.body;
    
    // Concurrency control: Atomic findOneAndUpdate with condition availableTickets >= ticketsCount
    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gte: ticketsCount } },
      { $inc: { availableTickets: -ticketsCount } },
      { new: true }
    );

    if (!event) {
      return sendError(res, 400, 'Not enough available tickets or event not found');
    }

    const booking = await Booking.create({
      customerId: req.user!.id,
      eventId,
      ticketsCount,
    });

    const customer = await Customer.findById(req.user!.id);

    // Trigger background task for booking confirmation email
    if (customer) {
      jobQueue.emit('booking_confirmed', {
        customerEmail: customer.email,
        eventTitle: event.title,
        tickets: ticketsCount,
      });
    }

    sendSuccess(res, 201, 'Booking successful', booking);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customerId: req.user!.id }).populate('eventId');
    sendSuccess(res, 200, 'My bookings fetched', bookings);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const getEventBookings = async (req: AuthRequest, res: Response) => {
  try {
    // Check if the current user is the organizer of the event
    const event = await Event.findOne({ _id: req.params.id, organizerId: req.user!.id });
    if (!event) return sendError(res, 403, 'Unauthorized to view bookings for this event');

    const bookings = await Booking.find({ eventId: req.params.id }).populate('customerId', 'name email');
    sendSuccess(res, 200, 'Event bookings fetched', bookings);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

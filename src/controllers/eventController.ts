import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Event from '../models/Event';
import Booking from '../models/Booking';
import { sendSuccess, sendError } from '../utils/responseHandler';
import jobQueue from '../events/eventEmitter';
import NodeCache from 'node-cache';
import Customer from '../models/Customer';

const cache = new NodeCache({ stdTTL: 300 }); // 5 min TTL

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.create({ ...req.body, organizerId: req.user!.id });
    cache.del('events_list'); // invalidate cache
    sendSuccess(res, 201, 'Event created', event);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizerId: req.user!.id },
      req.body,
      { new: true }
    );
    if (!event) return sendError(res, 404, 'Event not found or unauthorized');

    cache.del('events_list');

    // Trigger background task to notify customers
    const bookings = await Booking.find({ eventId: event.id }).populate('customerId');
    const emails = bookings.map(b => (b.customerId as any).email);
    if (emails.length > 0) {
      jobQueue.emit('event_updated', { eventTitle: event.title, customerEmails: emails });
    }

    sendSuccess(res, 200, 'Event updated', event);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, organizerId: req.user!.id });
    if (!event) return sendError(res, 404, 'Event not found or unauthorized');

    cache.del('events_list');
    sendSuccess(res, 200, 'Event deleted');
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `events_list_${page}_${limit}`;
    const cachedEvents = cache.get(cacheKey);
    if (cachedEvents) {
      return sendSuccess(res, 200, 'Events fetched from cache', cachedEvents);
    }

    const events = await Event.find().skip(skip).limit(limit).lean();
    const total = await Event.countDocuments();

    const data = {
      events,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    };
    
    cache.set(cacheKey, data);
    sendSuccess(res, 200, 'Events fetched', data);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return sendError(res, 404, 'Event not found');
    sendSuccess(res, 200, 'Event fetched', event);
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

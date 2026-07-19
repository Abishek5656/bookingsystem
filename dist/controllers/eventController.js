"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventById = exports.getEvents = exports.deleteEvent = exports.updateEvent = exports.createEvent = void 0;
const Event_1 = __importDefault(require("../models/Event"));
const Booking_1 = __importDefault(require("../models/Booking"));
const responseHandler_1 = require("../utils/responseHandler");
const eventEmitter_1 = __importDefault(require("../events/eventEmitter"));
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 300 }); // 5 min TTL
const createEvent = async (req, res) => {
    try {
        const event = await Event_1.default.create({ ...req.body, organizerId: req.user.id });
        cache.del('events_list'); // invalidate cache
        (0, responseHandler_1.sendSuccess)(res, 201, 'Event created', event);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const event = await Event_1.default.findOneAndUpdate({ _id: req.params.id, organizerId: req.user.id }, req.body, { new: true });
        if (!event)
            return (0, responseHandler_1.sendError)(res, 404, 'Event not found or unauthorized');
        cache.del('events_list');
        // Trigger background task to notify customers
        const bookings = await Booking_1.default.find({ eventId: event.id }).populate('customerId');
        const emails = bookings.map(b => b.customerId.email);
        if (emails.length > 0) {
            eventEmitter_1.default.emit('event_updated', { eventTitle: event.title, customerEmails: emails });
        }
        (0, responseHandler_1.sendSuccess)(res, 200, 'Event updated', event);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const event = await Event_1.default.findOneAndDelete({ _id: req.params.id, organizerId: req.user.id });
        if (!event)
            return (0, responseHandler_1.sendError)(res, 404, 'Event not found or unauthorized');
        cache.del('events_list');
        (0, responseHandler_1.sendSuccess)(res, 200, 'Event deleted');
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.deleteEvent = deleteEvent;
const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const cacheKey = `events_list_${page}_${limit}`;
        const cachedEvents = cache.get(cacheKey);
        if (cachedEvents) {
            return (0, responseHandler_1.sendSuccess)(res, 200, 'Events fetched from cache', cachedEvents);
        }
        const events = await Event_1.default.find().skip(skip).limit(limit).lean();
        const total = await Event_1.default.countDocuments();
        const data = {
            events,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            }
        };
        cache.set(cacheKey, data);
        (0, responseHandler_1.sendSuccess)(res, 200, 'Events fetched', data);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const event = await Event_1.default.findById(req.params.id).lean();
        if (!event)
            return (0, responseHandler_1.sendError)(res, 404, 'Event not found');
        (0, responseHandler_1.sendSuccess)(res, 200, 'Event fetched', event);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.getEventById = getEventById;

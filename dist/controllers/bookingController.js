"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventBookings = exports.getMyBookings = exports.bookTickets = void 0;
const Event_1 = __importDefault(require("../models/Event"));
const Booking_1 = __importDefault(require("../models/Booking"));
const Customer_1 = __importDefault(require("../models/Customer"));
const responseHandler_1 = require("../utils/responseHandler");
const eventEmitter_1 = __importDefault(require("../events/eventEmitter"));
const bookTickets = async (req, res) => {
    try {
        const { eventId, ticketsCount } = req.body;
        // Concurrency control: Atomic findOneAndUpdate with condition availableTickets >= ticketsCount
        const event = await Event_1.default.findOneAndUpdate({ _id: eventId, availableTickets: { $gte: ticketsCount } }, { $inc: { availableTickets: -ticketsCount } }, { new: true });
        if (!event) {
            return (0, responseHandler_1.sendError)(res, 400, 'Not enough available tickets or event not found');
        }
        const booking = await Booking_1.default.create({
            customerId: req.user.id,
            eventId,
            ticketsCount,
        });
        const customer = await Customer_1.default.findById(req.user.id);
        // Trigger background task for booking confirmation email
        if (customer) {
            eventEmitter_1.default.emit('booking_confirmed', {
                customerEmail: customer.email,
                eventTitle: event.title,
                tickets: ticketsCount,
            });
        }
        (0, responseHandler_1.sendSuccess)(res, 201, 'Booking successful', booking);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.bookTickets = bookTickets;
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.default.find({ customerId: req.user.id }).populate('eventId');
        (0, responseHandler_1.sendSuccess)(res, 200, 'My bookings fetched', bookings);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.getMyBookings = getMyBookings;
const getEventBookings = async (req, res) => {
    try {
        // Check if the current user is the organizer of the event
        const event = await Event_1.default.findOne({ _id: req.params.id, organizerId: req.user.id });
        if (!event)
            return (0, responseHandler_1.sendError)(res, 403, 'Unauthorized to view bookings for this event');
        const bookings = await Booking_1.default.find({ eventId: req.params.id }).populate('customerId', 'name email');
        (0, responseHandler_1.sendSuccess)(res, 200, 'Event bookings fetched', bookings);
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.getEventBookings = getEventBookings;

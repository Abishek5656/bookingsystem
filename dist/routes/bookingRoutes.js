"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const booking_schema_1 = require("../validations/booking.schema");
const router = (0, express_1.Router)();
// Customers can book tickets and view their own bookings
router.route('/')
    .post(auth_1.protect, (0, auth_1.authorize)('Customer'), (0, validate_1.validate)(booking_schema_1.createBookingSchema), bookingController_1.bookTickets)
    .get(auth_1.protect, (0, auth_1.authorize)('Customer'), bookingController_1.getMyBookings);
// Organizers can view bookings for their specific events (the controller verifies ownership)
router.route('/event/:id')
    .get(auth_1.protect, (0, auth_1.authorize)('Organizer'), bookingController_1.getEventBookings);
exports.default = router;

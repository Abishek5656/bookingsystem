"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const event_schema_1 = require("../validations/event.schema");
const router = (0, express_1.Router)();
router.route('/')
    .post(auth_1.protect, (0, auth_1.authorize)('Organizer'), (0, validate_1.validate)(event_schema_1.createEventSchema), eventController_1.createEvent)
    .get(eventController_1.getEvents);
router.route('/:id')
    .get(eventController_1.getEventById)
    .put(auth_1.protect, (0, auth_1.authorize)('Organizer'), (0, validate_1.validate)(event_schema_1.updateEventSchema), eventController_1.updateEvent)
    .delete(auth_1.protect, (0, auth_1.authorize)('Organizer'), eventController_1.deleteEvent);
exports.default = router;

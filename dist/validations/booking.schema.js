"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        eventId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID'),
        ticketsCount: zod_1.z.number().int().positive('Tickets count must be a positive integer'),
    }),
});

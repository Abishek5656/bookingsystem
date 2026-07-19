"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
        location: zod_1.z.string().min(3, 'Location must be at least 3 characters'),
        totalTickets: zod_1.z.number().int().positive('Total tickets must be a positive integer'),
    }),
});
exports.updateEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().min(10).optional(),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }).optional(),
        location: zod_1.z.string().min(3).optional(),
        totalTickets: zod_1.z.number().int().positive().optional(),
        availableTickets: zod_1.z.number().int().min(0).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID'),
    }),
});

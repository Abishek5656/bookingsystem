import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID'),
    ticketsCount: z.number().int().positive('Tickets count must be a positive integer'),
  }),
});

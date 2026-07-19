import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  ticketsCount: number;
  status: 'Confirmed' | 'Cancelled';
  bookingDate: Date;
}

const BookingSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketsCount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  bookingDate: { type: Date, default: Date.now },
});

export default mongoose.model<IBooking>('Booking', BookingSchema);

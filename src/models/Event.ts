import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  totalTickets: number;
  availableTickets: number;
  organizerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', EventSchema);

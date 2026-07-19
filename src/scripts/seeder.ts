import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Organizer from '../models/Organizer';
import Customer from '../models/Customer';
import Event from '../models/Event';
import Booking from '../models/Booking';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected for Seeding');

    await Organizer.deleteMany();
    await Customer.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const organizer = await Organizer.create({
      name: 'Event Organizer Inc.',
      email: 'organizer@test.com',
      password: hashedPassword,
    });

    const customer1 = await Customer.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: hashedPassword,
    });

    const customer2 = await Customer.create({
      name: 'Jane Smith',
      email: 'jane@test.com',
      password: hashedPassword,
    });

    await Event.create([
      {
        title: 'Tech Conference 2026',
        description: 'A major tech conference about AI and Web3.',
        date: new Date('2026-10-15'),
        location: 'San Francisco, CA',
        totalTickets: 500,
        availableTickets: 500,
        organizerId: organizer._id,
      },
      {
        title: 'Music Festival',
        description: 'Annual music festival with live bands.',
        date: new Date('2026-08-20'),
        location: 'Austin, TX',
        totalTickets: 200,
        availableTickets: 200,
        organizerId: organizer._id,
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with seeder:', error);
    process.exit(1);
  }
};

seedData();

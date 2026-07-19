"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Organizer_1 = __importDefault(require("../models/Organizer"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Event_1 = __importDefault(require("../models/Event"));
const Booking_1 = __importDefault(require("../models/Booking"));
dotenv_1.default.config();
const seedData = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');
        await Organizer_1.default.deleteMany();
        await Customer_1.default.deleteMany();
        await Event_1.default.deleteMany();
        await Booking_1.default.deleteMany();
        const hashedPassword = await bcryptjs_1.default.hash('password123', 10);
        const organizer = await Organizer_1.default.create({
            name: 'Event Organizer Inc.',
            email: 'organizer@test.com',
            password: hashedPassword,
        });
        const customer1 = await Customer_1.default.create({
            name: 'John Doe',
            email: 'john@test.com',
            password: hashedPassword,
        });
        const customer2 = await Customer_1.default.create({
            name: 'Jane Smith',
            email: 'jane@test.com',
            password: hashedPassword,
        });
        await Event_1.default.create([
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
    }
    catch (error) {
        console.error('Error with seeder:', error);
        process.exit(1);
    }
};
seedData();

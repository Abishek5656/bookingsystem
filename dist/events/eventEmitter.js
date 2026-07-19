"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class JobQueue extends events_1.EventEmitter {
}
const jobQueue = new JobQueue();
// Background Task 1: Booking Confirmation
jobQueue.on('booking_confirmed', (data) => {
    // Simulates sending an email
    setTimeout(() => {
        console.log(`\n[BACKGROUND TASK] 📧 Email sent to ${data.customerEmail}: Booking confirmed for ${data.tickets} tickets to "${data.eventTitle}".\n`);
    }, 1000); // Simulated delay
});
// Background Task 2: Event Update Notification
jobQueue.on('event_updated', (data) => {
    // Simulates sending a notification to all booked customers
    setTimeout(() => {
        console.log(`\n[BACKGROUND TASK] 🔔 Notification sent to ${data.customerEmails.length} customers regarding updates to event "${data.eventTitle}".\n`);
    }, 1000); // Simulated delay
});
exports.default = jobQueue;

import { EventEmitter } from 'events';

class JobQueue extends EventEmitter {}
const jobQueue = new JobQueue();

// Background Task 1: Booking Confirmation
jobQueue.on('booking_confirmed', (data: { customerEmail: string; eventTitle: string; tickets: number }) => {
  // Simulates sending an email
  setTimeout(() => {
    console.log(`\n[BACKGROUND TASK] 📧 Email sent to ${data.customerEmail}: Booking confirmed for ${data.tickets} tickets to "${data.eventTitle}".\n`);
  }, 1000); // Simulated delay
});

// Background Task 2: Event Update Notification
jobQueue.on('event_updated', (data: { eventTitle: string; customerEmails: string[] }) => {
  // Simulates sending a notification to all booked customers
  setTimeout(() => {
    console.log(`\n[BACKGROUND TASK] 🔔 Notification sent to ${data.customerEmails.length} customers regarding updates to event "${data.eventTitle}".\n`);
  }, 1000); // Simulated delay
});

export default jobQueue;

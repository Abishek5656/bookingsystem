# Event Booking System - Backend API

A robust, scalable backend API for an Event Booking System built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**. 

This system allows Event Organizers to create and manage events while Customers can browse events and book tickets. The application includes advanced features like concurrent booking handling (optimistic locking), caching, background tasks, role-based access control, and robust input validation.

## Features

- **Role-Based Access Control (RBAC):** Distinct roles for `Organizer` and `Customer`. Organizers can manage events; Customers can book tickets.
- **Concurrency Control:** Utilizes MongoDB atomic operations (`findOneAndUpdate` with `$inc`) to prevent race conditions and double-booking when multiple users try to book tickets simultaneously.
- **Background Tasks:** Uses Node's built-in `EventEmitter` to simulate asynchronous job processing for:
  - Sending a confirmation email to a customer after a successful booking.
  - Sending notifications to all booked customers when an organizer updates an event.
- **Caching:** Integrates `node-cache` to cache the `GET /events` endpoint, drastically improving read performance and reducing database load.
- **Validation:** Implements **Zod** schema validation middleware for all incoming API payloads (body, query, params) to ensure data integrity.
- **Security:** Standard security practices applied using `helmet` for HTTP headers, `cors` for cross-origin resource sharing, and `express-rate-limit` for DDoS protection.
- **Pagination:** Handles large datasets efficiently using standard `page` and `limit` queries on the events listing.
- **Centralized Response Formatting:** Ensures a consistent API response structure for both successes and errors.

## Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose ODM)
- **Validation:** Zod
- **Caching:** Node-Cache
- **Security/Auth:** bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit
- **Testing Tools:** Jest, Supertest (configured)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud URI)

## Getting Started

### 1. Clone & Install
```bash
# Install dependencies
yarn install
```

### 2. Configure Environment Variables
Ensure you have a `.env` file in the root directory. You can use the provided `.env.example` as a template:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event_booking
JWT_SECRET=supersecretkey_change_me_in_production
```

### 3. Seed the Database (Optional but recommended)
Run the seeder script to populate your local database with dummy Customers, Organizers, and Events.
```bash
yarn seed
```

### 4. Run the Development Server
```bash
yarn dev
```
The server will start on `http://localhost:5000` (or whatever `PORT` you specified).

## API Endpoints Overview

For a detailed view and easy testing, import the `postman_collection.json` file included in this repository into Postman.

### Authentication
- `POST /api/auth/organizer/register` - Register a new Organizer
- `POST /api/auth/organizer/login` - Login Organizer
- `POST /api/auth/customer/register` - Register a new Customer
- `POST /api/auth/customer/login` - Login Customer

### Events
- `POST /api/events` - Create an event (Requires Organizer token)
- `GET /api/events` - List upcoming events (Public, Cached, Paginated)
- `GET /api/events/:id` - Get single event details (Public)
- `PUT /api/events/:id` - Update event (Requires Organizer token, triggers notification)
- `DELETE /api/events/:id` - Delete event (Requires Organizer token)

### Bookings
- `POST /api/bookings` - Book tickets (Requires Customer token, atomic DB update, triggers email)
- `GET /api/bookings` - Get my bookings (Requires Customer token)
- `GET /api/bookings/event/:id` - View bookings for a specific event (Requires Organizer token)

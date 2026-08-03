# FixItNow - Home Service Booking Platform

FixItNow is a premium, full-stack home service booking platform featuring a comprehensive 11-step state machine lifecycle, role-based dashboards, and secure payment integrations.

## Features

- **Role-Based Access Control:** Distinct views and permissions for Customers, Technicians, and Admins.
- **Strict Booking Lifecycle:** An 11-stage state machine (`requested` -> `assigned` -> `in_progress` -> `work_completed` -> `paid`) ensuring no step is skipped.
- **Secure Authentication:** JWT-based authentication via Zustand and cookies. Middleware-protected routes.
- **Premium UI/UX:** Built with Tailwind CSS, featuring glassmorphism, responsive data tables, skeleton loaders, and dynamic status badges.
- **Stripe Payments:** Integrated Stripe Checkout for secure end-to-end payments.
- **Admin Dashboard:** Full CRUD management for Users, Categories, Services, Bookings, and Reviews.

## Admin Credentials
To evaluate the platform, use the following credentials to access the Admin Dashboard:
- **Email:** `admin@fixitnow.com`
- **Password:** `Admin123!`

## Environment Setup

To run this frontend locally, create a `.env.local` file in the root directory:

```env
# Backend API URL (Replace with your actual backend URL)
NEXT_PUBLIC_API_URL=https://fixitnow-pi-rouge.vercel.app/api

# Stripe Keys (Required for the payment flow)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Running the Project

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
npm start
```

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with custom utility animations)
- **State Management:** Zustand
- **Icons:** React Icons (Lucide/Feather)
- **Payments:** Stripe.js

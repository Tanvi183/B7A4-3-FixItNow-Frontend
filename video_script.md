# FixItNow - Frontend Walkthrough Video Script

**Target Duration:** 7 - 10 Minutes  
**Language:** English  
**Pacing:** Steady, conversational but professional. Speak clearly and demonstrate actions on screen as you talk.

---

## 1. Introduction & Architecture (0:00 - 1:30)

**(Screen: Start on the homepage of FixItNow. Smoothly scroll through the public landing page.)**

**Speaker:** 
"Hello everyone, welcome to the frontend walkthrough of **FixItNow**, a premium, full-stack home service booking platform. 

Today, I’ll be taking you through the user interface, the architecture behind it, and demonstrating the core features of the platform.

From an architectural standpoint, the frontend is built using **Next.js 14 with the App Router**. We chose the App Router to leverage React Server Components for faster initial page loads and better SEO on our public pages, while isolating client-side interactivity using the `"use client"` directive where necessary. 

**(Screen: Open your code editor briefly, show the `app/` folder structure, pointing out `(public)`, `(auth)`, and `dashboard` route groups.)**

"As you can see in the folder structure, we’ve cleanly organized our routes using route groups. We have a `(public)` group for our landing pages, an `(auth)` group for login and registration, and a protected `dashboard` directory. State management is handled globally using **Zustand**, and our UI is styled from the ground up using **Tailwind CSS** with a custom design system."

---

## 2. Role-Based Dashboards & UI Adaptation (1:30 - 4:00)

**(Screen: Go to the Login page. Log in using a CUSTOMER account.)**

**Speaker:**
"A core feature of FixItNow is strict role-based access control. We have three distinct roles: Customer, Technician, and Admin. Let’s start by logging in as a **Customer**.

**(Screen: Show the Customer Dashboard. Point out the navigation sidebar.)**

"Notice how the UI adapts immediately. The sidebar specifically renders customer-centric options like 'My Bookings', 'Find Services', and 'My Reviews'. Customers can browse services and manage their own requested jobs."

**(Screen: Log out. Log in using a TECHNICIAN account.)**

"Now, if we log out and log back in as a **Technician**... You'll see the dashboard dynamically changes. The navigation now offers 'Job Requests', 'My Skills', and 'Profile Setup'. The technician can only see bookings assigned specifically to them, ensuring data privacy and a focused workflow."

**(Screen: Log out. Log in using the ADMIN account (`admin@fixitnow.com`).)**

"Finally, let’s log in as the **Admin**. The UI expands to show the full suite of management tools. The Admin has a comprehensive birds-eye view of the entire platform, including user management, category management, and overall booking moderation."

---

## 3. CRUD Operations via UI (4:00 - 5:30)

**(Screen: While logged in as Admin, navigate to the 'Categories' or 'Services' management page.)**

**Speaker:**
"While logged in as an Admin, let's look at how we handle full CRUD operations—Create, Read, Update, and Delete. 

**(Screen: Click 'Add New Service', fill out the form, and submit.)**

"Here, we can **Create** a new service. I'll enter the service name, description, and base price. Upon submission, the table instantly updates to **Read** and display the new data.

**(Screen: Click 'Edit' on a service, change the price, and save.)**

"If a price changes, I can easily **Update** it by clicking edit, modifying the value, and saving."

**(Screen: Click 'Delete' on a dummy service.)**

"And if a service is no longer offered, I can **Delete** it directly from this interface. The UI immediately reflects these changes."

---

## 4. Validation & Error Handling (5:30 - 6:30)

**(Screen: Go to a form, like the 'Add Service' form or a Booking form. Leave a required field blank and hit submit.)**

**Speaker:**
"To ensure data integrity, we've implemented strict validation and consistent error handling. 

"If I try to submit this form without filling in mandatory fields, you'll see inline validation errors pop up immediately. This is powered by **Zod** schema validation combined with **React Hook Form**.

**(Screen: Trigger a network error. E.g., try to delete something you shouldn't, or momentarily turn off the backend to show a fetch failure.)**

"For API and network errors, we use structured UI feedback. If a server request fails, instead of the app crashing, the user receives a clean, friendly toast notification—powered by `react-hot-toast`—explaining exactly what went wrong. We also utilize Next.js Error Boundaries and custom 404 pages to catch any unexpected crashes gracefully."

---

## 5. Payment Integration Flow (6:30 - 8:30)

**(Screen: Log back in as a Customer. Navigate to a completed booking that requires payment.)**

**Speaker:**
"Next, let’s walk through the Payment Integration flow. Once a technician marks a job as 'completed', the customer is prompted to pay. 

**(Screen: Click the 'Pay Now' button on a booking. Transition to the Stripe Checkout page.)**

"When I click 'Pay Now', the frontend initiates a secure checkout session and redirects the user to the **Stripe Checkout** portal. We chose Stripe for its robust security and seamless user experience. 

**(Screen: Enter test card details (e.g., 4242 4242...) and complete the payment.)**

"I'll enter some test card credentials here and confirm the payment.

**(Screen: Show the automatic redirect to the `/payment/success` page, and then back to the dashboard showing the status as PAID.)**

"Upon success, Stripe redirects the user back to our custom Success page. The frontend instantly fires a PATCH request to our backend to securely update the booking status. As you can see on the dashboard, the booking status has dynamically updated to 'PAID'."

---

## 6. Technical Challenge: Next.js Middleware Auth (8:30 - 9:30)

**(Screen: Briefly show the `middleware.ts` file in the code editor.)**

**Speaker:**
"Before we wrap up, I want to briefly discuss a significant technical challenge we solved: **Server-Side Route Protection**. 

"While client-side protection is good, it can cause a flicker where unauthorized UI briefly flashes before a redirect. To solve this, we implemented a Next.js **Middleware** file at the root of the project. 

"The challenge here was that the Edge runtime doesn't support standard Node.js libraries like `jsonwebtoken`. To overcome this, I wrote a custom JWT decoder using the native Web API `atob` function. Now, the middleware intercepts requests at the edge, parses the JWT from the HTTP cookies, extracts the user role, and strictly redirects unauthorized users *before* the page even begins to render. This ensures absolute security and a perfectly smooth user experience."

---

## 7. Conclusion (9:30 - 10:00)

**(Screen: Return to the landing page or a visually appealing dashboard view.)**

**Speaker:**
"And that concludes the frontend walkthrough of FixItNow. Through strict state management, Next.js App Router optimizations, robust error handling, and a seamless Stripe payment flow, we’ve built a highly secure and premium platform for home services. 

"Thank you for watching!"

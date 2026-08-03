# API Integration Mapping

This document maps the frontend pages and components to the backend API endpoints they consume, fulfilling the "API Integration & Documentation" requirement.

## 1. Authentication & Users
| Frontend Route | Action | Backend Endpoint | Method | Payload / Notes |
|---|---|---|---|---|
| `/login` | User Login | `/api/auth/login` | `POST` | `{ email, password }` |
| `/register` | User Registration | `/api/auth/register` | `POST` | `{ name, email, password, role }` |
| `useAuthStore.ts` | Verify Session | `/api/users/me` | `GET` | Uses JWT from `accessToken` cookie |
| `/dashboard/admin/users` | List All Users | `/api/users` | `GET` | Admin only |
| `/dashboard/admin/users` | Ban / Unban | `/api/users/:id/status` | `PATCH` | `{ status: "ACTIVE" \| "BANNED" }` |
| `/dashboard/customer` | Apply as Tech | `/api/users/apply-technician`| `PATCH` | `{ bio, skills, experienceYears, pricingRate }` |
| `/dashboard/technician/profile` | Update Profile | `/api/technicians/me` | `PATCH` | `{ bio, skills, experienceYears, pricingRate }` |

## 2. Categories & Services
| Frontend Route | Action | Backend Endpoint | Method | Payload / Notes |
|---|---|---|---|---|
| `/services` | List Categories | `/api/categories` | `GET` | Public |
| `/services` | List Services | `/api/services` | `GET` | Public |
| `/dashboard/admin/categories` | Create Category | `/api/categories` | `POST` | `{ name, description }` |
| `/dashboard/admin/categories` | Edit Category | `/api/categories/:id` | `PUT` | `{ name, description }` |
| `/dashboard/admin/categories` | Delete Category | `/api/categories/:id` | `DELETE` | Admin only |
| `/dashboard/admin/services` | Create Service | `/api/services` | `POST` | `{ name, description, basePrice, categoryId }` |
| `/dashboard/admin/services` | Edit Service | `/api/services/:id` | `PUT` | `{ name, description, basePrice, categoryId }` |
| `/dashboard/admin/services` | Delete Service | `/api/services/:id` | `DELETE` | Admin only |

## 3. Booking Lifecycle
| Frontend Route | Action | Backend Endpoint | Method | Payload / Notes |
|---|---|---|---|---|
| `components/ServiceCard` | Create Booking | `/api/bookings` | `POST` | `{ serviceId, date, time }` |
| `/dashboard/customer` | Customer Bookings | `/api/bookings/my-bookings` | `GET` | Customer view |
| `/dashboard/technician` | Tech Bookings | `/api/bookings/my-bookings` | `GET` | Technician view (filtered by JWT) |
| `/dashboard/admin/bookings` | Admin Bookings | `/api/bookings` | `GET` | Admin view (all) |
| `/dashboard/admin/bookings` | Assign/Reject | `/api/bookings/:id/admin-review`| `PATCH` | `{ action: "approve" \| "reject", technicianId? }` |
| `/dashboard/technician` | Accept/Decline | `/api/bookings/:id/technician-response`| `PATCH` | `{ action: "accept" \| "decline" }` |
| `/dashboard/technician` | Start Job | `/api/bookings/:id/start` | `PATCH` | Technician marks `in_progress` |
| `/dashboard/technician` | Mark Done | `/api/bookings/:id/complete`| `PATCH` | Technician marks `work_completed` |
| `/dashboard/customer` | Approve/Dispute | `/api/bookings/:id/customer-confirm`| `PATCH` | `{ action: "approve" \| "dispute" }` |
| `/dashboard/admin/bookings` | Resolve Dispute | `/api/bookings/:id/admin-review`| `PATCH` | `{ action: "resolve" }` |

## 4. Payments (Stripe)
| Frontend Route | Action | Backend Endpoint | Method | Payload / Notes |
|---|---|---|---|---|
| `/dashboard/customer` (Pay Now) | Create Session | `/api/checkout_sessions` | `POST` | (Next.js route proxying to Stripe API) |
| `/payment/success` | Update to Paid | `/api/bookings/:id` | `PATCH` | `{ status: "PAID" }` (Fallback for webhooks) |

## 5. Reviews
| Frontend Route | Action | Backend Endpoint | Method | Payload / Notes |
|---|---|---|---|---|
| `/dashboard/customer/reviews/new` | Create Review | `/api/reviews` | `POST` | `{ bookingId, rating, comment }` |
| `/dashboard/admin/reviews` | List Reviews | `/api/reviews` | `GET` | Admin moderation view |
| `/dashboard/admin/reviews` | Delete Review | `/api/reviews/:id` | `DELETE` | Admin only |

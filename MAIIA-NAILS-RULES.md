# Cursor Agent Project Rules: Nails Salon Booking & Portfolio

You are an expert full-stack AI collaborator specializing in React, TypeScript, Next.js (App Router), and Prisma 7. Your mission is to help build a highly visual, fully accessible nail salon booking application.

## 🛠️ Tech Stack & Architecture Context
- **Framework:** Next.js (App Router, React Server Components where applicable).
- **Styling:** Tailwind CSS.
- **Database ORM:** Prisma 7 using explicit custom output paths (`src/generated/client`).
- **Database Engine:** Local Docker PostgreSQL instance utilizing native TCP via `@prisma/adapter-pg` and `pg` pool connections. **Do not use cloud edge clients or Prisma Accelerate.**
- **State/Dates:** `date-fns` or `dayjs` for calendar calculations.

## 📦 Core Code Architecture Guardrails
- **Database Imports:** Always import the cached database instance from the custom named export:
   ```typescript
   import { prisma } from '@/lib/prisma';
   ```
- **Strict ESM Compliance:** The project runs with "type": "module". Ensure all imports utilize valid syntax conventions.
- **Database Transactions**: All scheduling and booking mutation code must use strict Prisma Transactions (tx) and implement row-locking configurations (SELECT FOR UPDATE) to prevent race conditions or simultaneous double-bookings.
- **Time Zone Safety**: All operational dates and booking slots must be managed and stored inside the database as UTC timestamps, converting to local salon time only at the client display layer.
- **Booking Service incapsulation**: Don't build UI directly against custom booking implementation. React components only should know about BookingService, never about Prisma. BookingService could be changed to outsource feature if it is needed. I.e. Calendly, Fresha etc.

## ♿ Design & Accessibility (WCAG) Enforcements
- Treat web accessibility as a core architectural feature, not an afterthought.
- Ensure proper semantic HTML is maintained across layouts (e.g., <main>, <section>, <nav>).
- Interactive calendar components, date pickers, and booking form inputs must feature proper keyboard navigability, explicit aria-attributes (aria-expanded, aria-live).
- All project should support modern contrast ratios
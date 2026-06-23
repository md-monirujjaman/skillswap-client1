# SkillSwap — Freelance Micro-Task Platform

## Purpose
SkillSwap is a marketplace website where clients can post small, simple tasks (like making a logo, writing an article, etc.), and freelancers can bid on these tasks by submitting proposals. It's a simplified version of Fiverr or Freelancer.com, enabling fast, one-time jobs securely backed by Stripe Checkout for payment flows and protected by JWT authentication.

## Live Website Link
The platform is fully deployed and accessible via the provided live preview URL.

## Key Features
- **Role-Based Workflows**: Segregated dashboards and logic for Clients, Freelancers, and Admins.
- **Task Management Engine**: Clients can create, edit, delete tasks; Freelancers browse, filter, and propose.
- **Better Authentication (JWT + OAuth)**: Secure HTTPOnly cookie-based login + Google OAuth support.
- **Stripe Checkout Integration**: Seamless transactions required before task commencement.
- **Server-Side Pagination & Filtering**: Backend-driven offsets, title search, category filtering parameters. 
- **Dynamic Home Page**: Real-time stats, animated transitions with Framer Motion, populated with the latest database records.
- **Responsive Layout**: Designed specifically to adapt perfectly across mobile, tablet, and desktop viewports.

## NPM Packages Used
- **Frontend**: `react`, `react-router-dom`, `tailwindcss`, `lucide-react`, `axios`, `motion`.
- **Backend / API**: `express`, `mongoose` (MongoDB).
- **Security & Utilities**: `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`, `dotenv`.
- **Others**: `stripe`, `vite`, `esbuild`, `typescript`.

---


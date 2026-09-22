# Vintage Vault Frontend

React + Vite storefront using Tailwind CSS v4 and the shared Express/MongoDB backend.

## Run

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
3. Start: `npm run dev`.

Frontend runs on `http://localhost:5173` by default.

## Connections

- API: `VITE_API_URL=http://localhost:5000/api`
- Admin panel: `VITE_ADMIN_URL=http://localhost:5174/admin`

The admin dashboard link opens the separate admin app instead of incorrectly routing to the storefront app.

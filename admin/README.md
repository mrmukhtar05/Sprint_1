# Vintage Vault Admin

React + Vite admin panel using Tailwind CSS v4 and the shared Express/MongoDB backend.

## Run

1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
3. Start: `npm run dev`.

Admin runs on `http://localhost:5174` by default.

## API connection

`VITE_API_URL=http://localhost:5000/api`

The Axios client automatically sends the JWT from `localStorage` as a Bearer token. Backend `/api/admin/*` routes verify the token and require the admin role.

## Admin login

Email: `admin@vintagevault.com`
Password: `admin123`

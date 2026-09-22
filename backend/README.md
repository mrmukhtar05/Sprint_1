# Vintage Vault Backend

Express + MongoDB API for the Vintage Vault store and admin panel.

## Run

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies: `npm install`.
4. Start: `npm run dev`.

The server listens on `http://localhost:5000` by default.

On startup, the database bootstrap creates missing demo admin/customer accounts, categories, and products. It is safe to run repeatedly because it uses upserts/checks.

## Admin

Email: `admin@vintagevault.com`
Password: `admin123`

## Main API groups

- `/api/auth`
- `/api/products`
- `/api/categories`
- `/api/cart`
- `/api/wishlist`
- `/api/orders`
- `/api/admin`
- `/api/health`

Admin routes require a valid Bearer JWT and `role: admin`.

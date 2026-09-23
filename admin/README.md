# Vintage Vault Admin

Run `npm install` then `npm run dev`.

Admin uses the backend API at `VITE_API_URL` (default `http://localhost:5000/api`).

Product/category images are uploaded through the backend to Cloudinary. The browser never receives or stores the Cloudinary API secret.

Product fields: gender, category, sizes, colors, price, discount, stock and Cloudinary images. The old condition/era fields are removed.

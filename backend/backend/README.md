# Vintage Vault Backend - Clothing + Cloudinary

## Run
1. Copy `.env.example` to `.env`.
2. Fill MongoDB and JWT values.
3. Fill Cloudinary values:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
4. Run `npm install`.
5. Run `npm run dev`.

The server bootstraps the admin, demo customer, clothing categories and sample clothing products automatically.

## Image flow
Admin uploads image -> authenticated backend -> Cloudinary -> secure URL -> MongoDB stores only the URL.

Supported uploads: JPG, PNG, WebP, SVG. Max 5 MB per image.

## Admin credentials
Email: admin@vintagevault.com
Password: admin123

## Performance
Product API defaults to 12 items per page, uses MongoDB indexes, lean/selective admin responses, and supports gender/size/color filters.

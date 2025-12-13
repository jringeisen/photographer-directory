# Photography Directory

An Inertia + Vue 3 directory for photographers. Visitors can search by location or photography type, browse portfolios, and contact photographers. Authenticated users manage their own listings, upload images, and curate portfolios with background image optimization.

- Laravel 12 (PHP 8.3), Inertia + Vue 3, Vite, Tailwind CSS 4
- Direct-to-S3 multipart uploads with presigned URLs and background image processing
- Database-backed sessions/queues; sitemap available at `/sitemap.xml`

## Quickstart

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install
npm run build
```

Then start everything in one go:

```bash
composer run dev
```

The app will be served at `http://directory.test` when running under Laravel Herd.

## Environment and storage

- Image uploads and seeds use the `s3` disk. Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, and `AWS_BUCKET`. A local S3-compatible service (e.g., MinIO) works fine—set `AWS_ENDPOINT` and `AWS_USE_PATH_STYLE_ENDPOINT=true` if needed.
- Queued image optimization runs via the database queue. Keep a worker running (`php artisan queue:listen --tries=1`) or rely on `composer run dev`, which starts one for you.
- Sessions and cache use the database drivers by default; migrations cover the required tables.

## Seeding sample data

Run seeds to create a demo user plus sample listings, photography types, and images:

```bash
php artisan migrate --seed
```

Seeds download placeholder images and write to the S3 bucket; ensure credentials and network access are available first.

## Frontend workflow

- `npm run dev` runs Vite in watch mode.
- `npm run build` builds production assets (required if you don’t see UI changes).

## Testing

Run the PHPUnit suite:

```bash
php artisan test
```

Use focused filters (e.g., `php artisan test --filter=ListingsTest`) to keep feedback fast.

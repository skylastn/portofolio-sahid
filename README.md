# Portfolio App

Full-stack personal portfolio application with a NestJS backend and a Next.js frontend.

The app powers a portfolio landing page, admin dashboard, portfolio projects, work history, achievements, technology stack, tools, and general profile content.

## Project Structure

```text
.
├── backend/   NestJS API, MySQL persistence, migrations, auth, MinIO uploads
└── frontend/  Next.js web app for public pages and admin UI
```

## Main Features

- Public portfolio landing page
- Portfolio detail pages with categories, frameworks, code languages, tools, gallery, and source links
- Work and achievement pages
- Admin dashboard and CRUD pages
- Profile/general content API
- Auth-protected admin writes
- MySQL migrations with TypeORM
- MinIO presigned upload support
- Position-based sorting for portfolio, work, achievement, frameworks, code languages, and tools

## Quick Start

Run the backend first:

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run start:dev
```

Run the frontend in another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3005`

Make sure `frontend/.env` points to the backend:

```env
NEXT_PUBLIC_ENDPOINT_URL=http://localhost:3005
```

## Useful Commands

Backend:

```bash
npm run build
npm test -- --runInBand
npm run migrate
npm run migrate:revert
```

Frontend:

```bash
npm run dev
npm run build
npx tsc --noEmit
```

## Documentation

Read the app-specific guides:

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

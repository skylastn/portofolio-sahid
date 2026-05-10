# Portfolio Backend

NestJS API for the portfolio application. It manages public portfolio data, admin content, authentication, MySQL persistence, migrations, and MinIO uploads.

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT auth
- MinIO presigned uploads
- Jest unit tests

## Setup

```bash
cp .env.example .env
npm install
```

Update `.env` for your local services:

```env
PORT=3005
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=db_portofolio
DATABASE_USER=root
DATABASE_PASSWORD=test

MINIO_ENDPOINT=127.0.0.1
MINIO_BUCKET=dev
MINIO_PORT=9000
MINIO_ACCESS_KEY=root
MINIO_SECRET_KEY=@Coba123

JWT_SECRET=localSecret
JWT_REFRESH_SECRET=localRefreshSecret
```

## Run Locally

```bash
npm run migrate
npm run seed
npm run start:dev
```

The API runs on the port from `.env`, usually:

```text
http://localhost:3005
```

## Main API Areas

Public reads are available for most portfolio resources. Create, update, and delete routes are protected with auth guards.

- `api/auth` authentication
- `api/general` profile/general home content
- `api/dashboard/summary` dashboard and home summary counts
- `api/portofolio` portfolio records
- `api/work` work history
- `api/achievement` achievements
- `api/category` portfolio categories
- `api/code_language` code languages
- `api/framework` frameworks
- `api/tool` project tools such as GitLab CI/CD, cPanel, aaPanel

## Portfolio Relations

A portfolio can include:

- Work relation
- App/source links
- Gallery images
- Categories
- Frameworks
- Tools

Frameworks can also map to multiple code languages, so the portfolio detail response can show the framework stack and the related languages.

## Sorting With Position

Several content types use a `position` field:

- Portfolio
- Work
- Achievement
- Code language
- Framework
- Tool

When an item is moved to an occupied position, the service shifts the affected items and saves the new order in one request transaction.

## Database

Run migrations:

```bash
npm run migrate
```

Revert the latest migration:

```bash
npm run migrate:revert
```

Generate a migration:

```bash
make migration name=your_migration_name
```

The migration source is configured in `src/system/data_source.ts` and `src/system/connection/db_configuration.ts`.

## Tests

Run unit tests:

```bash
npm test -- --runInBand
```

Run e2e tests:

```bash
npm run test:e2e
```

Current unit tests live in:

```text
test/unit
```

## Build

```bash
npm run build
npm run start:prod
```

## Docker

The backend includes `docker-compose.yaml`. The container command runs:

```bash
npm run migrate && npm run seed && npm run start:prod
```

For deployment helper:

```bash
make deploy
```

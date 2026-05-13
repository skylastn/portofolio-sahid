# Portfolio Backend

NestJS API for the portfolio application. This backend manages public portfolio data, admin content, JWT authentication, MySQL persistence, migrations/seeders, Redis-backed auth state and brute-force protection, and MinIO presigned uploads.

## Tech Stack

- NestJS 11
- TypeScript
- TypeORM
- MySQL
- Redis
- JWT access tokens and HttpOnly-cookie refresh tokens
- MinIO presigned upload/view URLs
- Jest
- Docker

## Main Features

- Public API for portfolio, work, achievement, category, framework, code language, tool, and general profile data.
- Admin API for creating, updating, and deleting content with a `Bearer` access token.
- Redis-backed login brute-force protection.
- Refresh token rotation. Active refresh tokens are stored in Redis, sent to the browser as an HttpOnly cookie, and old tokens are deleted when a refresh happens.
- MinIO presigned upload URLs so clients can upload files without exposing MinIO credentials.
- Position-based sorting for several resources.
- Database migrations and seeders.

## Requirements

- Node.js matching the project Docker image, currently `node:24-alpine`.
- MySQL.
- Redis.
- MinIO or another S3-compatible object storage service.

For local development, Redis can be started with Docker:

```bash
docker run --name portfolio-redis -p 6379:6379 -d redis:7-alpine redis-server --requirepass test
```

If Redis does not use a password, leave `REDIS_PASSWORD` empty in `.env`.

## Setup

```bash
cp .env.example .env
npm install
```

Fill `.env` with values for your local or deployed services:

```env
ENV=local
NODE_ENV=local
TZ=Asia/Jakarta
PORT=3005
ADMIN_PASSWORD=change_this_admin_password

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=db_portofolio
DATABASE_USER=root
DATABASE_PASSWORD=change_this_database_password

REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=change_this_redis_password

MINIO_ENDPOINT=127.0.0.1
MINIO_BUCKET=dev
MINIO_PORT=9000
MINIO_ACCESS_KEY=change_this_minio_access_key
MINIO_SECRET_KEY=change_this_minio_secret_key

JWT_SECRET=change_this_long_random_access_secret
JWT_REFRESH_SECRET=change_this_long_random_refresh_secret

CORS_ORIGINS=http://localhost:3000,http://localhost:200
REFRESH_COOKIE_SECURE=false
REFRESH_COOKIE_SAME_SITE=lax
```

Notes:

- Do not commit `.env`, `.env.local`, or real credentials to a public repository.
- Use long random values for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- `ADMIN_PASSWORD` is only used when the seeder creates the first admin user.
- For local HTTP development, keep `REFRESH_COOKIE_SECURE=false`. In HTTPS production, set it to `true`.

## Run Locally

```bash
npm run migrate
npm run seed
npm run start:dev
```

Default API URL:

```text
http://localhost:3005
```

## Redis

Redis is used by:

- `RedisService`: Redis connection wrapper.
- `BruteForceService`: stores failed login counters.
- `AuthService`: stores active refresh tokens by user and `tokenId`.

Redis key patterns:

```text
bf:login:ip:{ip}
bf:login:user:{username}
bf:login:combo:{ip}:{username}
bf:block:ip:{ip}
bf:block:combo:{ip}:{username}
refresh_token:{userId}:{tokenId}
```

Important TTL values:

- Failed login counters: 15 minutes.
- Login blocks: 30 minutes.
- Refresh tokens: 7 days.

If Redis is down, login and refresh token flows can fail because authentication depends on Redis. In production, Redis should run on a private network, use a strong password, use persistence if needed, and never expose its port publicly.

## API Areas

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/dashboard/summary`
- `/api/general`
- `/api/portofolio`
- `/api/work`
- `/api/achievement`
- `/api/category`
- `/api/code_language`
- `/api/framework`
- `/api/tool`
- `/api/minio/presign-upload`
- `/api/minio/presign-view`
- `DELETE /api/minio`

Create, update, delete, upload, and other admin operations require a short-lived access token:

```text
Authorization: Bearer <access_token>
```

Refresh tokens are not returned to the browser JavaScript runtime. The backend sets them as `HttpOnly` cookies scoped to `/api/auth`. Cookie `Secure` and `SameSite` are controlled by `REFRESH_COOKIE_SECURE` and `REFRESH_COOKIE_SAME_SITE`.

## Database

Run migrations:

```bash
npm run migrate
```

Run seeders:

```bash
npm run seed
```

Revert the latest migration:

```bash
npm run migrate:revert
```

Generate a migration:

```bash
make migration name=your_migration_name
```

Migration configuration lives in `src/system/data_source.ts` and `src/system/connection/db_configuration.ts`.

## Tests

Unit tests:

```bash
npm test -- --runInBand
```

E2E tests:

```bash
npm run test:e2e
```

## Build

```bash
npm run build
npm run start:prod
```

## Docker

The backend includes `docker-compose.yaml`. The container command currently runs:

```bash
npm run migrate && npm run seed && npm run start:prod
```

Deployment helper:

```bash
make deploy
```

Deployment notes:

- `docker-compose.yaml` uses `network_mode: "host"`, so make sure only the API port that must be public is opened in the firewall.
- MySQL, Redis, and MinIO should not be exposed to the internet.
- Do not copy `.env` into the image. Use a secret manager, server environment variables, or a local `env_file` that is not committed.

## Security Review For Public Repository

What is already in good shape:

- `.env` and `.env.local` were not tracked in git when this README was updated.
- Global `ValidationPipe` uses `whitelist: true`, so extra request body fields are stripped.
- User passwords are hashed with bcrypt.
- Login uses a generic `Invalid credentials` message.
- Refresh tokens use rotation, can be revoked through Redis, and are stored in HttpOnly cookies instead of browser `localStorage`.
- CORS uses an origin whitelist instead of a wildcard.
- `DELETE /api/minio` is protected with `AuthGuards`.

Issues and recommendations:

- `backend/.env.example` contains weak sample values such as `@Coba123`, `test`, `localSecret`, and `localRefreshSecret`. Example values are acceptable for documentation, but never reuse them in production.
- Rotate every secret if `.env`, screenshots, deployment logs, or real credentials were ever pushed or shared publicly.
- MinIO endpoints need strict controls. `presign-upload` and object deletion must stay auth-only; object keys should also be validated to prevent paths such as `../` or deletion outside the expected prefix.
- `presign-view` is currently public. That is acceptable only if portfolio files are intended to be publicly readable.
- Add security headers, for example with Helmet, before public production deployment.
- Add global request rate limiting for public endpoints. Login brute-force protection exists, but other endpoints are not globally rate-limited.
- Refresh-token cookies default to `SameSite=Lax`. If the frontend and backend are deployed on completely different sites and require `SameSite=None`, also set `REFRESH_COOKIE_SECURE=true` and add CSRF protection before allowing cross-site credentialed requests.
- If the app runs behind a reverse proxy, configure trust proxy correctly so brute-force protection reads the real client IP instead of the proxy IP.
- Do not expose Redis, MySQL, or the MinIO admin console publicly. Restrict them with a private network and firewall rules.
- Use a production database user with minimum privileges instead of `root`.
- Consider shortening the 1-day access token lifetime if the admin panel may be used on shared or public devices.
- Make sure request logs never print tokens, passwords, presigned URLs, or secrets.

`npm audit --audit-level=moderate` result on 2026-05-13:

- Total: 22 vulnerabilities.
- Severity: 1 critical, 9 high, 12 moderate.
- Critical: `handlebars`, from transitive tooling/dev dependencies.
- High-priority packages: `@nestjs/core`, `@nestjs/platform-express`, `axios`, `fast-uri`, `fast-xml-builder`, `lodash`, `path-to-regexp`, `picomatch`.
- Moderate packages: `ajv`, `brace-expansion`, `fast-xml-parser`, `follow-redirects`, `ip-address`, `uuid`.
- Recommended first step: run `npm audit fix`, review `package-lock.json`, then run unit tests and auth/admin smoke tests.

Public deployment checklist:

- [ ] `.env`, `.env.local`, and other secret files are ignored by git.
- [ ] All production secrets are replaced with strong random values.
- [ ] The production database user is not `root`.
- [ ] Redis uses a strong password and is not public.
- [ ] MinIO credentials are rotated and bucket policy is reviewed.
- [ ] Production CORS only includes the official frontend domain.
- [ ] Admin endpoints reject requests without a token.
- [ ] Dependency audit has been reviewed.

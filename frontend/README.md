# Portfolio Frontend

Next.js frontend for the portfolio application. It contains the public portfolio website and the admin console.

## Tech Stack

- Next.js Pages Router
- React
- TypeScript
- Tailwind CSS
- Axios-based API client

## Setup

```bash
cp .env.example .env
npm install
```

Set the backend URL in `.env`:

```env
NEXT_PUBLIC_ENDPOINT_URL=http://localhost:3005
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Public Pages

- `/` home page
- `/skills` full skills and technologies page
- `/portofolio` portfolio list
- `/portofolio/[id]` portfolio detail
- `/work` work history
- `/achievement` achievements

## Admin Pages

- `/admin` dashboard
- `/admin/general` general profile content
- `/admin/work` work records
- `/admin/achievement` achievement records
- `/admin/code_language` code language records
- `/admin/framework` framework records
- `/admin/portofolio` portfolio records
- `/admin/portofolio/category` portfolio categories

Portfolio create/edit supports:

- Work selection
- Categories
- Frameworks
- Tools
- App/source links
- Thumbnail upload
- Gallery images
- Position ordering

## Architecture

The frontend follows a simple feature-oriented clean architecture style:

```text
src/features/core/application         service classes
src/features/core/domain              request/response models and repository interfaces
src/features/core/infrastructure      API data sources and repository implementations
src/features/core/presentation        UI and page logic
src/shared                            shared components, constants, network, utilities
src/pages                             Next.js routes
```

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run lint:fix
npx tsc --noEmit
```

## Docker

The frontend includes `docker-compose.yaml` and a `Makefile`.

Deploy helper:

```bash
make deploy
```

This copies the production env, builds the image, and starts the container.

## Security Review For Public Repository

What is already in good shape:

- `.env` was not tracked in git when this README was updated.
- The frontend only exposes `NEXT_PUBLIC_ENDPOINT_URL`, which is expected because `NEXT_PUBLIC_*` variables are bundled into browser code.
- API requests attach the access token through the shared Axios client instead of duplicating token logic across pages.
- The access token is kept in memory only. It is not persisted to `localStorage`.
- The refresh token is handled by the backend as an HttpOnly cookie and is sent with requests through `withCredentials`.
- External links that were reviewed use `rel="noopener noreferrer"` or `rel="noreferrer"` with `target="_blank"`.
- No `dangerouslySetInnerHTML` usage was found in `frontend/src`.

Issues and recommendations:

- User profile data and UI preferences are still stored in `localStorage`. Do not store secrets there.
- Access tokens are in memory, so they disappear on page reload. The app restores sessions by calling the refresh endpoint, which depends on the backend refresh cookie.
- `NEXT_PUBLIC_ENDPOINT_URL` is public by design. Never put API secrets, MinIO credentials, JWT secrets, or private internal URLs in `NEXT_PUBLIC_*` variables.
- The upload flow sends files directly to presigned URLs. The backend must enforce object key validation, file type rules, size limits, and auth before issuing upload signatures.
- The frontend cannot protect admin routes by itself. Keep backend authorization on every admin mutation and file deletion endpoint.
- Add production security headers at the hosting layer or in Next.js config, including `Content-Security-Policy`, `X-Frame-Options` or `frame-ancestors`, `Referrer-Policy`, and `Permissions-Policy`.
- If frontend and backend are deployed on different sites, review `SameSite`, CORS credentials, and CSRF protection together.
- If images are loaded from user-controlled URLs or object storage, restrict allowed image hosts in `next.config.ts` and validate URLs returned by the backend.
- `frontend/.env.example` uses `NEXT_PUBLIC_ENDPOINT_URL=http://localhost:3005`. Replace it with the production HTTPS backend URL in deployment.
- `docker-compose.yaml` uses `network_mode: "host"` while also declaring `ports`. Review this before production because host networking bypasses normal Docker port isolation.

`npm audit --audit-level=moderate` result on 2026-05-13:

- Total: 4 vulnerabilities.
- Severity: 2 high, 2 moderate.
- High-priority packages: `axios`, `next`.
- Moderate packages: `follow-redirects`, `postcss`.
- `npm audit fix` can address some issues. Full remediation currently suggests `npm audit fix --force`, which upgrades `next` from `16.2.2` to `16.2.6`; review and test the app before committing that change.

Public deployment checklist:

- [ ] `.env` and deployment-only secrets are not committed.
- [ ] `NEXT_PUBLIC_ENDPOINT_URL` points to the HTTPS production backend.
- [ ] Admin routes are backed by server-side authorization, not only frontend guards.
- [ ] Refresh-token cookie behavior is tested in the production domain setup.
- [ ] Security headers are configured.
- [ ] External link and image URL handling are reviewed.
- [ ] Dependency audit has been reviewed and fixes are tested.

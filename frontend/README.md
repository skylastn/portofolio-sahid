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

Public deployment checklist:

- [ ] `.env` and deployment-only secrets are not committed.
- [ ] `NEXT_PUBLIC_ENDPOINT_URL` points to the HTTPS production backend.
- [ ] Admin routes are backed by server-side authorization, not only frontend guards.
- [ ] Refresh-token cookie behavior is tested in the production domain setup.
- [ ] Security headers are configured.
- [ ] External link and image URL handling are reviewed.
- [ ] Dependency audit has been reviewed and fixes are tested.

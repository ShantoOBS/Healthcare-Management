# DocLink Healthcare Management System

DocLink is a full-stack healthcare management platform for coordinating patients, clinicians, appointments, and the administrative work around care delivery. It combines a role-aware web application with a REST API, PostgreSQL persistence, payment and calendar integrations, and a retrieval-augmented doctor discovery feature.

> **Scope note:** This project provides healthcare workflow software. It is not a medical device, does not replace clinical judgment, and should not be used to make emergency or autonomous medical decisions. Deployments handling real patient data need appropriate privacy, security, compliance, and operational review.

## Product Capabilities

### Patient experience

- Register, sign in, verify email, reset/change passwords, refresh sessions, and authenticate with Google.
- Browse doctor specialties and clinician profiles.
- Book appointments, view upcoming and past appointments, and manage appointment status where permitted.
- Pay for appointments through Stripe or use the pay-later booking flow.
- Access prescriptions and health-related records available to the patient account.
- Receive notifications and access consultation meeting details when available.

### Doctor experience

- Manage doctor profile and specialty information.
- Configure schedules and availability.
- Review and manage appointments.
- Create and manage prescriptions for patients.
- Connect calendar/meeting workflows through Google Calendar and Google Meet integrations.
- View doctor dashboard and statistics.

### Administration

- Separate `SUPER_ADMIN` and `ADMIN` roles with protected administrative routes.
- Manage users, doctors, patients, specialties, schedules, appointments, and related records through the API.
- View platform statistics and RAG indexing statistics.
- Seed the initial super-admin account from backend environment configuration when the API starts.

### Platform workflows and integrations

- **Appointments:** Role-checked booking, status updates, and unpaid appointment cancellation scheduled every 25 minutes.
- **Payments:** Stripe-backed appointment payments and webhook processing. Payment receipts/invoice artifacts are supported by the backend workflow.
- **Documents and media:** Cloudinary is used for uploaded files, including prescription/report assets.
- **Notifications:** Socket.IO provides realtime notification delivery.
- **Doctor discovery (RAG):** Doctor data can be indexed as vector embeddings; queries retrieve relevant indexed content and ask an OpenRouter-configured language model to produce an answer with source records. Redis caches query results for 30 minutes.
- **Scheduling and consultations:** Google OAuth/Calendar and Google Meet APIs support calendar and video-consultation workflows.

These integrations require their own credentials and external services. The application does not include credentials or provision those services automatically.

## Roles

| Role | Intended access |
| --- | --- |
| `SUPER_ADMIN` | Platform-level administration |
| `ADMIN` | Operational administration |
| `DOCTOR` | Clinician profile, schedule, appointments, and prescriptions |
| `PATIENT` | Patient profile, appointments, payments, and patient-facing records |

Backend authorization is enforced on protected API routes. The frontend also routes users to role-appropriate dashboard areas; frontend route protection is not a replacement for API authorization.

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI, TanStack Query/Table/Form |
| Backend | Node.js, Express 5, TypeScript, Better Auth, Zod |
| Data | PostgreSQL, Prisma 7, pgvector extension for vector search |
| Realtime/cache | Socket.IO, Redis |
| Integrations | Stripe, Cloudinary, Google OAuth/Calendar/Meet, SMTP, OpenRouter |

## Repository Layout

```text
.
├── Health-Care-Backend/
│   ├── prisma/                 # Prisma schema and database migrations
│   └── src/app/module/         # Feature modules and API routes
├── Health-Care-Frontend/
│   └── src/                    # Next.js routes, components, hooks, and services
├── docker-compose.yml
└── README.md
```

The backend is organized by feature under `src/app/module` (auth, patients, doctors, appointments, payments, prescriptions, schedules, specialties, reviews, statistics, RAG, and integrations). The frontend groups public pages and authenticated dashboard experiences under `src/app`.

## Prerequisites

- Node.js compatible with the project (the backend Dockerfile currently uses Node 25).
- npm (both applications have `package-lock.json` files).
- PostgreSQL. Install/enable the `vector` extension if using the doctor RAG feature.
- Redis for RAG query caching. The API catches a Redis connection failure during startup, but RAG caching will not be available.
- Credentials for integrations used by the configured workflows: SMTP, Google, Cloudinary, Stripe, and OpenRouter for RAG.

## Local Development

### 1. Configure the backend

Create `Health-Care-Backend/.env` and populate the variables listed below. `Health-Care-Backend/.env.example` is a partial template; it does not currently contain every variable required by the backend.

The backend currently validates all of these variables at startup, even if you are not using the related integration locally:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV`, `PORT` | Runtime mode and API port (typically `development` and `5000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth signing/configuration; local URL is typically `http://localhost:5000` |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` | Access/refresh token signing. `ACCESS_TOKEN_SECRET` must match frontend `JWT_ACCESS_SECRET`. |
| `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN` | Token lifetime values (for example `1d`, `7d`) |
| `BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN`, `BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE` | Better Auth session timing configuration |
| `EMAIL_SENDER_SMTP_USER`, `EMAIL_SENDER_SMTP_PASS`, `EMAIL_SENDER_SMTP_HOST`, `EMAIL_SENDER_SMTP_PORT`, `EMAIL_SENDER_SMTP_FROM` | Email delivery for account workflows |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google OAuth/Calendar/Meet integration |
| `FRONTEND_URL` | Frontend origin allowed by backend CORS (typically `http://localhost:3000`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | File upload/storage integration |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe payment and webhook integration |
| `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` | Credentials for the startup-seeded super-admin user |
| `REDIS_URL` | Redis connection used for RAG caching; not required by the startup env validator |
| `OPENROUTER_API_KEY`, `OPENROUTER_EMBEDDING_MODEL`, `OPENROUTER_LLM_MODEL` | OpenRouter models used by the RAG feature; configure to use RAG |

Use strong, private secrets. Do not commit `.env` files or real credentials. Configure the Google OAuth redirect URI to match `GOOGLE_CALLBACK_URL` and the OAuth flow being used by the application.

### 2. Install, migrate, and start the backend

```bash
cd Health-Care-Backend
npm ci
npm run generate
npx prisma migrate deploy
npm run dev
```

The API listens on `http://localhost:5000` by default. The root endpoint (`/`) returns a basic API status response. The initial super-admin is created on startup if one does not already exist.

For local schema development, `npm run migrate` invokes `prisma migrate dev`; `npm run push` invokes `prisma db push`. Prefer checked-in migrations for shared or deployed environments.

### 3. Configure and start the frontend

Create `Health-Care-Frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_TIMEOUT_MS=120000
JWT_ACCESS_SECRET=<same-value-as-backend-ACCESS_TOKEN_SECRET>
```

Then run:

```bash
cd Health-Care-Frontend
npm ci
npm run dev
```

Open `http://localhost:3000`. The frontend calls the backend using `NEXT_PUBLIC_API_BASE_URL`; the optional timeout defaults to 120 seconds. `JWT_ACCESS_SECRET` is used by the Next.js proxy to validate access tokens and must match the backend signing secret.

## API Overview

All versioned routes are mounted below `/api/v1`:

| Prefix | Domain |
| --- | --- |
| `/auth` | Registration, login, session/token operations, email verification, password recovery, Google login |
| `/specialties` | Specialty catalog |
| `/users` | User administration and profile operations |
| `/patients`, `/doctors`, `/admins` | Role-specific profiles and management |
| `/schedules`, `/doctor-schedules` | Schedule and doctor availability operations |
| `/appointments` | Booking, appointment listing/status, and payment initiation |
| `/prescriptions` | Prescription operations |
| `/reviews` | Doctor/patient review workflows |
| `/stats` | Dashboard statistics |
| `/payments` | Payment-related routes |
| `/rag` | Doctor-data ingestion, query, and indexing statistics |
| `/meetings`, `/google-calendar` | Google Meet and Calendar integration routes |

The Stripe webhook is mounted separately at `POST /webhook`. For exact request/response schemas and examples, see the Postman collection at `Health-Care-Backend/Backend-PH-Healthcare-Management-System-API.postman_collection-test.json` and the route files under `Health-Care-Backend/src/app/module`.

## Useful Commands

Backend (`Health-Care-Backend`):

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API in watch mode |
| `npm run build` | Compile TypeScript and copy generated Prisma client files |
| `npm start` | Run the compiled API |
| `npm run lint` | Lint backend source |
| `npm run generate` | Generate the Prisma client |
| `npm run migrate` | Run Prisma development migrations |
| `npm run studio` | Open Prisma Studio |

Frontend (`Health-Care-Frontend`):

| Command | Description |
| --- | --- |
| `npm run dev` | Run Next.js in development mode |
| `npm run build` | Build the production frontend |
| `npm start` | Serve the production build |
| `npm run lint` | Lint the frontend |

## Verification and Operational Notes

- Neither package currently defines an automated test suite. The backend `test` script is a placeholder that exits with an error; the frontend has no test script. Lint and build commands are available.
- `docker-compose.yml` currently references `Health-Care-Frontned` (misspelled) instead of `Health-Care-Frontend`, and expects local `.env` files. Correct those paths and configure both services before using Compose.
- The backend Dockerfile starts the development server. Review the container configuration, secrets, migrations, health checks, and process settings before using it for production.
- Protect patient data: use TLS, least-privilege credentials, secure secret management, backups, access auditing, and applicable healthcare privacy controls in any real deployment.

## License

No project license is currently declared. Contact the project owners before redistributing or using this repository beyond the permissions of its owner.

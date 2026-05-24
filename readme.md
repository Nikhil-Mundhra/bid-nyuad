# Bid-NYUAD

Bid-NYUAD is a mobile-first marketplace prototype for NYU Abu Dhabi students to
trade campus-denominated balances. It replaces scattered chat-based exchange
coordination with market views, verified NetID onboarding, bids, accepted trade
chats, and lightweight notifications.

This repository is a functional MVP scaffold. It does not process payments,
hold funds, or provide escrow.

## What Works Today

- Public landing page and demo market browsing.
- Market pair selection across Meal Swipe, Flex Dirham, Campus Dirham, Falcon
  Dirham, and Real Dirham.
- NetID registration flow with ID text/file intake, OTP verification, and
  cookie-based sessions.
- Optional private ID image storage through Supabase Storage.
- Buy-bid creation, best active bid display, and seller acceptance.
- Anonymous trade chat with polling after a bid is accepted.
- Buyer-controlled WhatsApp reveal inside an accepted trade.
- Seller completion or failure confirmation.
- In-app notification records for highest bids, accepted bids, messages, and
  trade results.
- Docker-based local PostgreSQL setup and seed data.

Several product-package goals are not implemented yet: seller ask orders,
short-lived match locks, dual-party completion confirmation, blocking,
reporting, reputation, moderation, and pair-specific watch notifications. See
[project.md](./project.md) for the implementation assessment and roadmap.

## Stack

| Layer | Technology |
| --- | --- |
| Web app | Next.js 14 App Router, React 18, TypeScript |
| Styling and UI | Tailwind CSS, Lucide React, Recharts |
| Database | PostgreSQL with Prisma |
| Validation | Zod |
| Verification | bcrypt-hashed OTPs, Nodemailer SMTP adapter |
| ID uploads | Optional Supabase Storage adapter |
| Tests | Vitest |
| Local deployment | Docker Compose |

## Quick Start With Docker

Requirements: Docker Desktop or another Docker Compose-compatible runtime.

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The Compose stack creates
a local PostgreSQL database, pushes the Prisma schema, seeds sample markets and
bids, and starts the Next.js app.

The Docker development configuration uses `MOCK_OCR_NET_ID=demo123`. When SMTP
is not configured, OTP codes are printed in the web container logs:

```bash
docker compose logs -f web
```

## Local Development

Requirements: Node.js 20+ and PostgreSQL.

```bash
npm ci
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Configure `DATABASE_URL` in `.env` before pushing or seeding the database.
For local ID-image testing without a real OCR provider, add
`MOCK_OCR_NET_ID=demo123` to `.env`; alternatively, the registration scaffold
can extract a NetID from entered OCR source text. For actual image OCR, enable
Google Cloud Vision and configure either `GOOGLE_APPLICATION_CREDENTIALS` with
the path to a service-account key file or `GOOGLE_CREDENTIALS_JSON` with its
JSON content in hosted deployments. With no email delivery settings, OTP codes
are logged to the terminal running the server.

The markets UI can render seeded front-end preview data without
`DATABASE_URL`, but authenticated bidding, verification, chat, and
notifications require a configured database.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `NEXT_PUBLIC_APP_URL` | Browser-visible app origin, usually `http://localhost:3000`. |
| `SESSION_SECRET` | Reserved deployment secret; set a strong production value. |
| `MOCK_OCR_NET_ID` | Optional local fallback NetID returned for uploaded image files. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Local/server filesystem path to the Google Cloud Vision service-account JSON file. |
| `GOOGLE_CREDENTIALS_JSON` | Inline Google Cloud Vision service-account JSON for deployments without a credential file. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Optional SMTP delivery for OTP email; without these, the OTP logs to the server console. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase credentials for private ID-card uploads. |
| `SUPABASE_ID_UPLOAD_BUCKET` | Storage bucket for ID images; defaults to `nyuad-id-uploads`. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client-safe Supabase project configuration. |

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit real secrets
to the repository.

## Product Walkthrough

1. Visit `/markets?demo=guest` to browse the market UI with preview or seeded
   data.
2. Register at `/register`: extract a NetID, request an OTP, verify it, and
   optionally save a WhatsApp number.
3. Select a pair and use its buy page to place a bid.
4. A different verified account can accept an active bid, which creates a
   trade.
5. Trade participants can coordinate in `/trades/[tradeId]`; the buyer may
   reveal WhatsApp and the seller may mark the trade successful or failed.

The current chat and notifications screens retain an `x-user-id` input/header
fallback for MVP testing. Production-facing flows should rely solely on
authenticated sessions.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Generate the Prisma client and build the production app. |
| `npm start` | Start a built production app on `0.0.0.0`. |
| `npm run lint` | Run Next.js lint checks. |
| `npm test` | Run Vitest tests once. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run db:generate` | Generate the Prisma client. |
| `npm run db:push` | Push the schema to the configured database. |
| `npm run db:migrate` | Create/apply Prisma development migrations. |
| `npm run db:seed` | Seed currencies, market pairs, users, and sample bids. |

## Repository Layout

```text
prisma/
  schema.prisma          Database models and enums
  seed.ts                Sample currencies, markets, user, and bids
scripts/
  docker-start.sh        Container startup, schema push, and optional seed
src/app/
  api/                   Route handlers for auth, bids, markets, trades, notifications
  markets/               Market browsing and buy-bid screens
  trades/                Accepted trade chat screen
src/components/          Client UI components
src/lib/domain/          Pure domain rules and unit tests
src/lib/server/          Prisma-backed services, auth, OTP, OCR, storage
```

## API Surface

| Route | Purpose |
| --- | --- |
| `POST /api/auth/id-upload` | Extract a NetID and optionally store an ID image. |
| `POST /api/auth/send-otp` | Create and send/log a NetID OTP challenge. |
| `POST /api/auth/verify-otp` | Verify an OTP, upsert a verified user, and create a session. |
| `POST /api/auth/whatsapp` | Store a user's WhatsApp number. |
| `GET /api/markets` | Return active market summaries. |
| `POST /api/markets/resolve` | Resolve or create a selected market pair. |
| `GET /api/markets/[id]/trends` | Return recent bid trend points. |
| `POST /api/bids` | Create a buyer bid. |
| `POST /api/bids/[id]/accept` | Accept a bid as a seller and create a trade. |
| `GET /api/notifications` | List the user's latest notifications. |
| `GET`, `POST /api/trades/[id]/messages` | Read or send anonymous trade messages. |
| `POST /api/trades/[id]/reveal-whatsapp` | Reveal the buyer's WhatsApp number in chat. |
| `POST /api/trades/[id]/confirm-seller` | Record the seller's trade result. |

## Deployment Notes

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker deployment and Supabase
production configuration. Before a real student launch, replace the mock OCR
path, remove test header authentication, add abuse controls and rate limits,
review ID retention/privacy handling, and implement the outstanding trust and
safety features.

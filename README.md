# Split Money

Split Money is a mobile-first web app for splitting shared trip expenses. Create a trip, add the people going, log who paid for what, and the app works out each person's balance and the fewest payments needed to settle up.

> **Status:** in active development. The backend API is complete; the frontend screens are being built. Deployment to a VPS with Docker and a CI/CD pipeline is planned next.

## Features

- **Trips and members:** create a trip with dates and the people going
- **Three ways to split an expense:**
  - **Equally** between some or all members
  - **Exact amounts** per person
  - **Shares**, for example someone who stayed 2 nights pays double
- **Penny-exact maths:** splits never lose or invent a cent. Leftover cents are handed out with the largest-remainder method.
- **Balances:** see who paid, each person's share, and who is up or down
- **Settle up:** suggests the fewest payments to clear every balance (at most *people − 1*), and records payments as they happen
- **Mobile-first UI:** built for phones, with accessible forms, keyboard support, and iPhone safe-area handling

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, CSS Modules |
| Backend | Node.js, Express 5, TypeScript, Zod |
| Database | PostgreSQL 18, Prisma 7 |
| Testing | Vitest |
| Infrastructure | Docker, Docker Compose (Nginx, GitHub Actions and an Ubuntu VPS planned) |

## How money is handled

All amounts are stored and sent as **whole numbers of cents** (`$48.00` → `4800`), never as decimals. This avoids floating-point errors such as `0.1 + 0.2 = 0.30000000000000004`. Amounts are formatted for display with `Intl.NumberFormat` using the trip's currency (USD by default).

Balances are **calculated** from expenses and payments on every request, never stored, so they can't drift out of sync.

## Project structure

```
Split-money/
├── api/                      Backend (Express + Prisma)
│   ├── prisma/               Database schema and migrations
│   └── src/
│       ├── domain/           Pure money logic: splitting, balances, settle-up (unit tested)
│       ├── services/         Database access
│       ├── routes/           HTTP endpoints
│       ├── schemas/          Request validation (Zod)
│       ├── middleware/       Error handling
│       └── lib/              Shared helpers
├── web/                      Frontend (React + Vite)
│   └── src/
│       ├── components/       Reusable UI, one folder per component
│       ├── pages/            Screens, one folder per page
│       ├── hooks/            Data loading
│       ├── services/         API client
│       ├── styles/           Design tokens and global styles
│       └── utils/            Money, dates, and split helpers
├── nginx/                    Reverse proxy config (planned)
├── .github/workflows/        CI/CD pipeline (planned)
└── docker-compose.yml        Local PostgreSQL
```

The backend is split into layers: **routes** handle HTTP and validation, **services** talk to the database, and **domain** holds the money maths with no database or HTTP code, which keeps it simple to test.

## Getting started

### Prerequisites

- Node.js 22.12 or later
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/mayurbagul03/Split-money.git
cd Split-money
```

### 2. Start the database

```bash
docker compose up -d
```

PostgreSQL runs in Docker and is exposed on port **5434**, so it doesn't clash with a PostgreSQL already installed on your machine.

### 3. Set up the API

```bash
cd api
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

The API runs at http://localhost:3000. Check it with http://localhost:3000/api/health.

### 4. Set up the web app

In a second terminal:

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173. Requests to `/api` are forwarded to the API by Vite's dev server.

To test on a phone, connect it to the same Wi-Fi and open the **Network** address that Vite prints.

## Scripts

**API** (`api/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the API and restart on file changes |
| `npm test` | Run the unit tests |
| `npm run build` | Generate the Prisma client and compile TypeScript |
| `npm start` | Run the compiled API |
| `npm run db:migrate` | Create and apply a database migration |
| `npm run db:studio` | Open Prisma Studio to browse the data |

**Web** (`web/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run lint` | Check the code with ESLint |
| `npm run build` | Type-check and build for production |

## API

All amounts are in cents.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API and database status |
| `GET` | `/api/trips` | List trips |
| `POST` | `/api/trips` | Create a trip with its members |
| `GET` | `/api/trips/:tripId` | Get a trip and its members |
| `POST` | `/api/trips/:tripId/members` | Add a member |
| `GET` | `/api/trips/:tripId/expenses` | List expenses |
| `POST` | `/api/trips/:tripId/expenses` | Add an expense |
| `DELETE` | `/api/trips/:tripId/expenses/:expenseId` | Delete an expense |
| `GET` | `/api/trips/:tripId/summary` | Totals, balances, and suggested payments |
| `POST` | `/api/trips/:tripId/settlements` | Record a payment |

Example request body for adding an expense:

```json
{
  "description": "Seafood dinner",
  "amount": 12000,
  "category": "FOOD",
  "paidById": "<member id>",
  "split": { "type": "EQUAL", "memberIds": ["<member id>", "<member id>"] }
}
```

`split.type` can be `EQUAL` (with `memberIds`), `EXACT` (with `shares: [{ memberId, amount }]`), or `SHARES` (with `shares: [{ memberId, shares }]`).

Example requests for every endpoint are in [`api/requests.http`](api/requests.http), which can be run with the VS Code REST Client extension.

## Testing

```bash
cd api
npm test
```

The tests cover the core money logic: equal and weighted splits always adding up to the exact total, balances always summing to zero, and settle-up producing at most *people − 1* payments that clear every balance.

## Roadmap

- [x] Database schema and migrations
- [x] Split, balance, and settle-up logic with tests
- [x] REST API with validation
- [x] Trips list and new trip screens
- [x] Trip screen with totals and expenses
- [ ] Add expense screen
- [ ] Settle up screen
- [ ] Docker images for the web app and API
- [ ] Deployment to an Ubuntu VPS behind Nginx with HTTPS
- [ ] CI/CD with GitHub Actions
- [ ] Invite links and "which member am I" on each device
- [ ] Installable app (PWA)

## Author

Mayur Bagul

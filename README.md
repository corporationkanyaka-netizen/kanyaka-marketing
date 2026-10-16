# Kanyaka Corporation — website & enquiry backend

Next.js 16 site for Kanyaka Corporation, with a PostgreSQL backend (Prisma 7) that stores
website enquiries and the quotations staff send in reply.

## Setup

### Local (development)

1. Install PostgreSQL (pgAdmin) and create an empty database named **`kanyaka`**.
2. Configure and run:

```bash
npm install                                         # also runs `prisma generate`
cp .env.development.example .env.development        # set your Postgres password + random tokens
npm run db:migrate                                  # create / update tables in kanyaka
npm run dev                                         # http://localhost:3000
```

### Production

```bash
cp .env.production.example .env.production          # live DATABASE_URL + DIFFERENT tokens
npm run db:deploy:prod                              # apply migrations to the live DB (never resets data)
npm run build && npm start
```

On a hosting platform (Vercel, Render, …) set the same variables in its dashboard instead of uploading
`.env.production`, and run `npm run db:deploy` as the release step.

| File | Loaded by | Committed |
|---|---|---|
| `.env.development` | `next dev`, Prisma CLI (`db:migrate`, `db:studio`, …) | no |
| `.env.production` | `next build` / `next start`, `db:*:prod` scripts | no |
| `.env.*.example` | — templates | yes |

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_API_TOKEN` | Bearer token for the staff/admin endpoints. Long random string, different per environment. |
| `IP_HASH_SALT` | Salt for hashing visitor IPs (rate limiting; raw IPs are never stored) |

Browse data with `npm run db:studio` or pgAdmin. Check the live DB's migration state with `npm run db:status:prod`.

## Data model

```
customers ──< enquiries ──< enquiry_items
                  │
                  ├──< quotes ──< quote_items
                  └──< activities  (audit trail; may also point at a quote)
```

| Table | What it holds |
|---|---|
| `customers` | A buyer, de-duplicated by phone (stored as E.164, e.g. `+919030044304`). Name, company, email, optional GSTIN. |
| `enquiries` | One request. Reference `KC-ENQ-2026-00001`, status, source, contact snapshot, delivery location, message, COA requested, idempotency key, hashed IP, `responded_at`. |
| `enquiry_items` | Chemical requested: catalogue slug + name snapshot, quantity as typed (`"10 MT in 50 kg bags"`) and parsed (`10`, `MT`). |
| `quotes` | A priced offer, `KC-QT-2026-00001`. Status, validity date, terms, subtotal / tax / freight / total (exact decimals). |
| `quote_items` | Lines: quantity, unit, unit price, GST %, line subtotal / tax / total. |
| `activities` | Append-only history: created, status changes, notes, calls, WhatsApp, emails, quotes. |

**Enquiry status:** `NEW → CONTACTED → QUOTED → WON / LOST`, or `SPAM`. Can't return to `NEW`.
Logging a call/WhatsApp/email on a `NEW` enquiry moves it to `CONTACTED`; sending a quote moves it to `QUOTED`;
an accepted quote marks it `WON`.

**Quote status:** `DRAFT → SENT → ACCEPTED / REJECTED / EXPIRED`; `DRAFT` or `SENT` can be `CANCELLED`.

Money is computed on the server in integer paise (BigInt), rounded half-up per line, and stored as `DECIMAL(14,2)`.
Clients never send totals.

## API

All responses are `{ "data": … }` or `{ "error": { "code", "message", "fields"? } }`.
Validation errors are `422` with `fields` keyed by path (e.g. `phone`, `items.0.unitPrice`).
Validation rules live in `src/lib/validation/enquiry.ts` and are shared by the forms and the API.

### Public

`POST /api/enquiries` — used by the contact page, quote pop-up and product pages.

```json
{
  "source": "CONTACT_PAGE",
  "name": "Subba Rao",
  "company": "Example Bulk Drugs Pvt Ltd",
  "phone": "98490 12345",
  "email": "purchase@example.com",
  "productSlug": "caustic-soda-flakes",
  "quantity": "10 MT in 50 kg bags",
  "deliveryLocation": "Pashamylaram",
  "message": "Need delivery next week",
  "wantsCoa": true,
  "idempotencyKey": "0b6f…-uuid"
}
```

→ `201 { data: { id, reference: "KC-ENQ-2026-00001", createdAt } }`. Repeating the same `idempotencyKey`
returns the original enquiry (`200`). `productSlug: null` means "other chemical" — then `message` is required.
Protected by a honeypot field (`website`) and a limit of 5 enquiries per IP per 10 minutes (`429`).

### Admin (header `Authorization: Bearer <ADMIN_API_TOKEN>`)

| Method & path | Does |
|---|---|
| `GET /api/enquiries?status=&source=&q=&from=YYYY-MM-DD&to=&page=&pageSize=` | List / search (reference, name, company, phone, email, location, product) |
| `GET /api/enquiries/:id` | Enquiry + customer, items, quotes, full activity history |
| `PATCH /api/enquiries/:id` | `{ status?, note?, actor? }` |
| `POST /api/enquiries/:id/activities` | `{ type: NOTE \| CALL \| WHATSAPP \| EMAIL, note, actor? }` |
| `GET /api/enquiries/:id/quotes` | Quotes for an enquiry |
| `POST /api/enquiries/:id/quotes` | Create a quote (below) |
| `GET /api/quotes/:id` | Quote with lines and enquiry summary |
| `PATCH /api/quotes/:id` | `{ status: SENT \| ACCEPTED \| REJECTED \| EXPIRED \| CANCELLED, note?, actor? }` |

Create a quote:

```json
{
  "items": [
    { "productSlug": "hydrogen-peroxide", "description": "Hydrogen Peroxide 50%", "quantity": 25.5, "unit": "MT", "unitPrice": 41250.75, "gstRate": 18 }
  ],
  "freight": 12000,
  "validUntil": "2026-10-31",
  "paymentTerms": "50% advance",
  "status": "SENT",
  "createdBy": "Ravi"
}
```

Units: `KG, MT, BAGS, DRUMS, CARBOYS, LITRES, KL, TANKERS, OTHER`.

## Code map

| Path | |
|---|---|
| `prisma/schema.prisma`, `prisma/migrations/` | Database schema and migrations |
| `src/lib/validation/enquiry.ts` | Shared Zod schemas, phone normalisation, quantity parsing |
| `src/lib/enquiry-client.ts` | Browser helper the forms use to submit |
| `src/server/` | Prisma client, HTTP helpers, enquiry & quote services |
| `src/app/api/` | Route handlers |
| `src/data/` | Company info, products, industries (source of truth: kanyakacorporation.com) |

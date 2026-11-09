# POS ໜ້າຮ້ານ — Training Project

A small Point-of-Sale system for a 1-day training session.

| Part | Tech | Folder | URL |
|---|---|---|---|
| Frontend | React + Vite + TypeScript | `front_end/` | http://localhost:5173 |
| Backend (API) | NestJS + TypeORM | `back_end/` | http://localhost:3000 |
| Database | PostgreSQL 14 | `database/` | `pos_training` |

## 1. Set up the database (first time only)

1. Open **pgAdmin** → right-click **Databases** → **Create → Database...** → name: `pos_training`
2. Right-click `pos_training` → **Query Tool**
3. Open and run (F5) `database/schema.sql` → creates the 4 tables
4. Open and run (F5) `database/seed.sql` → adds sample categories and products

> To reset everything back to the sample data, run both files again.

## 2. Run the backend

```bash
cd back_end
cp .env.example .env     # first time only, then put your Postgres password in .env
npm install              # first time only
npm run start:dev
```

## 3. Run the frontend (in a second terminal)

```bash
cd front_end
npm install              # first time only
npm run dev
```

Open http://localhost:5173

## API

| Method | Path | Body | What it does |
|---|---|---|---|
| GET | `/categories` | – | List categories |
| GET | `/products?categoryId=1` | – | List products (filter optional) |
| POST | `/checkout` | `{ "items": [{ "productId": 1, "quantity": 2 }] }` | Cut stock + create bill |
| GET | `/orders` | – | Latest 20 bills with items |
| GET | `/orders/:id` | – | One bill |

## Database (4 tables)

```
categories 1 ──< products 1 ──< order_items >── 1 orders
```

- **categories** — id, name
- **products** — id, name, price (kip), stock, category_id
- **orders** — id, total_amount, created_at
- **order_items** — id, order_id, product_id, quantity, price (price *at time of sale*)

See [TEACHING.md](TEACHING.md) for the 1-day lesson plan.

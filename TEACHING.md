# ແຜນການສອນ 1 ມື້ — POS ໜ້າຮ້ານ (1-day lesson plan)

Goal: by the end of the day the student understands **one complete flow** — from clicking
a button in the browser to a row changing in the database — and has changed code in all 3 layers.

---

## ⏰ Timetable

| Time | Topic | Notes |
|---|---|---|
| 08:30 – 09:00 | Setup check | Node, VS Code, pgAdmin, Git working on student's PC |
| 09:00 – 09:45 | **Live demo** | Sell 2 items → open pgAdmin → stock went down |
| 09:45 – 10:30 | **Database** | 4 tables, primary/foreign keys, why `order_items.price` exists |
| 10:45 – 11:45 | **Backend** | Follow `POST /checkout` through NestJS files |
| 11:45 – 12:00 | Q&A | |
| 13:00 – 13:45 | **Frontend** | React state, cart, `fetch` → API |
| 13:45 – 15:30 | **Hands-on exercises** | Level 1 → 2 → 3 below |
| 15:30 – 16:15 | **Git + Debugging** | Commit, push, read error messages |
| 16:15 – 16:30 | Recap | Student explains the flow back to you |

---

## 1. Live demo (morning)

1. Open http://localhost:5173 → add **ນ້ຳດື່ມ ×2** and **ກາເຟເຢັນ ×1** → **ຊຳລະເງິນ**
2. In pgAdmin run:
   ```sql
   SELECT * FROM products WHERE id IN (1, 3);   -- stock went down
   SELECT * FROM orders ORDER BY id DESC;        -- new bill
   SELECT * FROM order_items ORDER BY id DESC;   -- the 2 lines of that bill
   ```
3. Try to buy **ຊາຂຽວ ×3** (only 2 in stock) → error message. Show it is the **backend** that refused.

## 2. The data flow (draw this on the whiteboard)

```
[Browser / React]                [NestJS API]                     [PostgreSQL]
 click product  → cart (state)
 click ຊຳລະເງິນ  ── POST /checkout ──▶ ValidationPipe (checks DTO)
                                    OrdersController.checkout()
                                    OrdersService.checkout()
                                      BEGIN TRANSACTION ─────────▶
                                      SELECT products ... FOR UPDATE
                                      check stock enough?
                                      UPDATE products SET stock ... ▶ products
                                      INSERT INTO orders ...      ▶ orders
                                      INSERT INTO order_items ... ▶ order_items
                                      COMMIT ─────────────────────▶
 show "ສຳເລັດ"   ◀── JSON bill ─────
 reload stock   ── GET /products ──▶
```

### Files to walk through (in this order)

| Layer | File | Teach |
|---|---|---|
| DB | `database/schema.sql` | PK, FK, `CHECK (stock >= 0)` |
| Backend | `back_end/src/main.ts` | CORS, ValidationPipe |
| Backend | `back_end/src/app.module.ts` | DB connection from `.env` |
| Backend | `back_end/src/products/product.entity.ts` | Class ↔ table mapping |
| Backend | `back_end/src/orders/dto/checkout.dto.ts` | Validate input |
| Backend | `back_end/src/orders/orders.controller.ts` | Route → method |
| Backend | `back_end/src/orders/orders.service.ts` | ⭐ Business logic + transaction |
| Frontend | `front_end/src/api.ts` | `fetch` to backend |
| Frontend | `front_end/src/App.tsx` | `useState`, `useEffect`, cart logic |
| Frontend | `front_end/src/components/*.tsx` | Components + props |

### 3 key ideas to repeat

1. **Never trust the frontend.** The client sends only `productId` + `quantity`. The server reads the price
   from the DB. (Try sending `"price": 1` → rejected.)
2. **Transaction = all or nothing.** If one product is out of stock, nothing is saved — not even the other items.
3. **`order_items.price` is a copy.** If tomorrow the price of water changes, old bills must still show the old price.

---

## 3. Hands-on exercises (afternoon)

Do them in order. Each one ends with a `git commit`.

### Level 1 — Frontend only (warm-up)
- [ ] **1a.** Change the **ຊຳລະເງິນ** button colour to green (`App.css` → `.pay`).
- [ ] **1b.** Show the number of *pieces* in the cart title, e.g. `ກະຕ່າ (3 ລາຍການ / 5 ຊິ້ນ)` (`Cart.tsx`).
- [ ] **1c.** Add a **ລ້າງກະຕ່າ** (clear cart) button.

### Level 2 — Backend + Frontend
- [ ] **2a. Add a product via SQL** in pgAdmin (`INSERT INTO products ...`), refresh the page — it appears.
- [ ] **2b. Discount 10% when total ≥ 100,000 ₭.**
  - Backend: in `orders.service.ts`, after the loop, apply the discount to `totalAmount`.
  - Frontend: show the discount line in `Cart.tsx`.
  - Discussion: should we store the discount in the DB? (→ add a `discount_amount` column to `orders`)
- [ ] **2c. New endpoint `GET /products/low-stock`** — products with `stock <= 5`.
  Hint: `LessThanOrEqual(5)` from `typeorm`. Watch out: put the route **before** any `:id` route.

### Level 3 — Challenge (if time allows)
- [ ] **3a.** Add `POST /products` to create a product (new DTO with `@IsString()`, `@IsInt()`, `@Min(0)`).
- [ ] **3b.** `GET /reports/today` — total sales today. Write the SQL in pgAdmin first:
  ```sql
  SELECT COUNT(*) AS bills, COALESCE(SUM(total_amount), 0) AS total
  FROM orders WHERE created_at::date = CURRENT_DATE;
  ```

---

## 4. Debugging session

Let the student **cause** these errors on purpose and read the message:

| Do this | Where to look | What they learn |
|---|---|---|
| Stop the backend, click Pay in the browser | Red banner + browser DevTools → Network | Frontend can't reach API |
| Send `"quantity": "abc"` with Postman / curl | Response body (400) | DTO validation |
| Put a wrong password in `back_end/.env` | Backend terminal | DB connection error |
| `UPDATE products SET stock = -1 WHERE id = 1;` in pgAdmin | pgAdmin error | DB `CHECK` constraint protects data |
| Typo a property name in `App.tsx` | Vite terminal / browser overlay | TypeScript catches it before running |

curl example (Git Bash):
```bash
curl -X POST http://localhost:3000/checkout -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":"abc"}]}'
```

## 5. Git

```bash
git checkout -b feature/discount   # work on a branch
git status
git add .
git commit -m "feat: 10% discount for bills over 100,000 kip"
git push -u origin feature/discount
```

Point out: `back_end/.env` is in `.gitignore` → passwords never go to GitHub. Only `.env.example` does.

---

## Reset the database between sessions

Run `database/schema.sql` then `database/seed.sql` again in pgAdmin.

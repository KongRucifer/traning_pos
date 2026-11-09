-- =============================================================
-- POS Training — Database schema (PostgreSQL)
-- Run in pgAdmin: right-click database "pos_training" > Query Tool
-- WARNING: this drops and recreates all 4 tables (data is lost).
-- =============================================================

DROP TABLE IF EXISTS order_items, orders, products, categories CASCADE;

-- 1) ໝວດໝູ່ສິນຄ້າ
CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- 2) ສິນຄ້າ + Stock
--    price ເປັນ INTEGER (ກີບ) ເພາະເງິນກີບບໍ່ມີທົດສະນິຍົມ
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  price       INTEGER NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),  -- Stock ຕິດລົບບໍ່ໄດ້
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);

-- 3) ໃບບິນ
CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) ລາຍການສິນຄ້າໃນແຕ່ລະບິນ
--    price = ລາຄາ "ຕອນຂາຍ" (ຖ້າລາຄາສິນຄ້າປ່ຽນພາຍຫຼັງ ບິນເກົ່າບໍ່ປ່ຽນ)
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  price      INTEGER NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_products_category_id   ON products(category_id);
CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

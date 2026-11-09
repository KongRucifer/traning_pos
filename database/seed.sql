-- =============================================================
-- POS Training — Sample data
-- Run AFTER schema.sql
-- =============================================================
SET client_encoding = 'UTF8';

INSERT INTO categories (id, name) VALUES
  (1, 'ເຄື່ອງດື່ມ'),
  (2, 'ເຂົ້າໜົມ'),
  (3, 'ອາຫານ');

INSERT INTO products (name, price, stock, category_id) VALUES
  ('ນ້ຳດື່ມ',          5000, 50, 1),
  ('ນ້ຳອັດລົມ',        10000, 30, 1),
  ('ກາເຟເຢັນ',        15000, 20, 1),
  ('ຊາຂຽວ',          12000,  2, 1),   -- stock ໜ້ອຍ: ໃຊ້ສາທິດ "ສິນຄ້າບໍ່ພໍ"
  ('ມັນຝຣັ່ງທອດ',       8000, 40, 2),
  ('ເຂົ້າໜົມປັງ',        6000, 25, 2),
  ('ເຄັກຊັອກໂກແລັດ',  20000,  0, 2),   -- stock = 0: ໃຊ້ສາທິດ "ສິນຄ້າໝົດ"
  ('ເຂົ້າຜັດ',         25000, 15, 3),
  ('ເຝີ',            30000, 15, 3),
  ('ຕຳໝາກຫຸ່ງ',       20000, 10, 3);

-- Keep the id sequence in sync after inserting explicit ids
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

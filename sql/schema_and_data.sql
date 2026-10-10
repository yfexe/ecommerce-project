-- =====================================================================
-- ShopNow database  (INT424 Lab 3)
-- Run this ONCE in: Supabase -> SQL Editor -> + New query -> Run
-- Creates 5 tables, then fills them with sample (fake) data.
-- =====================================================================

-- ---------- Part C: create the tables ----------
CREATE TABLE category (
  category_id   SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL
);

CREATE TABLE product (
  product_id  SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id INTEGER REFERENCES category(category_id)
);

CREATE TABLE customer (
  customer_id SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMP DEFAULT now()
);

-- "order" is a reserved word in SQL, so it is double-quoted everywhere
CREATE TABLE "order" (
  order_id    SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customer(customer_id),
  order_date  TIMESTAMP DEFAULT now(),
  status      TEXT DEFAULT 'Pending',
  total       NUMERIC(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE order_item (
  order_item_id SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES "order"(order_id),
  product_id    INTEGER REFERENCES product(product_id),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price         NUMERIC(10,2) NOT NULL
);

-- ---------- Part D: sample data (parents first, children after) ----------
INSERT INTO category (category_name) VALUES
  ('Computers'),     -- category_id 1
  ('Accessories'),   -- category_id 2
  ('Phones');        -- category_id 3

-- 20 products. Same products, prices and stock as the Lab 2 catalogue.
INSERT INTO product (name, description, price, stock, category_id) VALUES
  ('Dell Laptop',                 '15-inch business laptop',                    3499, 10, 1),
  ('Wireless Mouse',              'Ergonomic wireless mouse',                    129, 25, 2),
  ('Smartphone X',                '128GB, dual SIM',                            2499,  0, 3),
  ('Lenovo ThinkPad',             '14-inch business ultrabook',                 4199,  6, 1),
  ('HP Pavilion Desktop',         'Tower desktop for home and office',          2799,  4, 1),
  ('Gaming Laptop',               '16-inch laptop with dedicated graphics',     5999,  3, 1),
  ('27-inch Monitor',             'Full HD IPS monitor',                        1199, 14, 1),
  ('Mini PC',                     'Compact desktop, fits behind a monitor',     1599,  0, 1),
  ('Tablet 10-inch',              '10-inch tablet, 64GB',                       1099,  9, 1),
  ('Mechanical Keyboard',         'Wired mechanical keyboard',                   349, 18, 2),
  ('Noise-Cancelling Headphones', 'Over-ear wireless headphones',                599,  7, 2),
  ('USB-C Hub',                   '7-in-1 USB-C adapter',                        149, 30, 2),
  ('Webcam HD 1080p',             '1080p webcam with microphone',                199,  2, 2),
  ('Laptop Backpack',             'Water-resistant 15.6-inch backpack',          179, 12, 2),
  ('Bluetooth Speaker',           'Portable waterproof speaker',                 259,  0, 2),
  ('Power Bank 20000mAh',         'Fast-charging power bank',                    119, 40, 2),
  ('Smartphone Lite',             '64GB, dual SIM',                             1299, 22, 3),
  ('Flagship Phone Pro',          '256GB, triple camera',                       4299,  5, 3),
  ('Budget Phone',                '32GB, everyday phone',                        599, 35, 3),
  ('Foldable Phone',              '512GB foldable display',                     5499,  2, 3);

-- Test customers (fake names and example.com emails)
INSERT INTO customer (name, email) VALUES
  ('Test Customer One',   'customer1@example.com'),
  ('Test Customer Two',   'customer2@example.com'),
  ('Test Customer Three', 'customer3@example.com');

-- 4 sample orders. total = sum of (quantity x price) of the order's items.
INSERT INTO "order" (customer_id, order_date, status, total) VALUES
  (1, '2025-03-05 10:15', 'Delivered', 3757),   -- order_id 1
  (2, '2025-03-12 14:40', 'Shipped',   1418),   -- order_id 2
  (1, '2025-03-18 09:05', 'Pending',    349),   -- order_id 3
  (3, '2025-03-25 16:30', 'Delivered', 2547);   -- order_id 4

-- price is copied into the order line, so old orders keep the price paid
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
  (1,  1, 1, 3499),   -- Dell Laptop
  (1,  2, 2,  129),   -- Wireless Mouse x2
  (2, 17, 1, 1299),   -- Smartphone Lite
  (2, 16, 1,  119),   -- Power Bank
  (3, 10, 1,  349),   -- Mechanical Keyboard
  (4,  7, 2, 1199),   -- 27-inch Monitor x2
  (4, 12, 1,  149);   -- USB-C Hub

-- ---------------------------------------------------------------------
-- If the script failed half-way and you want to start again, run this
-- block first (it deletes ALL five tables and their data):
--
-- DROP TABLE IF EXISTS order_item, "order", customer, product, category CASCADE;
-- ---------------------------------------------------------------------

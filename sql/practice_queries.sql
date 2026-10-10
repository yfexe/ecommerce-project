-- =====================================================================
-- ShopNow practice queries  (INT424 Lab 3, Step 7)
-- Run them one at a time in the Supabase SQL Editor.
-- =====================================================================

-- 1. Everything in the product table
SELECT * FROM product;

-- 2. Filtering (WHERE): products cheaper than 1000
SELECT name, price FROM product WHERE price < 1000;

-- 3. Grouping (GROUP BY + COUNT): how many products in each category
SELECT category_id, COUNT(*) AS product_count FROM product GROUP BY category_id;

-- 4. JOIN + sorting: product with its category name, most expensive first
SELECT p.name, p.price, c.category_name
FROM product p
JOIN category c ON p.category_id = c.category_id
ORDER BY p.price DESC;

-- 5. Out-of-stock products
SELECT name FROM product WHERE stock = 0;

-- ---------- extra queries (optional, useful for the report) ----------

-- 6. Product count per category, with the category NAME instead of the id
SELECT c.category_name, COUNT(*) AS product_count
FROM product p
JOIN category c ON p.category_id = c.category_id
GROUP BY c.category_name
ORDER BY product_count DESC;

-- 7. Orders with the customer name; checks that each stored total equals
--    the sum of its order lines
SELECT o.order_id, cu.name AS customer, o.status, o.total,
       SUM(oi.quantity * oi.price) AS computed_total
FROM "order" o
JOIN customer cu   ON cu.customer_id = o.customer_id
JOIN order_item oi ON oi.order_id = o.order_id
GROUP BY o.order_id, cu.name, o.status, o.total
ORDER BY o.order_id;

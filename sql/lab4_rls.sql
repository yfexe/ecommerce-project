-- =====================================================================
-- ShopNow Lab 4: Row Level Security (RLS)
-- Run this once in the Supabase SQL Editor AFTER the Lab 3 script.
--
-- The anon key is public (it sits in config.js), so the database itself
-- must decide what an anonymous visitor may do.
-- =====================================================================

-- 1) Public catalogue: anyone may READ products and categories (nothing else)
ALTER TABLE product  ENABLE ROW LEVEL SECURITY;
ALTER TABLE category ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on product"
  ON product  FOR SELECT USING (true);

CREATE POLICY "Public read access on category"
  ON category FOR SELECT USING (true);

-- 2) Private data: RLS on with NO policy = anonymous visitors see nothing
--    and cannot insert/update/delete.
ALTER TABLE customer   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- To undo (only if you need to redo the lab):
-- DROP POLICY "Public read access on product"  ON product;
-- DROP POLICY "Public read access on category" ON category;
-- ALTER TABLE product  DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE category DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE customer   DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "order"    DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_item DISABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION public.validate_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  it jsonb;
  computed_subtotal integer := 0;
  product_price integer;
  item_price integer;
  qty integer;
  slug_text text;
BEGIN
  IF jsonb_typeof(NEW.items) <> 'array' OR jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  FOR it IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    slug_text := it->>'slug';
    qty := COALESCE((it->>'quantity')::int, (it->>'qty')::int, 1);
    item_price := NULLIF(it->>'price','')::int;

    IF slug_text IS NULL OR qty <= 0 OR qty > 100 THEN
      RAISE EXCEPTION 'Invalid item entry';
    END IF;

    SELECT price INTO product_price
    FROM public.products
    WHERE slug = slug_text AND active = true;

    -- Prefer DB price (admin-managed catalog). Fall back to the price
    -- carried on the order item for products that live only in the
    -- code-based catalog. Reject only if neither is available.
    IF product_price IS NULL AND item_price IS NULL THEN
      RAISE EXCEPTION 'Missing price for item %', slug_text;
    END IF;

    computed_subtotal := computed_subtotal + (COALESCE(product_price, item_price) * qty);
  END LOOP;

  IF NEW.subtotal <> computed_subtotal THEN
    RAISE EXCEPTION 'Subtotal mismatch (expected %, got %)', computed_subtotal, NEW.subtotal;
  END IF;

  IF NEW.shipping_cost < 0 OR NEW.shipping_cost > 100000 THEN
    RAISE EXCEPTION 'Invalid shipping cost';
  END IF;

  IF NEW.total <> (computed_subtotal + NEW.shipping_cost) THEN
    RAISE EXCEPTION 'Total mismatch (expected %, got %)', computed_subtotal + NEW.shipping_cost, NEW.total;
  END IF;

  RETURN NEW;
END;
$$;

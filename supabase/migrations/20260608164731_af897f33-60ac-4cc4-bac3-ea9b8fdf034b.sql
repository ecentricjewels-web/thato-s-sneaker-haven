
-- 1) Lock down SECURITY DEFINER helper functions from public API roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, PUBLIC;
-- get_order_by_reference is intentionally callable by anon for the public order-tracking page;
-- it returns no PII (no customer name/phone/address). Keep EXECUTE for anon, authenticated.

-- 2) Server-side order total validation trigger (prevents price tampering on INSERT)
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
    IF slug_text IS NULL OR qty <= 0 OR qty > 100 THEN
      RAISE EXCEPTION 'Invalid item entry';
    END IF;

    SELECT price INTO product_price
    FROM public.products
    WHERE slug = slug_text AND active = true;

    IF product_price IS NULL THEN
      RAISE EXCEPTION 'Unknown or inactive product: %', slug_text;
    END IF;

    computed_subtotal := computed_subtotal + (product_price * qty);
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

REVOKE EXECUTE ON FUNCTION public.validate_order_totals() FROM anon, authenticated, PUBLIC;

DROP TRIGGER IF EXISTS validate_order_totals_trg ON public.orders;
CREATE TRIGGER validate_order_totals_trg
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.validate_order_totals();

-- 3) Block self-assignment of roles. Only service_role (server / admin code) may write user_roles.
DROP POLICY IF EXISTS "No client inserts on user_roles" ON public.user_roles;
CREATE POLICY "No client inserts on user_roles"
ON public.user_roles
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "No client updates on user_roles" ON public.user_roles;
CREATE POLICY "No client updates on user_roles"
ON public.user_roles
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "No client deletes on user_roles" ON public.user_roles;
CREATE POLICY "No client deletes on user_roles"
ON public.user_roles
FOR DELETE
TO anon, authenticated
USING (false);

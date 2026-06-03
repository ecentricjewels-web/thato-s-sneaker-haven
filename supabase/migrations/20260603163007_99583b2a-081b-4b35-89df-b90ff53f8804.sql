
CREATE OR REPLACE FUNCTION public.get_order_by_reference(_reference text)
RETURNS TABLE (
  reference text,
  status order_status,
  shipping_label text,
  items jsonb,
  subtotal integer,
  shipping_cost integer,
  total integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.reference, o.status, o.shipping_label, o.items, o.subtotal, o.shipping_cost, o.total, o.created_at, o.updated_at
  FROM public.orders o
  WHERE upper(trim(both '#' from o.reference)) = upper(trim(both '#' from _reference))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_by_reference(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_by_reference(text) TO anon, authenticated;

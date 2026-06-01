
-- Wishlists
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_slug)
);

GRANT SELECT, INSERT, DELETE ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own wishlist"
  ON public.wishlists FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users add to their own wishlist"
  ON public.wishlists FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users remove from their own wishlist"
  ON public.wishlists FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins view all wishlists"
  ON public.wishlists FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_slug ON public.wishlists(product_slug);

-- Allow guest + authenticated checkout into orders
GRANT INSERT ON public.orders TO anon, authenticated;

CREATE POLICY "Anyone can place an order"
  ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

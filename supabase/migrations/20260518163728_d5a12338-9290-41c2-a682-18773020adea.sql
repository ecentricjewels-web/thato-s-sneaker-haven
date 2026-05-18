DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;

CREATE POLICY "Admins can list product images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
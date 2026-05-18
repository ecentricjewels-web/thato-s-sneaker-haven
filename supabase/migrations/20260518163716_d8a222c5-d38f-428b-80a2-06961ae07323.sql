-- Set search_path on touch_updated_at
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

-- Revoke EXECUTE on internal SECURITY DEFINER functions from PUBLIC so they
-- can only be called from server-side / policy contexts.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
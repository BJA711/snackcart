-- =============================================================================
-- SnackCart Database Migration: 03_storage_policies.sql
-- Description: Supabase Storage bucket for product images and access control
-- =============================================================================

-- 1. Create product-images storage bucket if not present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- 2. Storage Policies

-- Public read access for product images
CREATE POLICY "Public read product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Admin write access for uploading product images
CREATE POLICY "Admin upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'product-images'
        AND public.is_admin()
    );

-- Admin update access for replacing product images
CREATE POLICY "Admin update product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'product-images'
        AND public.is_admin()
    );

-- Admin delete access for removing product images
CREATE POLICY "Admin delete product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'product-images'
        AND public.is_admin()
    );

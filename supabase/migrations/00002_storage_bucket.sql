-- Migration: Create storage bucket for job images
-- ============================================
-- UP
-- ============================================

-- Create the storage bucket for job images (publicly readable)
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-images', 'job-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload job images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'job-images'
    AND auth.role() = 'authenticated'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow anyone to view images
DO $$ BEGIN
  CREATE POLICY "Anyone can view job images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'job-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- DROP POLICY IF EXISTS "Anyone can view job images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can upload job images" ON storage.objects;
-- DELETE FROM storage.buckets WHERE id = 'job-images';

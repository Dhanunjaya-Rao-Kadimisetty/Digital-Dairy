-- ============================================================
-- Migration: Add photo/video attachment support to diary entries
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Add media_url column to diary_entries (nullable = optional)
alter table public.diary_entries
  add column if not exists media_url text default null;

-- 2. Create a storage bucket for diary media (no file size limit)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diary-media',
  'diary-media',
  false,
  null,  -- unlimited file size
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 3. Storage policies for diary-media bucket
drop policy if exists "storage_read_diary_media" on storage.objects;
create policy "storage_read_diary_media"
on storage.objects
for select
using (
  bucket_id = 'diary-media'
  and public.is_approved_user()
);

drop policy if exists "storage_insert_diary_media" on storage.objects;
create policy "storage_insert_diary_media"
on storage.objects
for insert
with check (
  bucket_id = 'diary-media'
  and public.is_approved_user()
);

drop policy if exists "storage_update_diary_media" on storage.objects;
create policy "storage_update_diary_media"
on storage.objects
for update
using (
  bucket_id = 'diary-media'
  and public.is_approved_user()
  and owner = auth.uid()
)
with check (
  bucket_id = 'diary-media'
  and public.is_approved_user()
  and owner = auth.uid()
);

drop policy if exists "storage_delete_diary_media" on storage.objects;
create policy "storage_delete_diary_media"
on storage.objects
for delete
using (
  bucket_id = 'diary-media'
  and public.is_approved_user()
  and owner = auth.uid()
);

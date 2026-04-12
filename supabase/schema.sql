create extension if not exists pgcrypto;

create table if not exists public.allowed_users (
  email text primary key,
  role text not null default 'member' check (role in ('member'))
);

insert into public.allowed_users (email, role)
values
  ('saidhanunjaya19@gmail.com', 'member'),
  ('bhargavasuthi@gmail.com', 'member')
on conflict (email) do update
set role = excluded.role;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'member' check (role in ('member')),
  avatar_url text
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  mood text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  author_id uuid not null references public.profiles (id) on delete cascade,
  visibility text not null default 'shared' check (visibility in ('shared', 'private'))
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.diary_entries (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.diary_entries (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  emoji text not null,
  constraint reactions_entry_user_unique unique (entry_id, user_id)
);

create table if not exists public.gallery_memories (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null,
  memory_date date not null,
  uploaded_by uuid not null references public.profiles (id) on delete cascade
);

create table if not exists public.voice_notes (
  id uuid primary key default gen_random_uuid(),
  audio_url text not null,
  title text not null,
  note text,
  uploaded_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.future_letters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  unlock_date date not null,
  created_by uuid not null references public.profiles (id) on delete cascade
);

create index if not exists diary_entries_author_id_idx on public.diary_entries (author_id);
create index if not exists diary_entries_created_at_idx on public.diary_entries (created_at desc);
create index if not exists diary_entries_mood_idx on public.diary_entries (mood);
create index if not exists diary_entries_visibility_idx on public.diary_entries (visibility);
create index if not exists comments_entry_id_idx on public.comments (entry_id);
create index if not exists reactions_entry_id_idx on public.reactions (entry_id);
create index if not exists gallery_memories_memory_date_idx on public.gallery_memories (memory_date desc);
create index if not exists voice_notes_created_at_idx on public.voice_notes (created_at desc);
create index if not exists future_letters_unlock_date_idx on public.future_letters (unlock_date asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists diary_entries_set_updated_at on public.diary_entries;
create trigger diary_entries_set_updated_at
before update on public.diary_entries
for each row
execute function public.set_updated_at();

-- Simplified role/approval logic
create or replace function public.is_approved_user()
returns boolean
language sql
stable
security definer
as $$
  select auth.uid() is not null;
$$;

-- Profile policies simplified
drop policy if exists "profiles_select_approved" on public.profiles;
create policy "profiles_select_approved"
on public.profiles
for select
using (auth.uid() is not null);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "diary_entries_select_accessible" on public.diary_entries;
create policy "diary_entries_select_accessible"
on public.diary_entries
for select
using (auth.uid() is not null);

drop policy if exists "diary_entries_insert_approved" on public.diary_entries;
create policy "diary_entries_insert_approved"
on public.diary_entries
for insert
with check (auth.uid() = author_id);

drop policy if exists "diary_entries_update_owner" on public.diary_entries;
create policy "diary_entries_update_owner"
on public.diary_entries
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "diary_entries_delete_owner" on public.diary_entries;
create policy "diary_entries_delete_owner"
on public.diary_entries
for delete
using (auth.uid() = author_id);

drop policy if exists "comments_select_accessible" on public.comments;
create policy "comments_select_accessible"
on public.comments
for select
using (auth.uid() is not null);

drop policy if exists "comments_insert_approved" on public.comments;
create policy "comments_insert_approved"
on public.comments
for insert
with check (auth.uid() = user_id);

drop policy if exists "comments_delete_owner" on public.comments;
create policy "comments_delete_owner"
on public.comments
for delete
using (auth.uid() = user_id);

drop policy if exists "reactions_select_accessible" on public.reactions;
create policy "reactions_select_accessible"
on public.reactions
for select
using (auth.uid() is not null);

drop policy if exists "reactions_insert_approved" on public.reactions;
create policy "reactions_insert_approved"
on public.reactions
for insert
with check (auth.uid() = user_id);

drop policy if exists "reactions_update_owner" on public.reactions;
create policy "reactions_update_owner"
on public.reactions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "reactions_delete_owner" on public.reactions;
create policy "reactions_delete_owner"
on public.reactions
for delete
using (auth.uid() = user_id);

drop policy if exists "gallery_memories_select_approved" on public.gallery_memories;
create policy "gallery_memories_select_approved"
on public.gallery_memories
for select
using (auth.uid() is not null);

drop policy if exists "gallery_memories_insert_owner" on public.gallery_memories;
create policy "gallery_memories_insert_owner"
on public.gallery_memories
for insert
with check (auth.uid() = uploaded_by);

drop policy if exists "gallery_memories_delete_owner" on public.gallery_memories;
create policy "gallery_memories_delete_owner"
on public.gallery_memories
for delete
using (auth.uid() = uploaded_by);

drop policy if exists "voice_notes_select_approved" on public.voice_notes;
create policy "voice_notes_select_approved"
on public.voice_notes
for select
using (auth.uid() is not null);

drop policy if exists "voice_notes_insert_owner" on public.voice_notes;
create policy "voice_notes_insert_owner"
on public.voice_notes
for insert
with check (auth.uid() = uploaded_by);

drop policy if exists "voice_notes_delete_owner" on public.voice_notes;
create policy "voice_notes_delete_owner"
on public.voice_notes
for delete
using (auth.uid() = uploaded_by);

drop policy if exists "future_letters_select_approved" on public.future_letters;
create policy "future_letters_select_approved"
on public.future_letters
for select
using (auth.uid() is not null);

drop policy if exists "future_letters_insert_owner" on public.future_letters;
create policy "future_letters_insert_owner"
on public.future_letters
for insert
with check (auth.uid() = created_by);

drop policy if exists "future_letters_delete_owner" on public.future_letters;
create policy "future_letters_delete_owner"
on public.future_letters
for delete
using (auth.uid() = created_by);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'gallery',
    'gallery',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'voice-notes',
    'voice-notes',
    false,
    52428800,
    array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "storage_read_gallery_and_voice" on storage.objects;
create policy "storage_read_gallery_and_voice"
on storage.objects
for select
using (
  bucket_id in ('gallery', 'voice-notes')
  and public.is_approved_user()
);

drop policy if exists "storage_insert_gallery_and_voice_owner" on storage.objects;
create policy "storage_insert_gallery_and_voice_owner"
on storage.objects
for insert
with check (
  bucket_id in ('gallery', 'voice-notes')
  and public.is_approved_user()
);

drop policy if exists "storage_update_gallery_and_voice_owner" on storage.objects;
create policy "storage_update_gallery_and_voice_owner"
on storage.objects
for update
using (
  bucket_id in ('gallery', 'voice-notes')
  and public.is_approved_user()
  and owner = auth.uid()
)
with check (
  bucket_id in ('gallery', 'voice-notes')
  and public.is_approved_user()
  and owner = auth.uid()
);

drop policy if exists "storage_delete_gallery_and_voice_owner" on storage.objects;
create policy "storage_delete_gallery_and_voice_owner"
on storage.objects
for delete
using (
  bucket_id in ('gallery', 'voice-notes')
  and public.is_approved_user()
  and owner = auth.uid()
);

-- Fix Reactions RLS
alter table public.reactions enable row level security;

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

-- Notifications Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  type text not null, -- 'diary_entry', 'comment', 'reaction', 'memory'
  entry_id uuid references public.diary_entries (id) on delete cascade,
  content text,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
on public.notifications
for select
using (auth.uid() = user_id);

create policy "notifications_insert_all"
on public.notifications
for insert
with check (true); -- Allow anyone to send a notification (logic handled in app)

create policy "notifications_update_own"
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notifications_delete_own"
on public.notifications
for delete
using (auth.uid() = user_id);

-- Add real-time to notifications
alter publication supabase_realtime add table public.notifications;

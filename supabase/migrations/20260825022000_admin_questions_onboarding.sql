-- Admin access, first-login onboarding, and dynamic laboratory questions.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;

insert into public.admin_users (user_id)
values ('a422254d-7a44-4e0e-a1eb-afdc52931e64')
on conflict (user_id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

alter table public.questions
  add column if not exists is_active boolean not null default true,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.questions
  alter column created_by set default auth.uid();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'questions_correct_answer_check'
      and conrelid = 'public.questions'::regclass
  ) then
    alter table public.questions
      add constraint questions_correct_answer_check
      check (correct_answer in ('A', 'B', 'C', 'D'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'questions_options_check'
      and conrelid = 'public.questions'::regclass
  ) then
    alter table public.questions
      add constraint questions_options_check
      check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4);
  end if;
end
$$;

create index if not exists questions_active_created_at_idx
  on public.questions (is_active, created_at desc);

create index if not exists questions_created_by_idx
  on public.questions (created_by);

drop trigger if exists update_questions_updated_at on public.questions;
create trigger update_questions_updated_at
before update on public.questions
for each row execute function public.update_updated_at_column();

drop policy if exists "Admin can manage questions" on public.questions;
drop policy if exists "Questions readable by authenticated" on public.questions;

create policy "Authenticated users can read active questions"
on public.questions
for select
to authenticated
using (is_active or (select public.is_admin()));

create policy "Admins can insert questions"
on public.questions
for insert
to authenticated
with check (
  (select public.is_admin())
  and created_by = (select auth.uid())
);

create policy "Admins can update questions"
on public.questions
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select on public.questions to authenticated;
grant insert, update on public.questions to authenticated;
revoke delete on public.questions from anon, authenticated;
grant usage, select on sequence public.questions_id_seq to authenticated;

revoke all on table public.questions from anon, authenticated;
grant select, insert, update on table public.questions to authenticated;

revoke all on sequence public.questions_id_seq from anon, authenticated;
grant usage, select on sequence public.questions_id_seq to authenticated;


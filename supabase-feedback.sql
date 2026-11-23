-- Run once in Supabase SQL Editor to enable optional student feedback.
-- Responses contain no student name, school, score or registration reference.
create table if not exists public.student_feedback (
  id uuid primary key,
  content_version text not null,
  choice text not null check (choice in ('more_confident','no_change','more_confused','own_words')),
  message text not null default '',
  language text not null check (language in ('uz','en')),
  created_at timestamptz not null default now(),
  constraint student_feedback_message_check check (
    (choice = 'own_words' and char_length(btrim(message)) between 1 and 1000)
    or (choice <> 'own_words' and message = '')
  )
);
create index if not exists student_feedback_created_at_idx on public.student_feedback(created_at);
alter table public.student_feedback enable row level security;
revoke all on public.student_feedback from anon, authenticated;
grant select, insert on public.student_feedback to service_role;

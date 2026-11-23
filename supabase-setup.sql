-- Run once in your Supabase project's SQL Editor.
create table if not exists public.cup_comments (
 id bigint generated always as identity primary key,
 manager_id bigint not null,
 manager_name text not null,
 visitor_id uuid not null,
 body text not null check (char_length(body) between 1 and 500),
 parent_id bigint references public.cup_comments(id) on delete cascade,
 created_at timestamptz not null default now()
);
create index if not exists cup_comments_created_idx on public.cup_comments(created_at desc);
create index if not exists cup_comments_visitor_idx on public.cup_comments(visitor_id,created_at desc);
create table if not exists public.cup_likes (
 comment_id bigint not null references public.cup_comments(id) on delete cascade,
 visitor_id uuid not null,
 created_at timestamptz not null default now(),
 primary key(comment_id,visitor_id)
);
-- No direct browser access. All reads/writes go through Netlify Functions.
alter table public.cup_comments enable row level security;
alter table public.cup_likes enable row level security;
revoke all on public.cup_comments from anon,authenticated;
revoke all on public.cup_likes from anon,authenticated;

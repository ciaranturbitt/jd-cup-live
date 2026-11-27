-- Review and run BEFORE deploying the round-aware website. Existing rows are quarter-final chat by default.
BEGIN;
ALTER TABLE public.cup_comments ADD COLUMN IF NOT EXISTS round_id text;
UPDATE public.cup_comments SET round_id='quarter-finals' WHERE round_id IS NULL;
ALTER TABLE public.cup_comments ALTER COLUMN round_id SET DEFAULT 'quarter-finals';
ALTER TABLE public.cup_comments ALTER COLUMN round_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS cup_comments_round_created_idx ON public.cup_comments(round_id,created_at DESC);
COMMIT;

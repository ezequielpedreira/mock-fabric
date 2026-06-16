CREATE TABLE public.user_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'training',
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_answers_user_id ON public.user_answers(user_id);
CREATE INDEX idx_user_answers_user_question ON public.user_answers(user_id, question_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_answers TO authenticated;
GRANT ALL ON public.user_answers TO service_role;

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own answers"
  ON public.user_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answers"
  ON public.user_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers"
  ON public.user_answers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers"
  ON public.user_answers FOR DELETE
  USING (auth.uid() = user_id);
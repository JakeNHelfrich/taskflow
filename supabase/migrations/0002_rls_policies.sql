-- Row Level Security (RLS) Policies
-- Ensures users can only access their own data

-- ============================================================================
-- HELPER FUNCTION: Extract Clerk User ID from JWT
-- Clerk passes the user ID in the JWT claims under 'sub'
-- ============================================================================
CREATE OR REPLACE FUNCTION auth.clerk_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claims', true)::json->>'sub',
      current_setting('request.jwt.claim.sub', true)
    ),
    ''
  )::TEXT;
$$ LANGUAGE SQL STABLE;

-- ============================================================================
-- HELPER FUNCTION: Get internal user ID from Clerk ID
-- Maps Clerk's external user ID to our internal UUID
-- ============================================================================
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE clerk_id = auth.clerk_user_id();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================================================
-- PROFILES TABLE RLS
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (clerk_id = auth.clerk_user_id());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (clerk_id = auth.clerk_user_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (clerk_id = auth.clerk_user_id())
  WITH CHECK (clerk_id = auth.clerk_user_id());

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (clerk_id = auth.clerk_user_id());

-- ============================================================================
-- PROJECTS TABLE RLS
-- ============================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (user_id = auth.user_id());

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (user_id = auth.user_id());

-- ============================================================================
-- LABELS TABLE RLS
-- ============================================================================
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own labels"
  ON labels FOR SELECT
  USING (user_id = auth.user_id());

CREATE POLICY "Users can insert their own labels"
  ON labels FOR INSERT
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can update their own labels"
  ON labels FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can delete their own labels"
  ON labels FOR DELETE
  USING (user_id = auth.user_id());

-- ============================================================================
-- TASKS TABLE RLS
-- ============================================================================
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (user_id = auth.user_id());

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (user_id = auth.user_id());

-- ============================================================================
-- TASK_LABELS TABLE RLS
-- Users can manage labels on their own tasks
-- ============================================================================
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view labels on their own tasks"
  ON task_labels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_labels.task_id
      AND tasks.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can add labels to their own tasks"
  ON task_labels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_labels.task_id
      AND tasks.user_id = auth.user_id()
    )
    AND
    EXISTS (
      SELECT 1 FROM labels
      WHERE labels.id = task_labels.label_id
      AND labels.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can remove labels from their own tasks"
  ON task_labels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_labels.task_id
      AND tasks.user_id = auth.user_id()
    )
  );

-- ============================================================================
-- TIME_BLOCKS TABLE RLS
-- ============================================================================
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own time blocks"
  ON time_blocks FOR SELECT
  USING (user_id = auth.user_id());

CREATE POLICY "Users can insert their own time blocks"
  ON time_blocks FOR INSERT
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can update their own time blocks"
  ON time_blocks FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can delete their own time blocks"
  ON time_blocks FOR DELETE
  USING (user_id = auth.user_id());

-- ============================================================================
-- TIME_BLOCK_TASKS TABLE RLS
-- Users can manage tasks in their own time blocks
-- ============================================================================
ALTER TABLE time_block_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in their own time blocks"
  ON time_block_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM time_blocks
      WHERE time_blocks.id = time_block_tasks.time_block_id
      AND time_blocks.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can add tasks to their own time blocks"
  ON time_block_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM time_blocks
      WHERE time_blocks.id = time_block_tasks.time_block_id
      AND time_blocks.user_id = auth.user_id()
    )
    AND
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = time_block_tasks.task_id
      AND tasks.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can update tasks in their own time blocks"
  ON time_block_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM time_blocks
      WHERE time_blocks.id = time_block_tasks.time_block_id
      AND time_blocks.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM time_blocks
      WHERE time_blocks.id = time_block_tasks.time_block_id
      AND time_blocks.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can remove tasks from their own time blocks"
  ON time_block_tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM time_blocks
      WHERE time_blocks.id = time_block_tasks.time_block_id
      AND time_blocks.user_id = auth.user_id()
    )
  );

-- ============================================================================
-- HABITS TABLE RLS
-- ============================================================================
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (user_id = auth.user_id());

CREATE POLICY "Users can insert their own habits"
  ON habits FOR INSERT
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (user_id = auth.user_id());

-- ============================================================================
-- HABIT_COMPLETIONS TABLE RLS
-- Users can manage completions for their own habits
-- ============================================================================
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habit completions"
  ON habit_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can insert their own habit completions"
  ON habit_completions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can update their own habit completions"
  ON habit_completions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.user_id()
    )
  );

CREATE POLICY "Users can delete their own habit completions"
  ON habit_completions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.user_id()
    )
  );

-- ============================================================================
-- FOCUS_SESSIONS TABLE RLS
-- ============================================================================
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own focus sessions"
  ON focus_sessions FOR SELECT
  USING (user_id = auth.user_id());

CREATE POLICY "Users can insert their own focus sessions"
  ON focus_sessions FOR INSERT
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can update their own focus sessions"
  ON focus_sessions FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Users can delete their own focus sessions"
  ON focus_sessions FOR DELETE
  USING (user_id = auth.user_id());

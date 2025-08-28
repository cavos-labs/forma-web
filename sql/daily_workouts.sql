-- Daily Workouts Table for Gym Calendar
-- Simple table to store workout text for each day

CREATE TABLE IF NOT EXISTS daily_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL,
    workout_text TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(gym_id, workout_date)
);

-- Row Level Security (RLS) policies
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;

-- Policy: Gym administrators can only access workouts for their gym
CREATE POLICY "Gym administrators can manage their workouts" ON daily_workouts
    FOR ALL USING (
        gym_id IN (
            SELECT ga.gym_id
            FROM gym_administrators ga
            WHERE ga.user_id = auth.uid()
        )
    );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_workouts_gym_date ON daily_workouts(gym_id, workout_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_workouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_daily_workouts_updated_at
    BEFORE UPDATE ON daily_workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_workouts_updated_at();
-- Add responsibles column to tracker_modules
ALTER TABLE public.tracker_modules
ADD COLUMN IF NOT EXISTS responsibles text;

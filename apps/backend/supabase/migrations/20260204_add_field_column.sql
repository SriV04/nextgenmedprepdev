-- Add field column to university_stations table
ALTER TABLE prometheus.university_stations
ADD COLUMN IF NOT EXISTS field text;

-- Add field column to university_tag_configs table (not tags table)
-- The field distinguishes whether this tag assignment is for medicine or dentistry
ALTER TABLE prometheus.university_tag_configs
ADD COLUMN IF NOT EXISTS field text;

-- Add comment to explain the field column
COMMENT ON COLUMN prometheus.university_stations.field IS 'Distinguishes between medicine and dentistry stations';
COMMENT ON COLUMN prometheus.university_tag_configs.field IS 'Distinguishes whether this tag assignment is for medicine or dentistry';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_university_stations_field ON prometheus.university_stations(field);
CREATE INDEX IF NOT EXISTS idx_university_tag_configs_field ON prometheus.university_tag_configs(field);

-- Create the health check table
CREATE TABLE IF NOT EXISTS "_health_check" (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a stored procedure for creating the health check table
CREATE OR REPLACE FUNCTION create_health_check_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS "_health_check" (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Create the categories table
CREATE TABLE IF NOT EXISTS "categories" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT
);

-- Create the tasks table with foreign key to categories
CREATE TABLE IF NOT EXISTS "tasks" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL
);

-- Create index on category_id for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);

-- Create indexes on common query fields
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create version function to check database connection
CREATE OR REPLACE FUNCTION version()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('server_version');
END;
$$ LANGUAGE plpgsql; 
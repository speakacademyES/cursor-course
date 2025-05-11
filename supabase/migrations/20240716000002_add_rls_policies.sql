-- Add RLS policies to allow anonymous reads and writes
-- This ensures that the anon role can access the tables we've created

-- Create policies only if they don't exist using DO blocks

-- Allow anonymous read access to categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' 
        AND policyname = 'Allow anonymous read access to categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous read access to categories" 
                ON public.categories 
                FOR SELECT 
                TO anon
                USING (true)';
    END IF;
END
$$;

-- Allow anonymous read access to health check table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = '_health_check' 
        AND policyname = 'Allow anonymous read access to health check'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous read access to health check" 
                ON public._health_check 
                FOR SELECT 
                TO anon
                USING (true)';
    END IF;
END
$$;

-- Allow anonymous insert to health check table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = '_health_check' 
        AND policyname = 'Allow anonymous insert to health check'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous insert to health check" 
                ON public._health_check 
                FOR INSERT 
                TO anon
                WITH CHECK (true)';
    END IF;
END
$$;

-- Allow anonymous read access to tasks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' 
        AND policyname = 'Allow anonymous read access to tasks'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous read access to tasks" 
                ON public.tasks 
                FOR SELECT 
                TO anon
                USING (true)';
    END IF;
END
$$;

-- Note: In a production application, you would typically want more restrictive policies
-- These policies are intentionally permissive for the development and testing phase
-- For production, consider row-level security based on user authentication and authorization 
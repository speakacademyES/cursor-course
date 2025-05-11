-- Add INSERT and UPDATE policies for tasks table

-- Allow anonymous insert access to tasks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' 
        AND policyname = 'Allow anonymous insert access to tasks'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous insert access to tasks" 
                ON public.tasks 
                FOR INSERT 
                TO anon
                WITH CHECK (true)';
    END IF;
END
$$;

-- Allow anonymous update access to tasks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tasks' 
        AND policyname = 'Allow anonymous update access to tasks'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous update access to tasks" 
                ON public.tasks 
                FOR UPDATE 
                TO anon
                USING (true)
                WITH CHECK (true)';
    END IF;
END
$$;

-- Add a comment explaining these are for testing purposes
COMMENT ON POLICY "Allow anonymous insert access to tasks" ON public.tasks IS 'Allows anonymous users to insert tasks (for testing purposes)';
COMMENT ON POLICY "Allow anonymous update access to tasks" ON public.tasks IS 'Allows anonymous users to update tasks (for testing purposes)';

-- Note: In a production environment, you would implement stricter RLS policies
-- These permissive policies are intended for development and testing only 
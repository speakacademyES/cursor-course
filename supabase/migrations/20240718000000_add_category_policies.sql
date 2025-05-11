-- Add INSERT, UPDATE, and DELETE policies for categories table

-- Allow anonymous insert access to categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' 
        AND policyname = 'Allow anonymous insert access to categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous insert access to categories" 
                ON public.categories 
                FOR INSERT 
                TO anon
                WITH CHECK (true)';
    END IF;
END
$$;

-- Allow anonymous update access to categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' 
        AND policyname = 'Allow anonymous update access to categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous update access to categories" 
                ON public.categories 
                FOR UPDATE 
                TO anon
                USING (true)
                WITH CHECK (true)';
    END IF;
END
$$;

-- Allow anonymous delete access to categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' 
        AND policyname = 'Allow anonymous delete access to categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Allow anonymous delete access to categories" 
                ON public.categories 
                FOR DELETE 
                TO anon
                USING (true)';
    END IF;
END
$$;

-- Add a comment explaining these are for testing purposes
COMMENT ON POLICY "Allow anonymous insert access to categories" ON public.categories IS 'Allows anonymous users to insert categories (for testing purposes)';
COMMENT ON POLICY "Allow anonymous update access to categories" ON public.categories IS 'Allows anonymous users to update categories (for testing purposes)';
COMMENT ON POLICY "Allow anonymous delete access to categories" ON public.categories IS 'Allows anonymous users to delete categories (for testing purposes)';

-- Note: In a production environment, you would implement stricter RLS policies
-- These permissive policies are intended for development and testing only 
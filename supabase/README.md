# Supabase Setup

This directory contains Supabase configurations and migrations for the Todo App.

## Migrations

The `migrations` directory contains SQL files that set up and modify the database schema:

- `20240716000000_create_tables.sql`: Creates the initial tables (categories, tasks)
- `20240716000001_seed_categories.sql`: Seeds the database with initial categories
- `20240716000002_add_rls_policies.sql`: Adds Row-Level Security policies for anonymous access

## Running Migrations

### Local Development

When developing locally with Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Start Supabase locally (if not running)
supabase start

# Apply migrations
supabase db reset
# OR
supabase migration up
```

### With Supabase Cloud

If you're using Supabase Cloud:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file manually OR use the Supabase CLI:

```bash
# Link to your project (first time only)
supabase link --project-ref your-project-ref

# Push migrations to your project
supabase db push
```

## Verifying Setup

After running migrations, you can use the `/test` page in the application to verify that the database connection is working correctly.

## Database Schema

### Categories Table
- `id`: UUID primary key
- `created_at`: Timestamp when created
- `name`: Category name (required)
- `description`: Optional description
- `color`: Optional color code (hex)

### Tasks Table
- `id`: UUID primary key
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when updated
- `title`: Task title (required)
- `description`: Optional description
- `status`: Task status ('pending', 'in-progress', 'completed')
- `priority`: Task priority ('low', 'medium', 'high')
- `due_date`: Optional deadline
- `category_id`: Foreign key to categories table

## Row-Level Security (RLS)

The database uses Supabase Row-Level Security for access control:

1. RLS is enabled on all tables (`categories`, `tasks`)
2. Policies allow anonymous read access to categories and tasks
3. The health check table allows both read and write operations for testing
4. In production, you should implement more restrictive policies 
-- Add some initial categories for testing
INSERT INTO categories (name, color, description)
VALUES 
  ('Work', '#4169e1', 'Work-related tasks and projects'),
  ('Personal', '#ff7f50', 'Personal tasks and errands'),
  ('Shopping', '#32cd32', 'Shopping list and items to buy'),
  ('Health', '#ff4500', 'Health and fitness related tasks'),
  ('Learning', '#9370db', 'Educational tasks and courses')
ON CONFLICT (id) DO NOTHING; 
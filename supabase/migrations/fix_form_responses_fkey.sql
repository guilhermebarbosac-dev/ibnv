-- Drop existing foreign key constraint
ALTER TABLE form_responses DROP CONSTRAINT IF EXISTS form_responses_form_id_fkey;

-- Recreate the foreign key constraint with the correct reference
ALTER TABLE form_responses 
ADD CONSTRAINT form_responses_form_id_fkey 
FOREIGN KEY (form_id) 
REFERENCES dynamic_forms(id) 
ON DELETE CASCADE; 
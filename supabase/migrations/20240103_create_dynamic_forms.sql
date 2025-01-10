-- Create dynamic_forms table
CREATE TABLE IF NOT EXISTS dynamic_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    fields JSONB NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create form_responses table
CREATE TABLE IF NOT EXISTS form_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES dynamic_forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_form_responses_form_id ON form_responses(form_id);
CREATE INDEX IF NOT EXISTS idx_dynamic_forms_created_at ON dynamic_forms(created_at);

-- Add RLS policies
ALTER TABLE dynamic_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Policies for dynamic_forms
CREATE POLICY "Allow public read access to active forms" ON dynamic_forms
    FOR SELECT
    USING (active = true);

CREATE POLICY "Allow authenticated users to manage forms" ON dynamic_forms
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Policies for form_responses
CREATE POLICY "Allow public to submit responses" ON form_responses
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM dynamic_forms
            WHERE id = form_id
            AND active = true
        )
    );

CREATE POLICY "Allow authenticated users to view responses" ON form_responses
    FOR SELECT
    USING (auth.role() = 'authenticated');

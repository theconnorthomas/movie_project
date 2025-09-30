# Supabase Database Schema

This file contains the SQL schema for the Film Distribution Hub application.

## Tables

### 1. users
Extends Supabase auth.users with additional profile information.

```sql
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('producer', 'distributor', 'sales_agent', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile and profiles of others
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT
    USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = id);
```

### 2. films
Stores film information and metadata.

```sql
CREATE TABLE films (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    genre TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_distribution', 'distributed', 'archived')),
    budget DECIMAL(12,2) DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE films ENABLE ROW LEVEL SECURITY;

-- Users can read all films
CREATE POLICY "Anyone can view films" ON films
    FOR SELECT
    USING (true);

-- Users can only manage their own films
CREATE POLICY "Users can manage own films" ON films
    FOR ALL
    USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_films_user_id ON films(user_id);
CREATE INDEX idx_films_status ON films(status);
```

### 3. distributions
Stores distribution deal information.

```sql
CREATE TABLE distributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    film_id UUID REFERENCES films(id) ON DELETE CASCADE NOT NULL,
    distributor_name TEXT NOT NULL,
    territory TEXT NOT NULL,
    distribution_type TEXT NOT NULL CHECK (distribution_type IN ('theatrical', 'streaming', 'digital', 'home_video')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    revenue_share DECIMAL(5,2) NOT NULL CHECK (revenue_share >= 0 AND revenue_share <= 100),
    guaranteed_minimum DECIMAL(12,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'signed', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;

-- Users can read all distributions
CREATE POLICY "Anyone can view distributions" ON distributions
    FOR SELECT
    USING (true);

-- Users can only manage distributions for their own films
CREATE POLICY "Users can manage distributions for own films" ON distributions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM films
            WHERE films.id = distributions.film_id
            AND films.user_id = auth.uid()
        )
    );

-- Create indexes for performance
CREATE INDEX idx_distributions_film_id ON distributions(film_id);
CREATE INDEX idx_distributions_status ON distributions(status);
```

## Triggers

### Update timestamps
Automatically update the `updated_at` timestamp when records are modified.

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Triggers for films table
CREATE TRIGGER update_films_updated_at
    BEFORE UPDATE ON films
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for distributions table
CREATE TRIGGER update_distributions_updated_at
    BEFORE UPDATE ON distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Functions

### Handle new user signup
Automatically create a user profile when someone signs up.

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'producer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

## Sample Data

### Insert sample data for development
```sql
-- Insert sample users (assuming auth.users already exist)
INSERT INTO users (id, email, full_name, role) VALUES 
(gen_random_uuid(), 'producer@example.com', 'John Producer', 'producer'),
(gen_random_uuid(), 'distributor@example.com', 'Jane Distributor', 'distributor');

-- Insert sample films
INSERT INTO films (title, director, genre, release_year, duration_minutes, description, status, budget, revenue, user_id) VALUES 
('The Great Adventure', 'John Smith', 'Action', 2023, 120, 'An epic adventure film about courage and friendship.', 'distributed', 5000000, 7500000, (SELECT id FROM users WHERE email = 'producer@example.com' LIMIT 1)),
('Love in Paris', 'Marie Dubois', 'Romance', 2023, 95, 'A romantic comedy set in the beautiful city of Paris.', 'in_distribution', 2000000, 3200000, (SELECT id FROM users WHERE email = 'producer@example.com' LIMIT 1)),
('Mystery of the Night', 'Robert Johnson', 'Thriller', 2024, 110, 'A thrilling mystery that keeps you on the edge of your seat.', 'draft', 3000000, 0, (SELECT id FROM users WHERE email = 'producer@example.com' LIMIT 1));

-- Insert sample distributions
INSERT INTO distributions (film_id, distributor_name, territory, distribution_type, start_date, end_date, revenue_share, guaranteed_minimum, status) VALUES 
((SELECT id FROM films WHERE title = 'The Great Adventure' LIMIT 1), 'Global Cinema Corp', 'North America', 'theatrical', '2023-06-01', '2023-12-31', 70.0, 1000000, 'completed'),
((SELECT id FROM films WHERE title = 'The Great Adventure' LIMIT 1), 'StreamMax', 'Worldwide', 'streaming', '2024-01-01', '2026-12-31', 60.0, 500000, 'active'),
((SELECT id FROM films WHERE title = 'Love in Paris' LIMIT 1), 'European Films Ltd', 'Europe', 'theatrical', '2023-09-15', '2024-03-15', 75.0, 800000, 'active');
```

## Setup Instructions

1. Create a new Supabase project
2. Run the above SQL in the Supabase SQL editor
3. Update your `.env` file with your Supabase URL and anon key
4. Enable authentication in your Supabase project
5. Configure email authentication or other auth providers as needed

## Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
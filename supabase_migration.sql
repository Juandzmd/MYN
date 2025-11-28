-- Migration Script: Update profiles table with new registration fields
-- This script is safe to run on an existing database

-- Add new columns to profiles table (if they don't exist)
DO $$ 
BEGIN
    -- Add first_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='first_name') THEN
        ALTER TABLE profiles ADD COLUMN first_name text;
    END IF;

    -- Add last_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='last_name') THEN
        ALTER TABLE profiles ADD COLUMN last_name text;
    END IF;

    -- Add phone column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE profiles ADD COLUMN phone text;
    END IF;

    -- Add region column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='region') THEN
        ALTER TABLE profiles ADD COLUMN region text;
    END IF;

    -- Add commune column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='commune') THEN
        ALTER TABLE profiles ADD COLUMN commune text;
    END IF;

    -- Add street_address column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='street_address') THEN
        ALTER TABLE profiles ADD COLUMN street_address text;
    END IF;
END $$;

-- Migrate existing full_name data to first_name (if full_name exists and has data)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='profiles' AND column_name='full_name') THEN
        UPDATE profiles 
        SET first_name = split_part(full_name, ' ', 1),
            last_name = CASE 
                WHEN full_name LIKE '% %' THEN substring(full_name from position(' ' in full_name) + 1)
                ELSE ''
            END
        WHERE full_name IS NOT NULL AND first_name IS NULL;
    END IF;
END $$;

-- Update the trigger function to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    phone, 
    region, 
    commune, 
    street_address, 
    role, 
    avatar_url
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'region',
    new.raw_user_meta_data->>'commune',
    new.raw_user_meta_data->>'street_address',
    'user', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

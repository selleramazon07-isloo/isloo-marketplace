/*
  # Auto-create profile and wallet on user signup

  1. New Functions
    - `handle_new_user()`: Trigger function that:
      1. Inserts a profile row using auth.users data (id, email, raw_user_meta_data for full_name/phone)
      2. Inserts a wallet row for the new profile with balance 0

  2. New Triggers
    - `on_auth_user_created`: AFTER INSERT on auth.users, calls handle_new_user()

  3. Important Notes
    - Uses raw_user_meta_data to extract full_name and phone from signup metadata
    - The profile id matches auth.users id exactly (1:1 relationship)
    - Wallet is created with default balance 0 and status 'active'
    - SECURITY DEFINER is used so the function runs with elevated privileges to insert into profiles/wallets
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );

  -- Create wallet for the new user
  INSERT INTO public.wallets (user_id, balance, status)
  VALUES (NEW.id, 0, 'active');

  RETURN NEW;
END;
$$;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

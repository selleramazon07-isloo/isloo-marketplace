/*
  # Create listings table for Isloo.com marketplace

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `title` (text, required) - listing title
      - `description` (text) - listing description
      - `price` (numeric) - price in PKR
      - `category` (text) - product category
      - `location` (text) - seller location in Islamabad
      - `image_url` (text) - product image URL
      - `seller_name` (text) - name of the seller
      - `seller_email` (text) - seller contact email
      - `seller_phone` (text) - seller phone number
      - `is_featured` (boolean) - whether listing is featured
      - `created_at` (timestamptz)
      - `user_id` (uuid, nullable) - optional auth link

  2. Security
    - Enable RLS on `listings` table
    - Public SELECT policy (marketplace listings are publicly visible)
    - Authenticated INSERT policy (only logged-in users can post)
    - Owner UPDATE/DELETE policies
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  price numeric DEFAULT 0,
  category text DEFAULT 'General',
  location text DEFAULT 'Islamabad',
  image_url text DEFAULT '',
  seller_name text NOT NULL,
  seller_email text DEFAULT '',
  seller_phone text DEFAULT '',
  is_featured boolean DEFAULT false,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings"
  ON listings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS listings_category_idx ON listings(category);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings(created_at DESC);

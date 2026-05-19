/*
  # Fix RLS: Allow anonymous listing creation

  1. Security Changes
    - Drop the restrictive INSERT policy that requires auth.uid() = user_id
    - Add a new INSERT policy allowing both anon and authenticated users to create listings
    - This enables the "Post Ad" feature without requiring login
    - UPDATE and DELETE policies remain owner-only for security

  2. Important Notes
    - The marketplace allows anyone to post ads (common for classifieds platforms)
    - user_id is nullable, so anonymous posts are supported
    - Rate limiting should be handled at the application level
*/

DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;

CREATE POLICY "Anyone can create listings"
  ON listings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

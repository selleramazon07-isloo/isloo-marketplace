/*
  # Add subcategory column to listings table

  1. Modified Tables
    - `listings`
      - Added `subcategory` (text, default '') - subcategory within the main category
      - e.g. category='Vehicles', subcategory='Cars'

  2. Security
    - No RLS changes needed - subcategory is just another filterable column

  3. Important Notes
    - Default value is empty string so existing rows are unaffected
    - The subcategory is optional and works alongside the existing category column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE listings ADD COLUMN subcategory text DEFAULT '';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS listings_subcategory_idx ON listings(subcategory);
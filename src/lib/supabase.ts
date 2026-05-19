import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

export const CATEGORIES = [
  {
    name: "Property",
    subcategories: ["Houses", "Plots", "Commercial"],
  },
  {
    name: "Vehicles",
    subcategories: ["Cars", "Bikes", "Rentals"],
  },
  {
    name: "Marketplace",
    subcategories: ["Electronics", "Furniture", "Mobiles"],
  },
  {
    name: "More",
    subcategories: ["Services", "Jobs", "Miscellaneous"],
  },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];
export type SubcategoryName = (typeof CATEGORIES)[number]["subcategories"][number];

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  location: string;
  image_url: string;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  is_featured: boolean;
  user_id: string | null;
  created_at: string;
};

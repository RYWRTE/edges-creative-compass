// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hyjkyjyrjqtauywsiife.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5amt5anlyanF0YXV5d3NpaWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4Njg2MjUsImV4cCI6MjA1OTQ0NDYyNX0.SoT2ht32PJTEY5zFE8ZD32xIvjwSaBT_17uyemoTTL8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
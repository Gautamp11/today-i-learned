import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jyssumxxzimhjkteedhc.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5c3N1bXh4emltaGprdGVlZGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NTA0MjMsImV4cCI6MjA0MjQyNjQyM30.2gOxLiCDTtgU8UJPjZTaJFj9hL_HrojJCCiV3xRkeTw";

const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://lngdvxlzuxjxxtrkrihm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZ2R2eGx6dXhqeHh0cmtyaWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDY5NTQsImV4cCI6MjA2MjI4Mjk1NH0.IsuYbFxYnjldbSjV2-qP6XUdj2sQJNEznyVBA4HZFac";

// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

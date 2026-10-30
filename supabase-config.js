const SUPABASE_URL = "https://tlcmismeirypsyhwrwiw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsY21pc21laXJ5cHN5aHdyd2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDk4NzksImV4cCI6MjEwODg4NTg3OX0.LG4PI5-1HW3jL0DkwY8SahS6dxNHD0kBpq48D8goUaM";

try {
    if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
        window.cropLandSupabase = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );
    } else {
        window.cropLandSupabase = null;
    }
} catch (e) {
    console.warn("Supabase client initialization skipped:", e);
    window.cropLandSupabase = null;
}

window.CROP_LAND_AI_URL = `${SUPABASE_URL}/functions/v1/chat`;

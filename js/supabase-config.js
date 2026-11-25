/* Isolated Supabase configuration for Dr. Sandesh Mahesh.
   IMPORTANT:
   1. NEVER place a service_role / secret key in frontend code. Only use the public anon/publishable key.
   2. Verify Dr. Sandesh Mahesh's dedicated doctorId UUID in your Supabase project before enabling live writes.
   3. Never reuse another doctor's doctorId or doctorSlug. */
window.SUPABASE_CONFIG = {
  url: "",                               // REPLACE with your Supabase project URL (e.g. https://xxxx.supabase.co)
  anonKey: "",                           // REPLACE with your Supabase publishable/anon key
  doctorSlug: "sandesh-mahesh",          // Verify slug matches public.doctors.slug for Dr. Sandesh Mahesh
  doctorId: ""                           // REPLACE with Dr. Sandesh Mahesh's verified UUID from public.doctors
};

window.isSupabaseConfigured = function () {
  var c = window.SUPABASE_CONFIG;
  return !!(c && c.url && c.anonKey && c.doctorId);
};

window.getSupabase = function () {
  if (!window.isSupabaseConfigured() || !window.supabase) return null;
  if (!window._sb) window._sb = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
  return window._sb;
};

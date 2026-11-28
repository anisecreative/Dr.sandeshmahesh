/* ANISE central Supabase project (shared by all ANISE doctor sites). Publishable key is public by design;
   database access is restricted by Row Level Security.
   NEVER put a service_role or secret key in this browser file.
   This site's data is isolated by doctorId / doctorSlug (Dr. Sandesh Mahesh). Never reuse another doctor's values. */
window.SUPABASE_CONFIG = {
  url: "https://hlgqypkyrvdhykezmuzd.supabase.co",
  anonKey: "sb_publishable_G13l3kO1x5suI4yQL76nUA_7i600Fik",
  doctorSlug: "sandesh-mahesh",
  doctorId: "043e0b43-c82c-4bb6-bcaf-7dbb35ec9a1d"
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

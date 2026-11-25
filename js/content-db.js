/* Public read access scoped strictly to Dr. Sandesh Mahesh's doctorId. Fails soft when Supabase is not configured yet. */
window.ContentDB = (function () {
  function base(t) {
    var sb = window.getSupabase();
    return sb ? sb.from(t).select("*").eq("doctor_id", window.SUPABASE_CONFIG.doctorId) : null;
  }
  async function run(b) {
    if (!b) return [];
    try { var r = await b; return r.error || !r.data ? [] : r.data; } catch (e) { return []; }
  }
  return {
    articles: function () { var b = base("educational_content"); return run(b && b.eq("status", "published").order("published_at", { ascending: false })); },
    article: async function (slug) { var b = base("educational_content"); var d = await run(b && b.eq("slug", slug).eq("status", "published").limit(1)); return d[0] || null; },
    campaign: async function (slug) { var b = base("reel_campaigns"); var d = await run(b && b.eq("slug", slug).eq("status", "published").limit(1)); return d[0] || null; },
    videos: function () { var b = base("youtube_videos"); return run(b && b.eq("visible", true).order("sort_order")); },
    insights: function () { var b = base("patient_insights"); return run(b && b.eq("status", "published").order("published_at", { ascending: false })); },
    insight: async function (slug) { var b = base("patient_insights"); var d = await run(b && b.eq("slug", slug).eq("status", "published").limit(1)); return d[0] || null; }
  };
})();

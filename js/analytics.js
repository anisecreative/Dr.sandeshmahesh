/* Anonymous analytics via RPC: event type, path, and UTM only. Zero personal or health data. */
(function () {
  var p = new URLSearchParams(location.search);
  var keys = ["utm_source", "utm_medium", "utm_campaign"];
  keys.forEach(function (k) { if (p.get(k)) { try { sessionStorage.setItem(k, p.get(k).slice(0, 80)); } catch (e) {} } });
  function utm(k) { try { return sessionStorage.getItem(k) || ""; } catch (e) { return ""; } }
  window.utmParams = function () { var o = {}; keys.forEach(function (k) { if (utm(k)) o[k] = utm(k); }); return o; };
  window.trackEvent = function (type) {
    var sb = window.getSupabase && window.getSupabase();
    if (!sb || navigator.doNotTrack === "1") return;
    sb.rpc("log_site_event", {
      p_doctor_slug: window.SUPABASE_CONFIG.doctorSlug,
      p_event: type,
      p_path: location.pathname,
      p_source: utm("utm_source"),
      p_medium: utm("utm_medium"),
      p_campaign: utm("utm_campaign")
    }).then(function () {}, function () {});
  };
  window.trackEvent("page_view");
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) window.trackEvent(el.getAttribute("data-track"));
  });
})();

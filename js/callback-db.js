/* Callback / WhatsApp enquiry and check-in leads saved via rate-limited Supabase RPCs. */
function _cbErr(error) {
  return {
    ok: false,
    msg: /rate_limited/.test(error.message)
      ? "Too many requests from this number. Please try again later."
      : "Could not send your request. Please check the details and try again."
  };
}
window.submitCallback = async function (f) {
  var sb = window.getSupabase();
  if (!sb) return { ok: false, msg: "Online lead storage is not configured yet. Please use WhatsApp directly." };
  var res = await sb.rpc("submit_callback_request", {
    p_doctor_slug: window.SUPABASE_CONFIG.doctorSlug,
    p_name: f.name,
    p_phone: f.phone,
    p_preferred_time: f.preferred_time || "",
    p_category: f.enquiry_category || "Consultation enquiry",
    p_consent: f.contact_consent === true
  });
  if (res.error) return _cbErr(res.error);
  window.trackEvent && window.trackEvent("callback_submit");
  return { ok: true };
};
window.startCheckin = async function (f) {
  var sb = window.getSupabase();
  if (!sb) return { ok: false, msg: "Lead saving is not enabled yet. You can continue without sharing." };
  var res = await sb.rpc("submit_checkin_start", {
    p_doctor_slug: window.SUPABASE_CONFIG.doctorSlug,
    p_name: f.name,
    p_phone: f.phone,
    p_consent: f.consent === true
  });
  if (res.error) return _cbErr(res.error);
  window.trackEvent && window.trackEvent("checkin_lead");
  return { ok: true, id: res.data };
};
window.completeCheckin = async function (id, band, answers) {
  var sb = window.getSupabase();
  if (!sb || !id) return;
  try { await sb.rpc("complete_checkin", { p_id: id, p_band: band, p_answers: answers || null }); } catch (e) {}
};

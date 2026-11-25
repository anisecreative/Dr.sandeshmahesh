/* WhatsApp enquiry box: collects name + WhatsApp number (+ optional topic) only.
   Saves lead via Supabase RPC when configured, then opens WhatsApp with a ready-made non-sensitive message. */
(function () {
  var f = document.getElementById("wa-form");
  if (!f) return;
  var msg = document.getElementById("wa-msg");
  f.addEventListener("submit", async function (e) {
    e.preventDefault();
    var d = new FormData(f);
    if (d.get("website")) return;
    var n = (d.get("name") || "").trim();
    var p = (d.get("phone") || "").trim();
    var topic = (d.get("topic") || "Video consultation enquiry").trim();
    if (n.length < 2 || !/^[0-9+ ()-]{8,18}$/.test(p)) {
      msg.textContent = "Please enter your name and a valid WhatsApp number.";
      return;
    }
    var b = f.querySelector("button");
    b.disabled = true;
    msg.textContent = "Preparing your WhatsApp request...";

    var r = { ok: false, msg: "" };
    if (window.isSupabaseConfigured && window.isSupabaseConfigured() && window.submitCallback) {
      r = await window.submitCallback({
        name: n,
        phone: p,
        preferred_time: "",
        enquiry_category: "Consultation enquiry",
        contact_consent: true
      });
    }
    b.disabled = false;

    var num = String((window.SITE_CONFIG || {}).whatsappNumber || "").replace(/\D/g, "");
    if (num) {
      var text = "Hello Dr. Sandesh's team, my name is " + n + ". I visited Dr. Sandesh Mahesh's website and have a question about: " + topic + ".";
      msg.textContent = "Opening WhatsApp with your message...";
      f.reset();
      if (window.trackEvent) window.trackEvent("whatsapp_click");
      window.location.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
      return;
    }

    if (r.ok) {
      f.reset();
      msg.textContent = "Thank you! Dr. Sandesh's team will message you on WhatsApp to answer your questions and help you decide.";
    } else {
      msg.textContent = r.msg || "Please message us directly on WhatsApp.";
    }
  });
})();

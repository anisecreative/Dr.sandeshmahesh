(function () {
  var C = window.SITE_CONFIG || {};
  var q = function (s, r) { return (r || document).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = (location.pathname.replace(/\/|\.html/g, " ").trim().split(" ").pop()) || "home";

  function defaultWaUrl(text) {
    var num = String(C.whatsappNumber || "").replace(/\D/g, "");
    if (!num) return "#consult";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text || "Hello Dr. Sandesh's team, I visited your website and would like to enquire about a video consultation.");
  }

  /* Called on load and after dynamic DOM renders */
  window.applyLinks = function () {
    qa("[data-booking]").forEach(function (a) {
      var url = C.bookingUrl;
      if (url) {
        if (C.bookingPassesUtm) {
          var u = new URL(url);
          u.searchParams.set("utm_source", "website");
          u.searchParams.set("utm_medium", "cta");
          u.searchParams.set("utm_campaign", (window.utmParams && window.utmParams().utm_campaign) || page);
          url = u.toString();
        }
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        a.href = defaultWaUrl("Hello Dr. Sandesh's team, I would like to request a video consultation with Dr. Sandesh Mahesh.");
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.setAttribute("data-track", "booking_click");
    });

    qa("[data-link]").forEach(function (a) {
      var v = C[a.dataset.link];
      if (v) { a.href = v; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
      else a.hidden = true;
    });

    qa("[data-wa]").forEach(function (a) {
      if (C.whatsappNumber) {
        a.href = defaultWaUrl("Hello Dr. Sandesh's team, I found you through your website and have a quick question before booking.");
        a.target = "_blank";
        a.rel = "noopener";
        a.setAttribute("data-track", "whatsapp_click");
        a.hidden = false;
      } else a.hidden = true;
    });

    qa("[data-tel]").forEach(function (a) {
      if (C.whatsappNumber) {
        a.href = "tel:+" + String(C.whatsappNumber).replace(/\D/g, "");
        a.hidden = false;
      } else a.hidden = true;
    });

    qa("[data-text]").forEach(function (el) {
      var v = C[el.dataset.text];
      if (v) el.textContent = v;
    });

    qa("[data-fee]").forEach(function (el) {
      var f = C.consultation && C.consultation.fee;
      if (f) el.textContent = f;
      else if (el.dataset.hideEmpty !== undefined) el.hidden = true;
      else el.textContent = "Fee confirmed before slot confirmation";
    });
  };
  window.applyLinks();

  /* Doctor portrait: shown only once the approved image exists; clean SM monogram stays until then */
  if (C.photo) {
    qa("[data-photo]").forEach(function (box) {
      var i = new Image();
      i.alt = C.doctorName || "Dr. Sandesh Mahesh";
      i.onload = function () { box.textContent = ""; box.appendChild(i); };
      i.src = C.photo;
    });
  }

  /* Scroll reveal */
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    qa(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    qa(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* Accordions */
  qa(".acc-head").forEach(function (b) {
    b.addEventListener("click", function () {
      var it = b.parentNode, o = it.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });
  });

  /* Mobile section pills spy */
  var pills = qa(".pills a[href^='#']");
  if (pills.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          pills.forEach(function (p) {
            var on = p.getAttribute("href") === "#" + e.target.id;
            p.classList.toggle("on", on);
            if (on) p.parentNode.scrollTo({ left: Math.max(0, p.offsetLeft - 24), behavior: reduce ? "auto" : "smooth" });
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    pills.forEach(function (p) { var s = q(p.getAttribute("href")); if (s) so.observe(s); });
  }

  /* Floating WhatsApp button */
  var wa = q("#wa-float");
  if (wa) {
    if (C.whatsappNumber) {
      wa.href = defaultWaUrl("Hello Dr. Sandesh's team, I found you through your website.");
      wa.setAttribute("data-track", "whatsapp_click");
      wa.hidden = false;
      document.body.classList.add("has-wa");
    } else wa.hidden = true;
  }

  /* Floating booking pop-up card */
  var pop = q(".pop"), mini = q(".pop-mini"), cs = q("#consult");
  if (pop && mini) {
    var closed = false, scrolled = false, onCs = false;
    try { closed = sessionStorage.getItem("sandeshPopClosed") === "1"; } catch (e) {}
    var upd = function () {
      var ok = scrolled && !onCs;
      pop.classList.toggle("show", ok && !closed);
      mini.classList.toggle("show", ok && closed);
    };
    window.addEventListener("scroll", function () { scrolled = window.scrollY > 420; upd(); }, { passive: true });
    if (cs && "IntersectionObserver" in window) new IntersectionObserver(function (es) { onCs = es[0].isIntersecting; upd(); }).observe(cs);
    q(".x", pop).addEventListener("click", function () {
      closed = true;
      try { sessionStorage.setItem("sandeshPopClosed", "1"); } catch (e) {}
      upd();
    });
  }
})();

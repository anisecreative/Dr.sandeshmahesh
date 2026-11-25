/* Safe DOM helpers. All user/DB text goes through textContent (zero innerHTML). */
window.el = function (t, a, k) {
  var e = document.createElement(t);
  for (var x in (a || {})) {
    if (x === "text") e.textContent = a[x];
    else e.setAttribute(x, a[x]);
  }
  (k || []).forEach(function (c) {
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
};
window.paras = function (txt) {
  return String(txt || "").split(/\n{2,}/).filter(function (p) { return p.trim(); }).map(function (p) { return el("p", { text: p.trim() }); });
};
window.safeUrl = function (u) {
  try { var x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch (e) { return ""; }
};
window.mediaUrl = function (u) {
  u = String(u || "").trim();
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(u) && u.length < 60000) return u;
  if (/^assets\/[\w\-./]+$/.test(u) && u.indexOf("..") < 0) return u;
  return safeUrl(u);
};
window.ytThumb = function (u) {
  var m = String(u || "").match(/(?:youtu\.be\/|shorts\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg" : "";
};
window.readMins = function (t) {
  var w = String(t || "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(w / 200));
};
window.slugParam = function () {
  var q = new URLSearchParams(location.search).get("slug");
  if (q) return q;
  var s = location.pathname.split("/").pop().replace(".html", "");
  return /^[a-z0-9-]+$/.test(s) && s !== "learn" && s !== "article" && s !== "story" ? s : "";
};
var ICONS = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  play: "M8 5v14l11-7z",
  ig: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.2 6.8h.01"
};
window.icon = function (n) {
  var NS = "http://www.w3.org/2000/svg", s = document.createElementNS(NS, "svg"), p = document.createElementNS(NS, "path");
  s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("aria-hidden", "true");
  p.setAttribute("d", ICONS[n]);
  s.appendChild(p);
  return s;
};
window.videoCard = function (v) {
  var w = el("div", { class: "vthumb" }, [
    el("img", { src: "https://i.ytimg.com/vi/" + v.video_id + "/hqdefault.jpg", alt: "", loading: "lazy" }),
    el("span", { class: "vplay" }, [el("span", {}, [icon("play")])])
  ]);
  return el("a", { class: "card vid", href: "https://www.youtube.com/watch?v=" + v.video_id, target: "_blank", rel: "noopener" }, [w, el("h3", { text: v.title || "Watch on YouTube" })]);
};
window.articleCard = function (a) {
  var kids = [], img = mediaUrl(a.featured_image);
  if (img) kids.push(el("div", { class: "ac-thumb" }, [el("img", { src: img, alt: "", loading: "lazy" })]));
  kids.push(el("div", { class: "ac-top" }, [el("span", { class: "ac-cat", text: a.category || "Women's Health" }), el("span", { class: "ac-min", text: readMins(a.body) + " min read" })]));
  kids.push(el("h3", { text: a.title }));
  if (a.summary) kids.push(el("p", { text: a.summary }));
  kids.push(el("span", { class: "ac-go" }, [el("span", { text: "Read article" }), icon("arrow")]));
  return el("a", { class: "card acard", href: "article.html?slug=" + encodeURIComponent(a.slug) }, kids);
};
window.reelCard = function (url, thumb, title) {
  var u = safeUrl(url);
  if (!u) return null;
  var isIg = /instagram\.com/.test(u), m = isIg && u.match(/instagram\.com\/(?:[^/]+\/)?(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  var src = mediaUrl(thumb) || ytThumb(u) || (m ? "https://www.instagram.com/p/" + m[1] + "/media/?size=l" : "");
  var t = el("div", { class: "reel-thumb" });
  if (src) {
    var im = el("img", { src: src, alt: "", loading: "lazy", referrerpolicy: "no-referrer" });
    im.onload = function () { t.classList.add("has"); };
    im.onerror = function () { im.remove(); t.classList.remove("has"); };
    t.appendChild(im);
  }
  t.appendChild(el("span", { class: "reel-play" }, [icon("play")]));
  var body = el("div", { class: "reel-body" }, [
    el("span", { class: "reel-tag" }, [icon("ig"), isIg ? "Instagram Reel" : "Video"]),
    el("strong", { text: title || "Watch the related Reel" }),
    el("span", { class: "reel-sub", text: isIg ? "Watch on @namma_drsandesh" : "Watch on @Namma_DrSandesh" }),
    el("span", { class: "reel-cta" }, [el("span", { text: isIg ? "Open Instagram" : "Open YouTube" }), icon("arrow")])
  ]);
  return el("a", { class: "reel", href: u, target: "_blank", rel: "noopener", "data-track": "cta_click" }, [t, body]);
};
window.ctaRow = function () {
  var b = el("a", { class: "btn", "data-booking": "", href: "#", text: "Request a Video Consultation" });
  var s = el("a", { class: "btn alt", "data-link": "instagram", href: "#", text: "Follow @namma_drsandesh" });
  return el("p", { class: "cta-row" }, [b, s]);
};

(async function () {
  var D = document, $ = function (i) { return D.getElementById(i); };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var ck = $("checkin"), ins = $("insights"), ct = $("contact");

  function css(h) { var l = D.createElement("link"); l.rel = "stylesheet"; l.href = h; D.head.appendChild(l); }
  if (ck) { css("css/checkin.css"); css("css/watch.css"); }

  function fill(id, nodes) {
    var s = $(id);
    if (!s || !nodes.length) return;
    var box = s.querySelector(".items");
    nodes.forEach(function (n) { box.appendChild(n); });
    s.hidden = false;
  }

  var a = await ContentDB.articles();
  fill("latest", a.slice(0, 3).map(articleCard));

  var i = await ContentDB.insights();
  if (ins && i.length) {
    fill("insights", i.slice(0, 4).map(function (x, n) {
      var d = (Array.isArray(x.dialogue) && x.dialogue[0]) || {};
      var q = d.q || d.text || "", p = d.a || "", chat = el("div", { class: "cc-chat" });
      if (q) chat.appendChild(el("span", { class: "cc-b d", text: q }));
      if (p) chat.appendChild(el("span", { class: "cc-b p", text: p }));
      return el("a", { class: "conv-card", href: "stories.html?s=" + encodeURIComponent(x.slug) }, [
        el("span", { class: "cc-top" }, [el("span", { class: "cc-n", text: pad(n + 1) }), el("span", { class: "cc-topic", text: x.topic || "" })]),
        el("h3", { text: x.title }),
        chat,
        el("span", { class: "cc-go" }, [el("span", { text: "Step into the conversation" }), icon("arrow")])
      ]);
    }));
  }

  /* YouTube videos & Shorts managed from Admin */
  var v = await ContentDB.videos();
  if (v.length && ct) {
    var track = el("div", { class: "vtrack" });
    v.forEach(function (x) {
      var s = !!x.is_short, box = el("div", { class: "vbox" + (s ? " short" : "") });
      var btn = el("button", { class: "vbtn", type: "button", "aria-label": "Play " + (x.title || "video") }, [
        el("img", { src: "https://i.ytimg.com/vi/" + x.video_id + "/hqdefault.jpg", alt: "", loading: "lazy" }),
        el("span", { class: "vp" }, [el("span", {}, [icon("play")])])
      ]);
      btn.onclick = function () {
        if (window.trackEvent) trackEvent("cta_click");
        box.textContent = "";
        box.appendChild(el("iframe", {
          src: "https://www.youtube-nocookie.com/embed/" + x.video_id + "?autoplay=1&rel=0&playsinline=1",
          title: x.title || "Video",
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowfullscreen: ""
        }));
      };
      box.appendChild(btn);
      track.appendChild(el("article", { class: "vcard" + (s ? " short" : "") }, [box, el("h3", { text: x.title || "Watch" })].concat(x.description ? [el("p", { text: x.description })] : [])));
    });
    var sec = el("section", { id: "watch" }, [
      el("div", { class: "wrap" }, [
        el("span", { class: "eyebrow", text: "Watch on YouTube" }),
        el("h2", { text: "Short videos, clear OBGYN answers" }),
        el("p", { class: "lead", text: "Educational videos from Dr. Sandesh Mahesh (@Namma_DrSandesh) on women's health, fertility, pregnancy, and gynecology." }),
        track,
        el("p", { class: "vmore" }, [el("a", { class: "btn", "data-link": "youtube", href: "#", text: "Watch more on YouTube \u2192" })])
      ])
    ]);
    ct.after(sec);
  }
  if (window.applyLinks) window.applyLinks();

  /* Dynamic section navigation spy */
  if (!ck) return;
  var defs = [
    ["Home", "top"],
    ["Check-in", "checkin"],
    ["About", "about"],
    ["Focus Areas", "focus"],
    ["Reels & YouTube", "reels-hub"],
    ["Conversations", "insights", "stories.html"],
    ["Library", "latest", "library.html"],
    ["Consult", "consult"],
    ["FAQ", "faq"],
    ["Contact", "contact"],
    ["Videos", "watch"]
  ];
  var list = [];
  defs.forEach(function (d) {
    var s = $(d[1]);
    if (s && !s.hidden) list.push({ t: d[0], id: d[1], href: "#" + d[1], el: s });
    else if (d[2]) list.push({ t: d[0], href: d[2] });
  });
  function mk(x) { var a = D.createElement("a"); a.href = x.href; a.textContent = x.t; return a; }
  var pills = D.querySelector(".pills"), links = D.querySelector(".nav-links");
  if (pills) { pills.textContent = ""; list.forEach(function (x) { pills.appendChild(mk(x)); }); }
  if (links) {
    var bt = links.querySelector(".btn");
    links.textContent = "";
    list.slice(0, 7).forEach(function (x) { links.appendChild(mk(x)); });
    if (bt) links.appendChild(bt);
  }
  var spies = list.filter(function (x) { return x.el; }), last = null, tick = 0;
  function spy() {
    var nav = D.querySelector(".nav"), y = (nav ? nav.offsetHeight : 0) + 70, cur = spies[0];
    spies.forEach(function (s) { if (s.el.getBoundingClientRect().top <= y) cur = s; });
    if (!cur || cur.id === last) return;
    last = cur.id;
    Array.prototype.forEach.call(D.querySelectorAll(".pills a,.nav-links a:not(.btn)"), function (a) {
      var on = a.getAttribute("href") === "#" + cur.id;
      a.classList.toggle("on", on);
      if (on && a.parentNode.classList.contains("pills")) {
        a.parentNode.scrollTo({ left: Math.max(0, a.offsetLeft - 24), behavior: "smooth" });
      }
    });
  }
  window.addEventListener("scroll", function () { cancelAnimationFrame(tick); tick = requestAnimationFrame(spy); }, { passive: true });
  window.addEventListener("resize", spy, { passive: true });
  spy();
})();

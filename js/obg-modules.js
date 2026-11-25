/* OBGYN Interactive Modules:
   1) 4-Step Video Consultation Booking System -> WhatsApp (7406886226)
   2) Due Date Calculator
   3) YouTube Shorts Inline Player (@Namma_DrSandesh)
   4) Horizontal Patient Insights + EXACT Dr. Vikas Scroll-Locked Vertical-Swipe Conversation Engine
   5) Horizontal Pregnancy Journey + "View more details" simple patient facts modal */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var WA_NUM = String(C.whatsappNumber || "917406886226").replace(/\D/g, "");
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- 1. 4-STEP VIDEO CONSULTATION BOOKING SYSTEM ---------- */
  var bookRoot = document.getElementById("bookingWidget");
  if (bookRoot) {
    var SLOTS = ["17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45"];
    var bState = { step: 1, dateISO: "", slot: "", topic: "General OBGYN / Consultation", name: "", phone: "", email: "", err: "", waUrl: "" };
    function todayISO() { var d = new Date(); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
    function maxISO() { var d = new Date(); d.setDate(d.getDate() + 60); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
    function isSunday(iso) { return new Date(iso + "T00:00:00").getDay() === 0; }
    function fmtDate(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
    function fmtTime(hhmm) { var p = hhmm.split(":").map(Number); return (p[0] % 12 || 12) + ":" + pad2(p[1]) + (p[0] >= 12 ? " PM" : " AM"); }

    function renderBook() {
      var prog = '<div class="bk-prog" aria-label="Booking step ' + bState.step + ' of 4">' +
        [1, 2, 3, 4].map(function (n) { return '<span class="' + (n < bState.step ? "done" : (n === bState.step ? "on" : "")) + '">' + n + '</span>'; }).join("<i></i>") + "</div>";
      var html = "";
      if (bState.step === 1) {
        html = prog + '<p class="bk-lbl">Step 1 of 4 &middot; Choose a date (Mon &ndash; Sat)</p>' +
          '<div style="display:grid;gap:12px"><label>Preferred date<input id="bkDate" type="date" min="' + todayISO() + '" max="' + maxISO() + '" value="' + esc(bState.dateISO) + '"></label>' +
          '<label>Topic (optional)<select id="bkTopic">' +
            ["General OBGYN / Consultation", "Pregnancy & antenatal care", "Irregular periods / PCOS", "Fertility & reproductive medicine (FRM)", "Fibroids, cysts or second opinion (FMAS)", "Menopause & women's wellness"].map(function (t) {
              return '<option value="' + esc(t) + '"' + (bState.topic === t ? " selected" : "") + '>' + esc(t) + '</option>';
            }).join("") +
          '</select></label>' + (bState.err ? '<p class="bk-err" role="alert">' + esc(bState.err) + '</p>' : "") +
          '<button type="button" class="btn" id="bkNext1" style="width:100%">See 5&ndash;8 PM slots &rarr;</button></div>';
      } else if (bState.step === 2) {
        html = prog + '<p class="bk-lbl">Step 2 of 4 &middot; Choose a 15-min slot</p>' +
          '<p class="bk-ctx"><strong>' + esc(fmtDate(bState.dateISO)) + '</strong> &middot; Consultation fee: &#8377;500</p>' +
          '<div class="slot-grid">' + SLOTS.map(function (s) { return '<button type="button" class="slot-btn' + (bState.slot === s ? " on" : "") + '" data-slot="' + s + '">' + fmtTime(s) + '</button>'; }).join("") + '</div>' +
          (bState.err ? '<p class="bk-err" role="alert">' + esc(bState.err) + '</p>' : "") +
          '<div class="bk-acts"><button type="button" class="btn alt" id="bkBack2">&larr; Date</button><button type="button" class="btn" id="bkNext2">Continue &rarr;</button></div>';
      } else if (bState.step === 3) {
        html = prog + '<p class="bk-lbl">Step 3 of 4 &middot; Your details</p>' +
          '<div class="bk-pill">' + esc(fmtDate(bState.dateISO)) + ' &middot; ' + esc(fmtTime(bState.slot)) + ' &middot; 15 min &middot; &#8377;500</div>' +
          '<div style="display:grid;gap:10px"><label>Full name<input id="bkName" type="text" maxlength="80" value="' + esc(bState.name) + '" placeholder="Your name" autocomplete="name"></label>' +
          '<label>WhatsApp / Mobile number<input id="bkPhone" type="tel" inputmode="numeric" maxlength="12" value="' + esc(bState.phone) + '" placeholder="10-digit mobile number" autocomplete="tel"></label>' +
          '<label>Email <span class="note">(optional)</span><input id="bkEmail" type="email" maxlength="90" value="' + esc(bState.email) + '" placeholder="you@example.com" autocomplete="email"></label></div>' +
          (bState.err ? '<p class="bk-err" role="alert">' + esc(bState.err) + '</p>' : "") +
          '<div class="bk-acts"><button type="button" class="btn alt" id="bkBack3">&larr; Back</button><button type="button" class="btn" id="bkNext3">Review &rarr;</button></div>';
      } else if (bState.step === 4) {
        html = prog + '<p class="bk-lbl">Step 4 of 4 &middot; Review &amp; send on WhatsApp</p>' +
          '<div class="bk-review"><div><span>Doctor</span><strong>Dr. Sandesh Mahesh</strong></div><div><span>Date</span><strong>' + esc(fmtDate(bState.dateISO)) + '</strong></div><div><span>Time</span><strong>' + esc(fmtTime(bState.slot)) + ' (15 min)</strong></div><div><span>Fee</span><strong>&#8377;500 (paid after confirmation)</strong></div><div><span>Topic</span><strong>' + esc(bState.topic) + '</strong></div><div><span>Contact</span><strong>' + esc(bState.name) + ' &middot; ' + esc(bState.phone) + '</strong></div></div>' +
          '<p class="note" style="margin:10px 0">No payment is taken here. Opens WhatsApp so the clinic confirms your slot.</p>' +
          '<div class="bk-acts"><button type="button" class="btn alt" id="bkBack4">&larr; Edit</button><button type="button" class="btn wa" id="bkSubmit">Confirm on WhatsApp &rarr;</button></div>';
      } else {
        html = '<div class="bk-done"><div class="bk-check">&#10003;</div><h3>Booking request ready</h3><p class="note">Slot: <strong>' + esc(fmtDate(bState.dateISO)) + ', ' + esc(fmtTime(bState.slot)) + '</strong></p><p><a class="btn wa" href="' + esc(bState.waUrl) + '" target="_blank" rel="noopener">Open WhatsApp</a></p><p style="margin-top:10px"><button type="button" class="btn alt" id="bkReset">Book another slot</button></p></div>';
      }
      bookRoot.innerHTML = html;

      if (bState.step === 1) {
        var dIn = document.getElementById("bkDate"), tIn = document.getElementById("bkTopic");
        dIn.onchange = function () { bState.dateISO = dIn.value; bState.err = ""; };
        tIn.onchange = function () { bState.topic = tIn.value; };
        document.getElementById("bkNext1").onclick = function () {
          bState.dateISO = dIn.value; bState.topic = tIn.value;
          if (!bState.dateISO) { bState.err = "Please select a date first."; renderBook(); return; }
          if (isSunday(bState.dateISO)) { bState.err = "Video consultations are Monday to Saturday (5–8 PM). Please pick another day."; renderBook(); return; }
          bState.err = ""; bState.step = 2; renderBook();
        };
      } else if (bState.step === 2) {
        bookRoot.querySelectorAll(".slot-btn").forEach(function (btn) { btn.onclick = function () { bState.slot = btn.dataset.slot; bState.err = ""; renderBook(); }; });
        document.getElementById("bkBack2").onclick = function () { bState.step = 1; bState.err = ""; renderBook(); };
        document.getElementById("bkNext2").onclick = function () { if (!bState.slot) { bState.err = "Please choose a time slot."; renderBook(); return; } bState.step = 3; bState.err = ""; renderBook(); };
      } else if (bState.step === 3) {
        document.getElementById("bkBack3").onclick = function () { bState.step = 2; bState.err = ""; renderBook(); };
        document.getElementById("bkNext3").onclick = function () {
          bState.name = document.getElementById("bkName").value.trim();
          bState.phone = document.getElementById("bkPhone").value.replace(/\D/g, "").slice(-10);
          bState.email = document.getElementById("bkEmail").value.trim();
          if (bState.name.length < 2) { bState.err = "Please enter your name."; renderBook(); return; }
          if (bState.phone.length !== 10) { bState.err = "Please enter a valid 10-digit mobile number."; renderBook(); return; }
          bState.step = 4; bState.err = ""; renderBook();
        };
      } else if (bState.step === 4) {
        document.getElementById("bkBack4").onclick = function () { bState.step = 3; renderBook(); };
        document.getElementById("bkSubmit").onclick = function () {
          var msg = "Hello Dr. Sandesh Mahesh's team, I would like to request a 15-minute video consultation.\n\nDate: " + fmtDate(bState.dateISO) + "\nTime: " + fmtTime(bState.slot) + "\nTopic: " + bState.topic + "\nName: " + bState.name + "\nPhone: " + bState.phone + (bState.email ? "\nEmail: " + bState.email : "");
          bState.waUrl = "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(msg);
          if (window.trackEvent) window.trackEvent("booking_click");
          bState.step = 5; renderBook();
          try { window.location.href = bState.waUrl; } catch (e) { window.open(bState.waUrl, "_blank", "noopener"); }
        };
      } else {
        document.getElementById("bkReset").onclick = function () { bState = { step: 1, dateISO: "", slot: "", topic: "General OBGYN / Consultation", name: "", phone: "", email: "", err: "", waUrl: "" }; renderBook(); };
      }
    }
    renderBook();
  }

  /* ---------- 2. DUE DATE CALCULATOR ---------- */
  var ddForm = document.getElementById("duedateForm");
  if (ddForm) {
    ddForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var lmp = document.getElementById("ddLmp").value;
      var cycle = Number(document.getElementById("ddCycle").value) || 28;
      var out = document.getElementById("ddResult");
      if (!lmp) { out.innerHTML = '<p class="bk-err">Please select the first day of your last period.</p>'; return; }
      var start = new Date(lmp + "T00:00:00");
      var edd = new Date(start.getTime() + (280 + (cycle - 28)) * 86400000);
      var diffDays = Math.floor((Date.now() - start.getTime()) / 86400000);
      var weeks = Math.floor(diffDays / 7), remDays = diffDays % 7;
      var tri = weeks < 13 ? "First trimester" : (weeks < 28 ? "Second trimester" : "Third trimester");
      var eddStr = edd.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      var weekTxt = (diffDays >= 0 && weeks <= 42) ? "Approx. <strong>" + weeks + "w" + (remDays ? " " + remDays + "d" : "") + "</strong> (" + tri + ")." : "An early scan confirms your exact dates.";
      out.innerHTML = '<div class="dd-box"><span class="eyebrow" style="margin-bottom:2px">Estimated Due Date</span><strong>' + esc(eddStr) + '</strong><p style="margin:4px 0 6px">' + weekTxt + '</p><p class="note" style="margin:0">Estimate only — confirmed by ultrasound.</p></div>';
    });
  }

  /* ---------- 3. YOUTUBE SHORTS DIRECT LINKS (OPENS YOUTUBE DIRECTLY) ---------- */
  var shortsGrid = document.getElementById("shortsGrid");
  if (shortsGrid && Array.isArray(C.youtubeShorts)) {
    shortsGrid.innerHTML = "";
    C.youtubeShorts.forEach(function (v, idx) {
      var a = document.createElement("a");
      a.className = "short-card";
      a.href = "https://www.youtube.com/shorts/" + encodeURIComponent(v.id);
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "Watch " + (v.title || "YouTube Short " + (idx + 1)) + " on YouTube");
      a.innerHTML =
        '<div class="short-thumb">' +
          '<img loading="lazy" src="https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg" alt="' + esc(v.title) + '">' +
          '<span class="short-badge">SHORT</span>' +
          '<span class="short-play"><span>&#9654;</span></span>' +
        '</div>' +
        '<div class="short-meta"><strong>' + esc(v.title) + '</strong><span>Watch on YouTube &rarr;</span></div>';
      shortsGrid.appendChild(a);
    });
  }

  /* ---------- 4. EXACT DR. VIKAS VIRTUAL CONVERSATIONS OVERLAY (1:1 LOGIC & UI) ---------- */
  var storiesRoot = document.getElementById("demoStoriesGrid");
  var overlay = document.getElementById("storyOverlay");
  var STORIES = window.SANDESH_DEMO_STORIES || [];
  var cleanupLock = null;

  function closeStoryOverlay() {
    if (cleanupLock) { cleanupLock(); cleanupLock = null; }
    if (overlay) { overlay.classList.remove("is-locked"); overlay.hidden = true; overlay.innerHTML = ""; }
    document.body.style.overflow = "";
  }

  function openStoryOverlay(startIdx) {
    if (!overlay || !STORIES.length) return;
    if (cleanupLock) { cleanupLock(); cleanupLock = null; }
    var curIdx = typeof startIdx === "number" ? startIdx : 0;
    var s = STORIES[curIdx] || STORIES[0];
    var dlg = s.dialogue || [];

    var chooserHtml = STORIES.map(function (x, i) {
      return '<button type="button" class="so-sc" data-si="' + i + '" aria-pressed="' + (i === curIdx ? "true" : "false") + '">' +
        '<small>Conversation ' + pad2(i + 1) + '</small>' +
        '<strong>&ldquo;' + esc(x.title) + '&rdquo;</strong>' +
        '<span>' + esc(x.topic || "") + '</span></button>';
    }).join("");

    var othersHtml = STORIES.map(function (x, i) {
      if (i === curIdx) return "";
      return '<button type="button" class="so-other-card" data-oi="' + i + '">' +
        '<span class="so-other-cat">' + esc(x.topic || "Virtual conversation") + '</span>' +
        '<h3 style="margin:0">&ldquo;' + esc(x.title) + '&rdquo;</h3>' +
        '<span class="so-other-go"><span>Read the conversation</span><span>&rarr;</span></span></button>';
    }).join("");

    overlay.innerHTML =
      '<div class="so-top"><button type="button" class="so-back" id="soClose">&larr; Back</button><a class="btn" href="#consult" id="soTopBook" style="min-height:36px;padding:7px 14px;font-size:.78rem">Book a Video Consultation</a></div>' +
      '<div class="so-hd"><span class="eyebrow">Virtual Conversations</span><h1 style="font-size:clamp(1.6rem,4.5vw,2.2rem);margin-bottom:12px">Choose a virtual conversation</h1><div class="so-car" id="soChooser">' + chooserHtml + '</div><p class="note" style="margin:2px 0 0">Swipe to explore more &rarr;</p></div>' +
      '<div class="so-sel" id="soSel"><span class="eyebrow">Virtual Conversation ' + pad2(curIdx + 1) + '</span><h2 style="margin:0">&ldquo;' + esc(s.title) + '&rdquo;</h2></div>' +
      '<div class="conv-track" id="soTrack">' +
        '<div class="conv-story-intro" id="soIntro"><div class="inner">' +
          '<span class="eyebrow">Step into the conversation</span>' +
          '<h2>Imagine you are sitting across from Dr. Sandesh.</h2>' +
          '<p>Read this as though you are part of the consultation. Dr. Sandesh asks the questions a doctor would normally ask, and the (imagined) patient answers. As you follow it, you may recognise something familiar in yourself or in someone you know.</p>' +
        '</div></div>' +
        '<div class="conv-stage" id="soStage">' +
          '<div class="conv-head"><small>You\u2019ve just stepped into the consultation</small><b>Take a seat. The conversation begins.</b></div>' +
          '<div class="conv-viewport" id="soViewport"><div class="conv-deck" id="soDeck"></div><div class="conv-prog" id="soProg">01 / ' + pad2(dlg.length) + '</div></div>' +
          '<div class="conv-dots" id="soDots"></div>' +
        '</div>' +
      '</div>' +
      '<div class="so-after">' +
        '<div class="so-pause-card">' +
          '<span class="eyebrow">Reflect &middot; Pause for a moment</span>' +
          '<h2>Does any of this feel familiar?</h2>' +
          (s.relateIntro ? '<p class="note" style="font-size:.94rem;margin-bottom:10px">' + esc(s.relateIntro) + '</p>' : "") +
          '<ul class="so-relate-list">' + (s.relatePoints || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + '</ul>' +
          (s.relateClose ? '<div class="so-callout-rich"><b>A small but important point</b><p>' + esc(s.relateClose) + '</p></div>' : "") +
        '</div>' +
        '<div class="so-action-card">' +
          '<span class="eyebrow">Practical Next Steps</span>' +
          '<h2>What you can do</h2>' +
          '<ol class="so-action-list">' + (s.actionPoints || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + '</ol>' +
        '</div>' +
        (s.urgent ? '<div class="so-urgent-rich"><h3>&#9888; When to seek urgent care</h3><p>' + esc(s.urgent) + '</p></div>' : "") +
        '<p class="note">This is a fictional, educational conversation (Demo Preview &middot; Pending Doctor Approval). It is not a real patient story or testimonial, and does not replace an individual medical consultation.</p>' +
        '<div class="so-bridge"><p>If this sounds familiar, you can talk to Dr. Sandesh over a video consultation, from home.</p><a class="btn" href="#consult" id="soBookBtn">Book a Video Consultation</a></div>' +
        '<span class="eyebrow">More conversations</span><h2 style="margin-bottom:6px">Other conversations</h2>' +
        '<div class="so-others">' + othersHtml + '</div>' +
      '</div>' +
      '<button type="button" class="so-nudge-pill" id="soNudge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg><span>Scroll down to begin</span></button>' +
      '<div class="so-vbar" role="note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/></svg><p><b>Virtual conversation</b>Something here may feel similar</p><a class="btn" href="#consult" id="soVbarBook">Talk to Dr. Sandesh</a></div>';

    overlay.classList.remove("is-locked");
    overlay.hidden = false;
    overlay.scrollTop = 0;
    document.body.style.overflow = "hidden";

    var track = document.getElementById("soTrack");
    var intro = document.getElementById("soIntro");
    var stage = document.getElementById("soStage");
    var viewport = document.getElementById("soViewport");
    var deck = document.getElementById("soDeck");
    var prog = document.getElementById("soProg");
    var dots = document.getElementById("soDots");
    var nudge = document.getElementById("soNudge");

    var slides = [], total = Math.max(1, dlg.length), active = 0;
    var locked = false, lockedY = null, changing = false, relDir = 0, guardUntil = 0, wheelUntil = 0, lastY = 0;
    var tY = null, tX = null, tLocked = false, nuReady = false;

    dlg.forEach(function (d, j) {
      var p = document.createElement("div");
      p.className = "conv-pair";
      p.innerHTML = '<span class="cn">' + pad2(j + 1) + '</span>' +
        '<span class="cl">Doctor</span><div class="cq">' + esc(d.q) + '</div>' +
        '<span class="cl p">Patient (Imagined)</span><div class="ca">' + esc(d.a) + '</div>';
      deck.appendChild(p);
      slides.push(p);

      var b = document.createElement("button");
      b.type = "button";
      b.className = "conv-progress-dot" + (j === 0 ? " active" : "");
      b.setAttribute("aria-label", "Go to exchange " + (j + 1));
      b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); active = j; apply(true); setProg(); };
      dots.appendChild(b);
    });

    function vh() { return overlay.clientHeight || window.innerHeight; }
    function stageH() { return Math.max(320, vh() - 56); }
    function cardH() { return Math.max(340, Math.min(540, stageH() * 0.68)); }
    function lockY() { return track.offsetTop + intro.offsetHeight - 56; }
    function endY() { return Math.max(lockY(), track.offsetTop + track.offsetHeight - vh()); }

    function apply(anim) {
      deck.classList.toggle("is-animating", !!anim);
      slides.forEach(function (sl, i) {
        sl.style.transform = "translate3d(0," + ((i - active) * 100) + "%,0)";
        sl.setAttribute("aria-hidden", i === active ? "false" : "true");
      });
    }
    function setProg() {
      prog.textContent = pad2(active + 1) + " / " + pad2(total);
      Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle("active", i === active); });
    }
    function layout() {
      var sh = stageH();
      stage.style.height = sh + "px";
      viewport.style.height = cardH() + "px";
      track.style.height = (intro.offsetHeight + total * sh + 2) + "px";
      apply(false); setProg();
    }
    function lockUI(on) {
      stage.style.touchAction = on ? "none" : "auto";
      viewport.style.touchAction = on ? "none" : "auto";
      overlay.classList.toggle("is-locked", on);
    }
    function nuUpdate() {
      var rectTop = track.offsetTop - overlay.scrollTop;
      var before = !locked && rectTop > vh() * 0.55;
      nudge.classList.toggle("show", nuReady && before);
    }
    function release(dir) {
      locked = false; lockedY = null; tLocked = false; tY = null; tX = null; lockUI(false);
      relDir = dir; guardUntil = performance.now() + 750;
      var dest = dir < 0 ? Math.max(0, lockY() - Math.max(140, vh() * 0.38)) : Math.min(overlay.scrollHeight - vh(), endY() + Math.max(110, vh() * 0.2));
      lastY = overlay.scrollTop;
      overlay.scrollTo({ top: dest, behavior: "smooth" });
      nuUpdate();
    }
    function go(dir) {
      if (changing || !locked) return;
      var n = active + dir;
      if (n < 0) { release(-1); return; }
      if (n >= total) { release(1); return; }
      changing = true; active = n; apply(true); setProg();
      setTimeout(function () { changing = false; }, 460);
    }
    function engage(y) {
      if (locked) return;
      locked = true; lockedY = y; relDir = 0; guardUntil = 0; lockUI(true);
      overlay.scrollTop = y; lastY = y; nuUpdate();
    }
    function onScroll() {
      nuUpdate();
      var c = overlay.scrollTop, top = lockY(), bot = endY();
      if (locked) {
        var y = lockedY == null ? top : lockedY;
        if (Math.abs(c - y) > 2) overlay.scrollTop = y;
        lastY = y; return;
      }
      var now = performance.now(), d = c - lastY;
      if (now < guardUntil) { lastY = c; return; }
      if (relDir < 0 && c < top - 24) relDir = 0;
      if (relDir > 0 && c > bot + 24) relDir = 0;
      if (relDir === 0) {
        if (lastY < top - 2 && c >= top - 2 && d > 0) { active = 0; apply(false); setProg(); engage(top); }
        else if (lastY > bot + 2 && c <= bot + 2 && d < 0) { active = total - 1; apply(false); setProg(); engage(bot); }
      }
      lastY = c;
    }
    function onWheel(e) {
      if (!locked) return;
      e.preventDefault();
      var now = performance.now();
      if (now < wheelUntil || Math.abs(e.deltaY) < 5) return;
      wheelUntil = now + 450;
      go(e.deltaY > 0 ? 1 : -1);
    }
    function onTouchStart(e) {
      tLocked = locked; tY = null; tX = null;
      if (!tLocked || !e.touches || e.touches.length !== 1) return;
      tY = e.touches[0].clientY; tX = e.touches[0].clientX;
    }
    function onTouchMove(e) { if (tLocked && tY !== null) e.preventDefault(); }
    function onTouchEnd(e) {
      if (!tLocked || tY === null) { tLocked = false; tY = null; tX = null; return; }
      var p = e.changedTouches && e.changedTouches[0];
      var dy = (p ? p.clientY : tY) - tY, dx = (p ? p.clientX : tX) - tX;
      tLocked = false; tY = null; tX = null;
      if (Math.abs(dy) < 28 || Math.abs(dy) <= Math.abs(dx)) return;
      go(dy < 0 ? 1 : -1);
    }
    function onKey(e) {
      if (e.key === "Escape") { closeStoryOverlay(); return; }
      if (!locked) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
    }

    overlay.addEventListener("scroll", onScroll, { passive: true });
    overlay.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: false });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("resize", layout, { passive: true });
    document.addEventListener("keydown", onKey);

    nudge.onclick = function () { overlay.scrollTo({ top: Math.max(0, track.offsetTop - 56), behavior: "smooth" }); };
    document.getElementById("soClose").onclick = closeStoryOverlay;
    document.getElementById("soTopBook").onclick = closeStoryOverlay;
    document.getElementById("soBookBtn").onclick = closeStoryOverlay;
    document.getElementById("soVbarBook").onclick = closeStoryOverlay;

    overlay.querySelectorAll("[data-si]").forEach(function (b) { b.onclick = function () { openStoryOverlay(Number(b.dataset.si)); }; });
    overlay.querySelectorAll("[data-oi]").forEach(function (b) { b.onclick = function () { openStoryOverlay(Number(b.dataset.oi)); }; });

    cleanupLock = function () {
      overlay.removeEventListener("scroll", onScroll);
      overlay.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", layout);
      document.removeEventListener("keydown", onKey);
    };

    requestAnimationFrame(function () { layout(); lastY = overlay.scrollTop; setTimeout(function () { nuReady = true; nuUpdate(); }, 350); });
  }

  if (storiesRoot && STORIES.length) {
    storiesRoot.innerHTML = "";
    STORIES.forEach(function (s, idx) {
      var first = (s.dialogue && s.dialogue[0]) || {};
      var card = document.createElement("button");
      card.type = "button";
      card.className = "conv-card shade-" + (idx % 3);
      card.innerHTML =
        '<span class="cc-top"><span class="cc-n">0' + (idx + 1) + '</span><span class="cc-topic">' + esc(s.topic) + '</span></span>' +
        '<span class="demo-chip">Demo Preview &middot; Pending Approval</span>' +
        '<h3>&ldquo;' + esc(s.title) + '&rdquo;</h3>' +
        '<div class="cc-chat">' +
          (first.q ? '<span class="cc-b d">' + esc(first.q) + '</span>' : "") +
          (first.a ? '<span class="cc-b p">' + esc(first.a) + '</span>' : "") +
        '</div>' +
        '<span class="cc-go"><span>Step into the conversation</span><span aria-hidden="true">&rarr;</span></span>';
      card.addEventListener("click", function () { openStoryOverlay(idx); });
      storiesRoot.appendChild(card);
    });
  }
  var expBtn = document.getElementById("exploreAllStories");
  if (expBtn) expBtn.addEventListener("click", function (e) { e.preventDefault(); openStoryOverlay(0); });

  /* ---------- 5. PREGNANCY JOURNEY "VIEW MORE DETAILS" SIMPLE FACTS MODAL ---------- */
  var JOURNEY_DETAILS = {
    t1: {
      eyebrow: "Weeks 1 to 12 · First Trimester",
      title: "The quiet beginning — tiny changes, big milestones",
      baby: [
        "By week 6–7, a tiny heartbeat starts beating — faster than yours!",
        "Tiny arms, legs, fingers, toes, and facial features begin to shape.",
        "By week 12, your baby grows from the size of a poppy seed to roughly the size of a lime."
      ],
      facts: [
        "Even before a bump shows, your body is building the placenta to nourish the baby.",
        "Feeling extra sleepy or nauseous is very common and usually eases after week 12.",
        "Small, frequent meals and staying hydrated often feel gentler on the stomach."
      ]
    },
    t2: {
      eyebrow: "Weeks 13 to 27 · Second Trimester",
      title: "Energy returns — and your baby starts saying hello",
      baby: [
        "Around weeks 18–22, you may feel the first gentle flutters or light kicks.",
        "Your baby can now swallow, yawn, stretch, and even suck their thumb.",
        "By week 20–24, baby's ears develop enough to hear your heartbeat and your voice!"
      ],
      facts: [
        "Many mothers feel their best energy during these middle months.",
        "The 5th-month anomaly scan checks baby's head-to-toe growth in detail.",
        "Talking, humming, or playing soft music lets your baby get familiar with your voice."
      ]
    },
    t3: {
      eyebrow: "Weeks 28 to 40 · Third Trimester",
      title: "Growing stronger and getting ready to meet you",
      baby: [
        "Your baby opens and closes their eyes, notices bright light, and has sleep–wake cycles.",
        "Kicks feel stronger and more regular — you'll get to know your baby's daily pattern.",
        "Baby practices tiny breathing movements and usually turns head-down ready for birth."
      ],
      facts: [
        "Keeping a casual eye on baby's daily movements is one of the best reassurance habits.",
        "Sleeping on your left side with a pillow between your knees often helps comfort.",
        "Packing your hospital bag around week 36 keeps the final weeks calm and stress-free."
      ]
    },
    pp: {
      eyebrow: "The First Weeks · After the Birth",
      title: "Gentle recovery for you while bonding with your newborn",
      baby: [
        "Your newborn recognises your voice and scent right away — skin-to-skin warmth calms them.",
        "Newborns feed often (every 2–3 hours) and sleep in short stretches day and night.",
        "In the first weeks, baby's eyesight focuses best at the exact distance of your face during feeding."
      ],
      facts: [
        "Your uterus gently shrinks back to its usual size over about 6 weeks.",
        "Mood dips or feeling teary in the first 1–2 weeks ('baby blues') are very common — speak up if they last longer.",
        "Rest, warm meals, hydration, and asking family for help matter just as much as baby care."
      ]
    }
  };

  var infoModal = document.getElementById("journeyModal");
  var infoBody = document.getElementById("journeyModalBody");
  var infoClose = document.getElementById("journeyModalClose");

  function closeInfo() { if (infoModal) infoModal.hidden = true; document.body.style.overflow = ""; }
  if (infoClose) infoClose.onclick = closeInfo;
  if (infoModal) infoModal.addEventListener("click", function (e) { if (e.target === infoModal) closeInfo(); });

  document.querySelectorAll(".jc-more-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var d = JOURNEY_DETAILS[btn.dataset.j];
      if (!d || !infoModal || !infoBody) return;
      infoBody.innerHTML =
        '<span class="eyebrow">' + esc(d.eyebrow) + '</span>' +
        '<h2 style="margin-bottom:10px">' + esc(d.title) + '</h2>' +
        '<div class="fact-box"><b>What your baby is doing</b><ul>' + d.baby.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>' +
        '<div class="fact-box"><b>Simple, interesting facts for you</b><ul>' + d.facts.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div>' +
        '<p class="note" style="margin:10px 0 14px">General awareness only — Dr. Sandesh will guide you based on your scans and check-ups.</p>' +
        '<a class="btn" href="#consult" id="jmBookBtn">Book a Video Consultation</a>';
      infoModal.hidden = false;
      document.body.style.overflow = "hidden";
      document.getElementById("jmBookBtn").onclick = closeInfo;
    });
  });

  /* ---------- 6. CAROUSEL ARROWS & LIFE-STAGE TRIGGERS ---------- */
  function bindScroll(prevId, nextId, trackId) {
    var tr = document.getElementById(trackId), pr = document.getElementById(prevId), nx = document.getElementById(nextId);
    if (!tr || !pr || !nx) return;
    pr.onclick = function () { tr.scrollBy({ left: -320, behavior: "smooth" }); };
    nx.onclick = function () { tr.scrollBy({ left: 320, behavior: "smooth" }); };
  }
  bindScroll("stPrev", "stNext", "demoStoriesGrid");
  bindScroll("jrPrev", "jrNext", "journeyTrack");

  document.querySelectorAll(".lifestage-card").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ck = document.getElementById("checkin");
      if (ck) ck.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.OBGCheckinJump) window.OBGCheckinJump(btn.dataset.stage || "periods_other");
    });
  });
  document.querySelectorAll("[data-hero-stage]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ck = document.getElementById("checkin");
      if (ck) ck.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.OBGCheckinJump) window.OBGCheckinJump(btn.getAttribute("data-hero-stage") || "periods_other");
    });
  });
})();

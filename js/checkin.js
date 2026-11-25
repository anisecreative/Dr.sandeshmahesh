/* Gentle OBGYN Check-in — simple, everyday language for normal viewers.
   Built around Dr. Sandesh's 5 life stages (planning, trimester1, pregnancy, after_birth, periods_other):
   1) What brings you here today?
   2) Quick safety check (plain-English warning signs shown BEFORE asking details)
   3) Optional name + phone (or continue without sharing)
   4) Everyday stage-specific questions (e.g. "Which month are you in?", "What have you been noticing?", "When did you last see a doctor?")
   5) Calm, reassuring summary with a suggested check-in rhythm + WhatsApp (7406886226) / booking CTA. */
(function () {
  var root = document.getElementById("checkin-app");
  if (!root) return;
  var el = window.el;
  var WA_NUM = String((window.SITE_CONFIG || {}).whatsappNumber || "917406886226").replace(/\D/g, "");
  var PHONE = "7406886226";

  var STAGES = [
    { key: "planning", label: "Planning for a baby", hint: "Trying to conceive or planning ahead" },
    { key: "trimester1", label: "Newly pregnant (Months 1–3)", hint: "First trimester" },
    { key: "pregnancy", label: "Pregnant (Month 4 onwards)", hint: "Second or third trimester" },
    { key: "after_birth", label: "After delivery (Postnatal)", hint: "Recovery, feeding & wellbeing" },
    { key: "periods_other", label: "Periods, menopause or check-up", hint: "Cycle changes, hot flushes or general query" }
  ];

  var INTERVALS = {
    planning: "A relaxed pre-pregnancy check-in once, or a chat if you've been trying for 6–12 months.",
    trimester1: "Usually once a month in the first 6 months of pregnancy, as guided by your doctor.",
    pregnancy: "About once a month up to month 6, every 2 weeks in months 7–8, and weekly in month 9.",
    after_birth: "A postnatal check-up for you in the first 6 weeks, or sooner if you feel unwell or low.",
    periods_other: "Once a year for a general check-up, or sooner if periods or comfort change."
  };

  var DANGER = [
    { key: "heavy_bleed", label: "Very heavy bleeding", stages: ["planning", "trimester1", "pregnancy", "after_birth", "periods_other"] },
    { key: "severe_pain", label: "Sudden, severe tummy pain", stages: ["planning", "trimester1", "pregnancy", "after_birth", "periods_other"] },
    { key: "fluid_leak", label: "Water or fluid leaking from below", stages: ["trimester1", "pregnancy"] },
    { key: "less_movement", label: "Baby moving much less than usual", stages: ["pregnancy"] },
    { key: "headache_blur", label: "Severe headache with blurred vision", stages: ["pregnancy", "after_birth"] },
    { key: "fever_faint", label: "High fever, chest pain or feeling faint", stages: ["trimester1", "pregnancy", "after_birth", "periods_other"] }
  ];

  var QUESTIONS = {
    planning: [
      { id: "howlong", type: "single", title: "How long have you been planning or trying?", opts: [
        { k: "just_starting", l: "Just starting / thinking ahead" },
        { k: "under_6m", l: "Less than 6 months" },
        { k: "6_12m", l: "6 to 12 months", soon: true },
        { k: "over_1y", l: "More than a year", soon: true }
      ]},
      { id: "noticing", type: "multi", optional: true, title: "Have you noticed any of these? (Tick what applies)", opts: [
        { k: "irreg", l: "Periods don't come on time", soon: true },
        { k: "pain", l: "Very painful periods", soon: true },
        { k: "weight_skin", l: "Weight gain, acne, or extra hair growth", soon: true },
        { k: "none", l: "None of these — everything feels regular", exclusive: true }
      ]},
      { id: "lastvisit", type: "single", title: "When did you last see a doctor for a check-up?", opts: [
        { k: "visit_recent", l: "In the last few months" },
        { k: "visit_older", l: "More than a year ago" },
        { k: "visit_none", l: "Haven't had one yet" }
      ]}
    ],
    trimester1: [
      { id: "month", type: "single", title: "Which month of pregnancy are you in?", opts: [
        { k: "m1", l: "1st month (just tested positive)" },
        { k: "m2", l: "2nd month (around 5–8 weeks)" },
        { k: "m3", l: "3rd month (around 9–12 weeks)" },
        { k: "unsure", l: "Not sure yet" }
      ]},
      { id: "noticing", type: "multi", optional: true, title: "What have you been feeling lately?", opts: [
        { k: "nausea", l: "Morning sickness / nausea" },
        { k: "tired", l: "Feeling very tired or sleepy" },
        { k: "spotting", l: "Light spotting or mild cramping", soon: true },
        { k: "vomiting_cant_eat", l: "Unable to keep food or water down", soon: true },
        { k: "fine", l: "Mostly feeling fine", exclusive: true }
      ]},
      { id: "done", type: "multi", optional: true, title: "What have you already done so far?", opts: [
        { k: "first_scan", l: "Had my first scan" },
        { k: "blood_tests", l: "Done routine blood tests" },
        { k: "vitamins", l: "Started folic acid / vitamins" },
        { k: "nothing_yet", l: "Nothing yet — just getting started", exclusive: true }
      ]},
      { id: "lastvisit", type: "single", title: "Have you met a doctor for this pregnancy yet?", opts: [
        { k: "visit_recent", l: "Yes, recently" },
        { k: "visit_none", l: "Not yet" }
      ]}
    ],
    pregnancy: [
      { id: "month", type: "single", title: "Which month of pregnancy are you in?", opts: [
        { k: "m4_5", l: "4th or 5th month" },
        { k: "m6_7", l: "6th or 7th month" },
        { k: "m8_9", l: "8th or 9th month" },
        { k: "unsure", l: "Not sure of the exact month" }
      ]},
      { id: "noticing", type: "multi", optional: true, title: "What have you been noticing lately?", opts: [
        { k: "back_cramps", l: "Back ache, leg cramps, or trouble sleeping" },
        { k: "heartburn", l: "Acidity or mild swelling in feet" },
        { k: "sugar_bp", l: "High blood sugar or BP mentioned in a report", soon: true },
        { k: "worried_scan", l: "Confused about a scan or blood report", soon: true },
        { k: "fine", l: "Feeling comfortable overall", exclusive: true }
      ]},
      { id: "done", type: "multi", optional: true, title: "Which of these have been done?", opts: [
        { k: "anomaly_scan", l: "5th-month detailed scan" },
        { k: "sugar_test", l: "Pregnancy blood / sugar tests" },
        { k: "vaccines", l: "Routine pregnancy vaccines" },
        { k: "not_sure", l: "Not sure what is due next", exclusive: true }
      ]},
      { id: "lastvisit", type: "single", title: "When was your last check-up?", opts: [
        { k: "visit_recent", l: "Within the last month" },
        { k: "visit_older", l: "More than a month ago", soon: true },
        { k: "visit_none", l: "Haven't had a regular check-up yet", soon: true }
      ]}
    ],
    after_birth: [
      { id: "month", type: "single", title: "How old is your baby now?", opts: [
        { k: "w1_6", l: "Less than 6 weeks old" },
        { k: "m2_6", l: "2 to 6 months old" },
        { k: "m6_plus", l: "More than 6 months old" }
      ]},
      { id: "noticing", type: "multi", optional: true, title: "How have you been feeling?", opts: [
        { k: "tired", l: "Very tired / not getting enough rest" },
        { k: "feeding", l: "Questions about breastfeeding or feeding" },
        { k: "healing", l: "Stitches, pain, or slow physical recovery", soon: true },
        { k: "low_mood", l: "Feeling low, teary, or overwhelmed most days", soon: true },
        { k: "fine", l: "Recovering well — just checking in", exclusive: true }
      ]},
      { id: "lastvisit", type: "single", title: "Have you had your own check-up after delivery?", opts: [
        { k: "visit_recent", l: "Yes, I had one" },
        { k: "visit_none", l: "Not yet" }
      ]}
    ],
    periods_other: [
      { id: "reason", type: "single", title: "What's on your mind today?", opts: [
        { k: "late_irreg", l: "Periods are late, missed, or irregular", soon: true },
        { k: "heavy_pain", l: "Periods are very heavy or painful", soon: true },
        { k: "menopause", l: "Hot flushes, night sweats, or sleep trouble", soon: true },
        { k: "general", l: "Just a general check-up or browsing after a Reel" }
      ]},
      { id: "noticing", type: "multi", optional: true, title: "Anything else you've noticed? (Skip if none)", opts: [
        { k: "weight_acne", l: "Weight changes, acne, or tiredness", soon: true },
        { k: "pelvic", l: "Lower tummy discomfort or bloating", soon: true },
        { k: "reports", l: "I have a scan or blood report I want explained", soon: true },
        { k: "none", l: "Nothing specific — just curious", exclusive: true }
      ]},
      { id: "lastvisit", type: "single", title: "When did you last see a gynaecologist?", opts: [
        { k: "visit_recent", l: "Within the last year" },
        { k: "visit_older", l: "More than a year ago" },
        { k: "visit_none", l: "Never / a very long time ago" }
      ]}
    ]
  };

  function fresh() {
    return { step: 1, stage: "", danger: [], noDanger: false, name: "", phone: "", skipped: false, qi: 0, ans: {}, note: "", err: "" };
  }
  var st = fresh();

  function clear() { root.textContent = ""; }
  function stageObj() { return STAGES.find(function (s) { return s.key === st.stage; }) || STAGES[0]; }
  function dangerFor() { return DANGER.filter(function (d) { return d.stages.indexOf(st.stage) > -1; }); }
  function qs() { return QUESTIONS[st.stage] || QUESTIONS.periods_other; }

  function topBar(label, pct) {
    root.appendChild(el("div", { class: "ci-top" }, [el("span", { text: label }), el("span", { text: "About 1 minute" })]));
    var bar = el("div", { class: "ci-bar" }, [el("i")]);
    bar.firstChild.style.width = Math.max(8, Math.min(100, pct)) + "%";
    root.appendChild(bar);
  }

  function evaluate() {
    if (st.danger.length) return "urgent";
    var soon = false;
    qs().forEach(function (q) {
      var val = st.ans[q.id];
      var arr = Array.isArray(val) ? val : (val ? [val] : []);
      arr.forEach(function (k) {
        var o = q.opts.find(function (x) { return x.k === k; });
        if (o && o.soon) soon = true;
      });
    });
    return soon ? "talk_soon" : "common";
  }

  function render() {
    clear();

    /* STEP 1: Choose everyday life stage */
    if (st.step === 1) {
      topBar("Getting started", 15);
      root.appendChild(el("h3", { text: "What brings you here today?" }));
      var g = el("div", { class: "opts", role: "radiogroup" });
      var next = el("button", { class: "btn", type: "button", text: "Continue \u2192" });
      next.disabled = !st.stage;
      STAGES.forEach(function (s) {
        var inp = el("input", { type: "radio", name: "stage", value: s.key });
        if (st.stage === s.key) inp.checked = true;
        inp.addEventListener("change", function () {
          st.stage = s.key; st.danger = []; st.noDanger = false; st.ans = {}; st.qi = 0;
          next.disabled = false;
        });
        g.appendChild(el("label", { class: "opt" }, [inp, el("span", {}, [el("div", {}, [el("div", { text: s.label }), el("small", { class: "note", style: "display:block;font-weight:500", text: s.hint })])])]));
      });
      next.onclick = function () { st.step = 2; render(); };
      root.appendChild(g);
      root.appendChild(el("div", { class: "ci-nav" }, [el("span"), next]));
      return;
    }

    /* STEP 2: Quick Safety Check */
    if (st.step === 2) {
      topBar("Quick safety check", 32);
      root.appendChild(el("h3", { text: "Is any of this happening right now?" }));
      root.appendChild(el("p", { class: "hint", text: "Most of the time the answer is none of these, and that is completely fine." }));
      var g = el("div", { class: "opts" });
      var list = dangerFor();
      var next = el("button", { class: "btn", type: "button", text: "Continue \u2192" });
      next.disabled = !st.noDanger && !st.danger.length;

      list.forEach(function (d) {
        var inp = el("input", { type: "checkbox" });
        inp.checked = st.danger.indexOf(d.key) > -1;
        inp.addEventListener("change", function () {
          st.noDanger = false;
          if (inp.checked) st.danger.push(d.key);
          else st.danger = st.danger.filter(function (x) { return x !== d.key; });
          render();
        });
        g.appendChild(el("label", { class: "opt" }, [inp, el("span", { text: d.label })]));
      });

      var noneInp = el("input", { type: "checkbox" });
      noneInp.checked = st.noDanger && !st.danger.length;
      noneInp.addEventListener("change", function () { st.danger = []; st.noDanger = noneInp.checked; render(); });
      g.appendChild(el("label", { class: "opt" }, [noneInp, el("span", { text: "None of these. None of these apply right now" })]));

      var back = el("button", { class: "btn alt", type: "button", text: "\u2190 Back" });
      back.onclick = function () { st.step = 1; render(); };
      next.onclick = function () { st.step = st.danger.length ? 99 : 3; render(); };
      root.appendChild(g);
      root.appendChild(el("div", { class: "ci-nav" }, [back, next]));
      return;
    }

    /* URGENT SAFETY CARD */
    if (st.step === 99) {
      topBar("Please don't wait", 100);
      root.appendChild(el("div", { class: "emergency-box" }, [
        el("strong", { text: "Go to the nearest hospital, or call your doctor now. " }),
        "What you picked needs in-person attention without delay. This check-in cannot replace being seen by a doctor."
      ]));
      var row = el("div", { class: "ci-nav" }, [
        el("a", { class: "btn", href: "tel:" + PHONE, text: "Call " + PHONE }),
        el("button", { class: "btn alt", type: "button", text: "Start again" })
      ]);
      row.lastChild.onclick = function () { st = fresh(); render(); };
      root.appendChild(row);
      return;
    }

    /* STEP 3: Optional Name + Phone */
    if (st.step === 3) {
      topBar("Almost there", 48);
      root.appendChild(el("h3", { text: "Where should we send your summary & tips?" }));
      root.appendChild(el("p", { class: "hint", text: "Share your name and WhatsApp number so Dr. Sandesh's team can send helpful tips and general guidance on WhatsApp." }));
      var f = el("form", { novalidate: "" });
      var nm = el("input", { placeholder: "Your name", value: st.name, maxlength: "60" });
      var ph = el("input", { type: "tel", inputmode: "numeric", placeholder: "10-digit mobile number", value: st.phone, maxlength: "12" });
      var msg = el("p", { class: "note", role: "status", text: st.err });
      var go = el("button", { class: "btn", type: "submit", text: "Continue \u2192" });
      var skip = el("button", { class: "ci-skip", type: "button", text: "Continue without sharing" });
      skip.onclick = function () { st.skipped = true; st.err = ""; st.step = 4; render(); };
      f.appendChild(el("label", { text: "Name" }, [nm]));
      f.appendChild(el("label", { text: "Phone number" }, [ph]));
      f.appendChild(go);
      if (st.err) f.appendChild(msg);
      f.appendChild(skip);
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var n = nm.value.trim(), p = ph.value.replace(/\D/g, "").slice(-10);
        if (n.length < 2 || p.length !== 10) { st.err = "Please enter your name and a 10-digit mobile number, or continue without sharing."; render(); return; }
        st.name = n; st.phone = p; st.err = ""; st.step = 4; render();
      });
      root.appendChild(f);
      var back = el("button", { class: "btn alt", type: "button", text: "\u2190 Back", style: "margin-top:10px" });
      back.onclick = function () { st.step = 2; render(); };
      root.appendChild(back);
      return;
    }

    /* STEP 4: Everyday Stage Questions */
    if (st.step === 4) {
      var list = qs(), q = list[st.qi];
      var pct = 55 + ((st.qi + 1) / list.length) * 40;
      topBar("Question " + (st.qi + 1) + " of " + list.length, pct);
      root.appendChild(el("h3", { text: q.title }));
      var g = el("div", { class: "opts" });
      var cur = st.ans[q.id];
      var sel = Array.isArray(cur) ? cur : (cur ? [cur] : []);
      var isLast = st.qi === list.length - 1;
      var next = el("button", { class: "btn", type: "button", text: isLast ? "See my summary \u2192" : "Next \u2192" });
      next.disabled = !q.optional && !sel.length;

      q.opts.forEach(function (o) {
        var inp = el("input", { type: q.type === "single" ? "radio" : "checkbox", name: q.id, value: o.k });
        inp.checked = sel.indexOf(o.k) > -1;
        inp.addEventListener("change", function () {
          if (q.type === "single") {
            st.ans[q.id] = o.k;
          } else {
            var arr = Array.isArray(st.ans[q.id]) ? st.ans[q.id].slice() : [];
            if (inp.checked) {
              if (o.exclusive) arr = [o.k];
              else {
                arr = arr.filter(function (k) {
                  var xo = q.opts.find(function (z) { return z.k === k; });
                  return !(xo && xo.exclusive);
                });
                arr.push(o.k);
              }
            } else {
              arr = arr.filter(function (k) { return k !== o.k; });
            }
            st.ans[q.id] = arr;
          }
          render();
        });
        g.appendChild(el("label", { class: "opt" }, [inp, el("span", { text: o.l })]));
      });

      var back = el("button", { class: "btn alt", type: "button", text: "\u2190 Back" });
      back.onclick = function () { if (st.qi > 0) { st.qi--; render(); } else { st.step = 3; render(); } };
      next.onclick = function () { if (!isLast) { st.qi++; render(); } else { st.step = 5; render(); } };
      root.appendChild(g);
      root.appendChild(el("div", { class: "ci-nav" }, [back, next]));
      return;
    }

    /* STEP 5: Reassuring Summary (Dr. Sandesh's exact calm tone) */
    var level = evaluate();
    var visit = st.ans.lastvisit;
    var overdue = visit === "visit_older" || visit === "visit_none";
    topBar(st.name ? "Thank you, " + st.name : "Your gentle summary", 100);

    if (level === "talk_soon") {
      root.appendChild(el("h3", { text: "A few things you shared are worth a chat with the doctor." }));
      root.appendChild(el("p", { text: "Nothing to panic about. These are the kind of things a doctor likes to hear about, so you can understand what is going on and feel at ease." }));
    } else {
      root.appendChild(el("h3", { text: "You're moving at a normal pace. There's no need to worry." }));
      root.appendChild(el("p", { text: "What you've shared is common, and nothing here needs a rush. A general check-in at regular intervals is the best way to keep it that way." }));
    }

    root.appendChild(el("div", { class: "ci-insight", style: "margin:12px 0" }, [
      el("p", { text: "A good check-up rhythm for you" }),
      el("p", { class: "note", text: INTERVALS[st.stage] || "" })
    ]));

    if (overdue) {
      root.appendChild(el("p", { class: "note", text: "You mentioned your last check-up was a while ago, so fitting one in when you're free would be a good idea." }));
    }

    var waMsg = "Hello Dr. Sandesh's team, I completed the 1-minute health guide"
      + (st.name ? " (Name: " + st.name + ")" : "")
      + " under: " + stageObj().label + ".";

    root.appendChild(el("div", { class: "bk-acts" }, [
      el("a", { class: "btn", href: "#consult", text: "Book a Video Consultation" }),
      el("a", { class: "btn wa", href: "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(waMsg), target: "_blank", rel: "noopener", text: "Message on WhatsApp" })
    ]));
    var restart = el("button", { class: "ci-skip", type: "button", text: "Start again", style: "margin-top:10px" });
    restart.onclick = function () { st = fresh(); render(); };
    root.appendChild(restart);
  }

  window.OBGCheckinJump = function (stageKey) {
    if (!STAGES.some(function (s) { return s.key === stageKey; })) return;
    st = fresh();
    st.stage = stageKey;
    st.step = 2;
    render();
  };

  render();
})();

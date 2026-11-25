/* Admin UI gate (real security is Supabase RLS via private.is_doctor_admin(doctor_id)). */
(function () {
  ["admin.css", "../css/desktop.css"].forEach(function (h) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = h;
    document.head.appendChild(l);
  });
})();
window.adminReady = (async function () {
  var sb = getSupabase();
  if (!sb) { document.body.textContent = "Supabase is not configured in js/supabase-config.js yet."; return null; }
  var s = await sb.auth.getSession();
  if (!s.data.session) { location.href = "login.html"; return null; }
  var r = await sb.from("doctor_admins").select("doctor_id").eq("doctor_id", SUPABASE_CONFIG.doctorId);
  if (r.error || !r.data.length) {
    var u = s.data.session.user, d = document.body;
    d.textContent = "";
    d.style.cssText = "font-family:system-ui,sans-serif;padding:24px;max-width:560px;margin:0 auto;line-height:1.6";
    function add(t, x) { var e = document.createElement(t); e.textContent = x; d.appendChild(e); return e; }
    add("h1", "Not authorised yet");
    add("p", "You are signed in as " + u.email + ", but this account does not have admin access to Dr. Sandesh Mahesh's website.");
    add("p", "Ask ANISE to add this account to doctor_admins for Dr. Sandesh Mahesh (see docs/ADMIN_SETUP.md). Your account ID is:");
    add("code", u.id);
    var b = add("button", "Sign out and use another account");
    b.style.cssText = "display:block;margin-top:20px;padding:12px 18px;font-size:1rem";
    b.onclick = async function () { await sb.auth.signOut(); location.href = "login.html"; };
    return null;
  }
  var home = /\/(index\.html)?$/.test(location.pathname);
  var bar = document.createElement("div");
  bar.className = "adm-top";
  bar.style.cssText = "display:flex;align-items:center;gap:10px;flex-wrap:nowrap";
  var a = document.createElement("a");
  a.href = "index.html";
  a.textContent = home ? "Dr. Sandesh Admin" : "\u2190 Home";
  a.style.cssText = "flex:none;white-space:nowrap;color:#fff;text-decoration:none;font-weight:800;font-size:.85rem;" + (home ? "" : "padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.16)");
  bar.appendChild(a);
  var sp = document.createElement("span"); sp.className = "sp"; sp.style.cssText = "flex:1;min-width:0"; bar.appendChild(sp);
  var em = document.createElement("span"); em.className = "em"; em.textContent = s.data.session.user.email; bar.appendChild(em);
  var so = document.createElement("button"); so.type = "button"; so.textContent = "Sign out";
  so.style.cssText = "flex:none;white-space:nowrap;color:#fff;background:none;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:7px 14px;font-weight:700;font-size:.8rem;cursor:pointer";
  so.onclick = async function () { await sb.auth.signOut(); location.href = "login.html"; };
  bar.appendChild(so);
  document.body.insertBefore(bar, document.body.firstChild);
  Array.prototype.forEach.call(document.querySelectorAll('section .wrap > p > a[href="index.html"]'), function (x) {
    var p = x.parentNode;
    if (p && p.children.length === 1) p.remove();
  });
  return sb;
})();

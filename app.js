
const PLAN = {"Monday": {"gym": [["High-Bar Back Squat", "3", "5", "Knees track over mid-foot; RPE 5\u20136 initially."], ["DB Bench Press", "3", "8", "Controlled reps; leave 2\u20134 reps in reserve."], ["Chest-Supported Row / Cable Row", "3", "10", "Keep ribs stacked; avoid shrugging."], ["Incline Treadmill Walk", "1", "5\u201310 min", "Easy-moderate incline; steady gait."]], "home": [["Cat-Cow", "1", "10", "Slow, comfortable spinal motion."], ["Tail-Wags", "1", "10/side", "Small, controlled range."], ["Figure 4 Stretch", "2", "30 sec/side", "Gentle hip stretch."], ["Standing Hamstring Stretch", "2", "30 sec/side", "Hinge at hip; no toe-reaching."], ["Dead Bug", "2", "6/side", "Keep low back controlled."], ["Bird-Dog", "2", "6/side", "Reach long; resist trunk rotation."], ["Split Squat", "2", "8/side", "Tripod foot; knee tracks smoothly."], ["Ball Foot Roll", "1", "1 min/foot", "Comfortable pressure only."], ["Calf Stretch", "2", "30 sec/side", "No bouncing."]]}, "Tuesday": {"walk": [["Easy Walk", "1", "20\u201340 min", "Comfortable pace; stop if gait changes."], ["Optional Mobility", "1", "10 min", "Figure 4, hamstring, hip dangle, calf stretch."]]}, "Wednesday": {"gym": [["Romanian Deadlift", "3", "6\u20138", "Soft knees; hips back; stop before lumbar compensation."], ["Incline DB Press", "3", "8", "Controlled reps; no excessive back arch."], ["Face Pull", "3", "12\u201315", "Pull toward face; shoulder blades move naturally."], ["Pallof Press", "2", "10/side", "Resist trunk rotation."], ["Incline Treadmill Walk", "1", "5\u201310 min", "Easy-moderate incline; steady gait."]], "home": [["Hip Dangle", "1", "45 sec", "Relax; do not force toe touch."], ["Bridge", "2", "10", "Glutes drive the movement."], ["Side Plank", "2", "20\u201330 sec/side", "Keep trunk long and stacked."], ["Lateral Band Walk", "2", "10\u201315 steps/side", "Small steps; knees and toes track forward."], ["Tib Raises", "2", "15\u201320", "Controlled lift and lower."], ["Ball Foot Roll", "1", "1 min/foot", "Comfortable pressure only."], ["Calf Stretch", "2", "30 sec/side", "No bouncing."]]}, "Thursday": {"walk": [["Recovery / Optional Walk", "1", "10\u201330 min", "Optional. Keep this genuinely easy."], ["Optional Mobility", "1", "5\u201310 min", "Only if it helps you feel better."]]}, "Friday": {"gym": [["DB Overhead Press", "3", "8", "Ribs stacked; avoid leaning back."], ["Lat Pulldown / Assisted Pull-Up", "3", "8\u201310", "Smooth shoulder motion; no swinging."], ["Leg Press", "3", "10", "Stable tripod foot; knee tracks with toes."], ["Hamstring Curl", "2\u20133", "10\u201312", "Controlled full range."], ["Incline Treadmill Walk", "1", "10 min", "Moderate, sustainable effort."]], "home": [["Step-Ups", "2", "8/side", "Use a low step; control the lowering phase."], ["Single-Leg RDL", "2", "8/side", "Light load; square hips; stable foot."], ["Side Plank", "2", "20\u201330 sec/side", "Keep trunk stacked."], ["Tib Raises", "2", "15\u201320", "Controlled lift and lower."], ["Ball Foot Roll", "1", "1 min/foot", "Comfortable pressure only."], ["Calf Stretch", "2", "30 sec/side", "No bouncing."]]}, "Saturday": {"walk": [["Trail Walk / Hike", "1", "30\u201390 min", "Easy terrain initially; avoid aggressive downhill work."]]}, "Sunday": {"walk": [["Recovery Walk", "1", "20\u201340 min", "Should feel restorative, not like training."], ["Optional Mobility", "1", "5\u201310 min", "Calf, foot, hip and back mobility as helpful."]]}};
const TYPES = {
  gym: "GYM",
  home: "HOME",
  walk: "WALK / TRAIL"
};

function mondayOfCurrentWeek() {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const m = new Date(d);
  m.setHours(0,0,0,0);
  m.setDate(d.getDate() + diff);
  return m.toISOString().slice(0,10);
}

const weekKey = mondayOfCurrentWeek();
const storageKey = "trailStrong:v1";
let state = JSON.parse(localStorage.getItem(storageKey) || "{}");
state.logs ||= {};
state.weeks ||= {};
state.weeks[weekKey] ||= {};

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  updateProgress();
}

function itemId(day, type, index) {
  return `${day}|${type}|${index}`;
}

function persistentLog(id) {
  state.logs[id] ||= { weight:"", actual:"", notes:"" };
  return state.logs[id];
}

function weekLog(id) {
  state.weeks[weekKey][id] ||= { done:false };
  return state.weeks[weekKey][id];
}

function exerciseCard(day, type, exercise, index) {
  const [name, sets, reps, cue] = exercise;
  const id = itemId(day, type, index);
  const tpl = document.getElementById("exerciseTemplate");
  const node = tpl.content.firstElementChild.cloneNode(true);
  const log = persistentLog(id);
  const wk = weekLog(id);

  node.querySelector(".exercise-name").textContent = name;
  node.querySelector(".dose").textContent = `${sets} set${sets === "1" ? "" : "s"} × ${reps}`;
  const cueEl = node.querySelector(".cue");
  cueEl.textContent = cue;
  const check = node.querySelector(".complete-check");
  check.checked = !!wk.done;
  if (wk.done) node.classList.add("done");

  const weight = node.querySelector(".weight-input");
  const actual = node.querySelector(".actual-input");
  const notes = node.querySelector(".notes-input");
  weight.value = log.weight || "";
  actual.value = log.actual || "";
  notes.value = log.notes || "";

  check.addEventListener("change", () => {
    wk.done = check.checked;
    node.classList.toggle("done", check.checked);
    save();
  });
  node.querySelector(".details-btn").addEventListener("click", () => cueEl.classList.toggle("hidden"));
  weight.addEventListener("input", () => { log.weight = weight.value; save(); });
  actual.addEventListener("input", () => { log.actual = actual.value; save(); });
  notes.addEventListener("input", () => { log.notes = notes.value; save(); });
  return node;
}

function sectionFor(day, type, exercises, showDay=true) {
  const block = document.createElement("div");
  block.className = "day-block";
  if (showDay) {
    const hdr = document.createElement("div");
    hdr.className = "day-header";
    hdr.innerHTML = `<h3>${day}</h3><span>${exercises.length} items</span>`;
    block.appendChild(hdr);
  }
  const label = document.createElement("div");
  label.className = "type-label";
  label.textContent = TYPES[type];
  block.appendChild(label);
  exercises.forEach((ex, i) => block.appendChild(exerciseCard(day, type, ex, i)));
  return block;
}

function renderType(type, targetId) {
  const target = document.getElementById(targetId);
  target.innerHTML = "";
  Object.entries(PLAN).forEach(([day, groups]) => {
    if (groups[type]) target.appendChild(sectionFor(day, type, groups[type]));
  });
}

function renderToday() {
  const day = new Intl.DateTimeFormat("en-US", {weekday:"long"}).format(new Date());
  const label = new Intl.DateTimeFormat("en-US", {weekday:"long", month:"short", day:"numeric"}).format(new Date());
  document.getElementById("todayLabel").textContent = label;
  const target = document.getElementById("todayContent");
  target.innerHTML = "";
  const groups = PLAN[day];
  if (!groups) {
    target.innerHTML = '<div class="empty-card">No scheduled work today. Recovery counts.</div>';
    return;
  }
  Object.entries(groups).forEach(([type, exercises]) => target.appendChild(sectionFor(day, type, exercises, false)));
}

function updateProgress() {
  const allIds = [];
  Object.entries(PLAN).forEach(([day, groups]) => {
    Object.entries(groups).forEach(([type, exercises]) => {
      exercises.forEach((_, i) => allIds.push(itemId(day,type,i)));
    });
  });
  const completed = allIds.filter(id => state.weeks[weekKey]?.[id]?.done).length;
  const pct = allIds.length ? Math.round(completed / allIds.length * 100) : 0;
  document.getElementById("weekProgress").textContent = `${pct}% complete`;
  document.getElementById("weekProgressBar").style.width = `${pct}%`;
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});
  });
});

document.getElementById("resetWeekBtn").addEventListener("click", () => {
  if (confirm("Reset completion checks for this week? Your weights and notes will stay saved.")) {
    state.weeks[weekKey] = {};
    save();
    renderAll();
  }
});

function renderAll() {
  renderToday();
  renderType("gym", "gymContent");
  renderType("home", "homeContent");
  renderType("walk", "walkContent");
  updateProgress();
}

let deferredPrompt;
window.__trailInstallPromptFired = false;
window.__trailInstallPromptPlatforms = [];
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.__trailInstallPromptFired = true;
  window.__trailInstallPromptPlatforms = e.platforms || [];
  installBtn.classList.remove("hidden");
  setTimeout(runDiagnostics, 50);
});
window.addEventListener("appinstalled", () => {
  window.__trailAppInstalled = true;
  setTimeout(runDiagnostics, 50);
});
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/shiny-octo-fiesta/sw.js", { scope: "/shiny-octo-fiesta/" }));
}


async function imageCheck(url, expected) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({
      ok: img.naturalWidth === expected && img.naturalHeight === expected,
      value: `${img.naturalWidth}×${img.naturalHeight}`
    });
    img.onerror = () => resolve({ok:false, value:"failed to load"});
    img.src = url + "?diag=" + Date.now();
  });
}

function diagRow(label, value, status="warn") {
  const row = document.createElement("div");
  row.className = `diag-row diag-${status}`;
  const a = document.createElement("span");
  a.textContent = label;
  const b = document.createElement("strong");
  b.textContent = String(value);
  row.append(a,b);
  return row;
}

async function runDiagnostics() {
  const grid = document.getElementById("diagGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const rows = [];
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  rows.push(["Secure context", window.isSecureContext ? "YES" : "NO", window.isSecureContext ? "ok" : "bad"]);
  rows.push(["Current path", location.pathname, location.pathname.startsWith("/shiny-octo-fiesta/") ? "ok" : "bad"]);
  rows.push(["Standalone mode", standalone ? "YES" : "NO", standalone ? "ok" : "warn"]);
  rows.push(["beforeinstallprompt fired", window.__trailInstallPromptFired ? "YES" : "NO", window.__trailInstallPromptFired ? "ok" : "bad"]);

  const manifestLink = document.querySelector('link[rel="manifest"]');
  rows.push(["Manifest link", manifestLink ? manifestLink.href : "missing", manifestLink ? "ok" : "bad"]);

  try {
    const r = await fetch(manifestLink.href + "?diag=" + Date.now(), {cache:"no-store"});
    rows.push(["Manifest HTTP", `${r.status} ${r.statusText}`, r.ok ? "ok" : "bad"]);
    const m = await r.json();
    rows.push(["Manifest start_url", m.start_url || "missing", m.start_url === "/shiny-octo-fiesta/" ? "ok" : "bad"]);
    rows.push(["Manifest scope", m.scope || "missing", m.scope === "/shiny-octo-fiesta/" ? "ok" : "bad"]);
    rows.push(["Manifest display", m.display || "missing", ["standalone","fullscreen","minimal-ui"].includes(m.display) ? "ok" : "bad"]);
    rows.push(["192 icon declared", (m.icons||[]).some(i => i.sizes?.includes("192x192")) ? "YES":"NO", (m.icons||[]).some(i => i.sizes?.includes("192x192")) ? "ok":"bad"]);
    rows.push(["512 icon declared", (m.icons||[]).some(i => i.sizes?.includes("512x512")) ? "YES":"NO", (m.icons||[]).some(i => i.sizes?.includes("512x512")) ? "ok":"bad"]);
  } catch (e) {
    rows.push(["Manifest parse", e.message, "bad"]);
  }

  const i192 = await imageCheck("/shiny-octo-fiesta/icons/icon-192.png", 192);
  const i512 = await imageCheck("/shiny-octo-fiesta/icons/icon-512.png", 512);
  rows.push(["192 icon file", i192.value, i192.ok ? "ok":"bad"]);
  rows.push(["512 icon file", i512.value, i512.ok ? "ok":"bad"]);

  if ("serviceWorker" in navigator) {
    rows.push(["Service worker API", "YES", "ok"]);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/shiny-octo-fiesta/");
      rows.push(["SW registration", reg ? "FOUND" : "NOT FOUND", reg ? "ok":"bad"]);
      if (reg) {
        rows.push(["SW scope", reg.scope, reg.scope.endsWith("/shiny-octo-fiesta/") ? "ok":"bad"]);
        rows.push(["SW active", reg.active ? reg.active.state : "none", reg.active?.state === "activated" ? "ok":"warn"]);
      }
      rows.push(["Page controlled by SW", navigator.serviceWorker.controller ? "YES":"NO", navigator.serviceWorker.controller ? "ok":"bad"]);
    } catch (e) {
      rows.push(["Service worker error", e.message, "bad"]);
    }
  } else {
    rows.push(["Service worker API", "NO", "bad"]);
  }

  rows.push(["User agent", navigator.userAgent, "warn"]);
  rows.forEach(r => grid.appendChild(diagRow(...r)));

  window.__trailDiagnosticsText = rows.map(r => `${r[0]}: ${r[1]}`).join("\n");
}

document.getElementById("runDiagBtn")?.addEventListener("click", runDiagnostics);

document.getElementById("copyDiagBtn")?.addEventListener("click", async () => {
  await runDiagnostics();
  try {
    await navigator.clipboard.writeText(window.__trailDiagnosticsText || "");
    alert("Diagnostics copied.");
  } catch {
    prompt("Copy diagnostics:", window.__trailDiagnosticsText || "");
  }
});

document.getElementById("resetPwaBtn")?.addEventListener("click", async () => {
  if (!confirm("Reset Trail Strong's service worker and PWA caches? Workout logs and weights will stay saved.")) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.filter(r => r.scope.includes("/shiny-octo-fiesta/")).map(r => r.unregister()));
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("trail-strong")).map(k => caches.delete(k)));
  } finally {
    location.reload(true);
  }
});

setTimeout(runDiagnostics, 1200);

renderAll();

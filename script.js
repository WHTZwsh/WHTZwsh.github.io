const TOTAL = 600;
const PHASES = [
  { name:"① 🐢 缓缓", desc:"开始温暖红肠", from:0,   to:150, emoji:"🛫" },
  { name:"② 🚀 冲刺加速", desc:"卤快点啊！",   from:150, to:300, emoji:"✈️" },
  { name:"③ ✨ 有感觉了", desc:"牛奶快挤出来了吗",   from:300, to:450, emoji:"🛩️" },
  { name:"④ 🛬 平稳落地", desc:"爽", from:450, to:600, emoji:"🛬" },
];

let elapsed = 0, timerId = null, paused = false, phaseIdx = -1, lastTick = 0, groundSpeed = 2;
const $ = id => document.getElementById(id);
const plane = $("plane"), sky = $("sky");
const clouds = [];

function fmt(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(Math.floor(s % 60)).padStart(2, "0");
  return m + ":" + ss;
}

function initStars() {
  for (let i = 0; i < 50; i++) {
    const s = document.createElement("div");
    s.className = "star"; s.textContent = "✨";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 60 + "vh";
    s.style.animationDelay = (Math.random() * 2.4) + "s";
    s.style.fontSize = (8 + Math.random() * 12) + "px";
    sky.appendChild(s);
  }
}

function initClouds() {
  for (let i = 0; i < 10; i++) {
    const c = document.createElement("div");
    c.className = "cloud";
    c.textContent = ["☁️", "⛅", "🌥️"][i % 3];
    c.style.top = (5 + Math.random() * 55) + "vh";
    c.style.fontSize = (30 + Math.random() * 50) + "px";
    c.style.animationDuration = (30 + Math.random() * 50) + "s";
    c.style.animationName = i % 2 ? "driftL" : "driftR";
    c.style.animationTimingFunction = "linear";
    c.style.animationIterationCount = "infinite";
    sky.appendChild(c);
    clouds.push(c);
  }
}

function setPhase(i) {
  if (i === phaseIdx) return;
  phaseIdx = i;
  const p = PHASES[i];
  $("phaseName").textContent = p.name;
  $("phaseDesc").textContent = p.desc;
  plane.textContent = p.emoji;
  const f = $("flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  document.querySelectorAll(".star").forEach(s => s.style.opacity = i >= 2 ? ".9" : ".25");
  $("sun").style.opacity = i >= 2 ? "0" : "1";
  $("moon").style.opacity = i >= 2 ? "1" : "0";
}

function spawnParticle(e) {
  const pt = document.createElement("div");
  pt.className = "particle"; pt.textContent = e;
  const r = plane.getBoundingClientRect();
  pt.style.left = (r.left + r.width / 2 - 10 + (Math.random() - .5) * 60) + "px";
  pt.style.top = (r.top + r.height / 2) + "px";
  document.body.appendChild(pt);
  setTimeout(() => pt.remove(), 1500);
}

function render() {
  const p = Math.min(elapsed / TOTAL, 1);
  $("bar").style.width = (p * 100) + "%";
  $("timer").textContent = fmt(elapsed);
  let x, y, tilt, scale = 1;
  if (p < 0.25) {
    const t = ease(p / 0.25);
    x = 8 + t * 22; y = 0; tilt = -t * 4; plane.textContent = "🛫";
    groundSpeed = 2 + t * 6;
  } else if (p < 0.5) {
    const t = (p - 0.25) / 0.25;
    x = 30 + t * 30; y = -t * t * 160; tilt = -15 - t * 10;
    plane.textContent = "✈️"; scale = 1 + t * 0.15;
    groundSpeed = 20 + t * 60;
    if (Math.random() < .25) spawnParticle(["💨", "🔥", "💥", "⚡"][Math.floor(Math.random() * 4)]);
  } else if (p < 0.75) {
    const t = (p - 0.5) / 0.25;
    x = 60 + Math.sin(t * Math.PI * 4) * 8;
    y = -160 - Math.sin(t * Math.PI * 2) * 36;
    tilt = -28 + Math.sin(t * Math.PI * 6) * 10;
    plane.textContent = "🛩️"; scale = 1.15;
    groundSpeed = 120;
    if (Math.random() < .3) spawnParticle(["✨", "⭐", "🌈", "💫"][Math.floor(Math.random() * 4)]);
  } else {
    const t = ease((p - 0.75) / 0.25);
    x = 60 + t * 30;
    y = -160 + Math.pow(t, 1.6) * 160;
    tilt = 8 - 8 * Math.min(t * 2, 1);
    plane.textContent = t > 0.9 ? "🛬" : "✈️"; scale = 1.15 - t * 0.15;
    groundSpeed = 120 - t * 118;
    if (t > 0.92) spawnParticle("💨");
  }
  plane.style.transform = `translate(${x}vw, ${y}px) rotate(${tilt}deg) scale(${scale})`;
  clouds.forEach(c => {
    const dur = parseFloat(c.style.animationDuration) || 40;
    c.style.animationDuration = Math.max(6, dur - groundSpeed * 0.12) + "s";
  });
  if (p >= 1) land();
}

function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function land() {
  clearInterval(timerId);
  setPhase(3);
  $("banner").classList.add("show");
  $("controls").classList.remove("show");
  $("phaseName").textContent = "🛬 已落地";
  $("phaseDesc").textContent = "本次起飞全程 10 分钟";
}

function bindEvents() {
  $("btnStart").onclick = () => {
    $("overlay").classList.add("hidden");
    $("controls").classList.add("show");
    setPhase(0);
    lastTick = Date.now();
    timerId = setInterval(() => {
      if (paused) { lastTick = Date.now(); return; }
      const now = Date.now();
      elapsed += (now - lastTick) / 1000; lastTick = now;
      for (let i = 0; i < 4; i++) if (elapsed >= PHASES[i].from) setPhase(i);
      render();
    }, 200);
  };
  $("btnPause").onclick = () => {
    paused = !paused;
    $("btnPause").textContent = paused ? "▶️" : "⏸";
  };
  $("btnSkip").onclick = () => { elapsed = TOTAL - 0.01; render(); };
}

initStars();
initClouds();
bindEvents();

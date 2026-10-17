/* ========== 配置 ========== */
const TOTAL = 600; // 10 分钟，单位秒
const PHASES = [
  { name:"① 🐢 缓缓滑跑", desc:"放松… 飞机正在跑道上慢慢积蓄力量", from:0,   to:150, emoji:"🛫" },
  { name:"② 🚀 全力冲刺", desc:"引擎全开！速度表指针疯狂上蹿！",   from:150, to:300, emoji:"✈️" },
  { name:"③ ✨ 有感觉了", desc:"冲出云霄！这就是飞一般的感觉～",   from:300, to:450, emoji:"🛩️" },
  { name:"④ 🛬 平稳落地", desc:"收油门、放襟翼、对准跑道… 轻轻接地", from:450, to:600, emoji:"🛬" },
];

/* ========== 状态 ========== */
let elapsed = 0, timerId = null, paused = false, phaseIdx = -1, lastTick = 0, groundSpeed = 2;
const $ = id => document.getElementById(id);
const plane = $("plane"), sky = $("sky");
const clouds = [];

/* ========== 场景初始化 ========== */
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

/* ========== 工具函数 ========== */
function fmt(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return m + ":" + ss;
}
function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function setPhase(i) {
  if (i === phaseIdx) return;
  phaseIdx = i;
  const p = PHASES[i];
  $("phaseName").textContent = p.name;
  $("phaseDesc").textContent = p.desc;
  plane.textContent = p.emoji;
  const f = $("flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  // 视觉氛围：高空阶段星空亮起、太阳换月亮
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

/* ========== 渲染 ========== */
function render() {
  const p = Math.min(elapsed / TOTAL, 1);
  $("bar").style.width = (p * 100) + "%";
  $("timer").textContent = fmt(Math.floor(elapsed));

  let x, y, tilt, scale = 1;
  if (p < 0.25) {            // 阶段1：地面缓行
    const t = ease(p / 0.25);
    x = 8 + t * 22; y = 0; tilt = -t * 4; plane.textContent = "🛫";
    groundSpeed = 2 + t * 6;
  } else if (p < 0.5) {      // 阶段2：冲刺+抬轮爬升
    const t = (p - 0.25) / 0.25;
    x = 30 + t * 30; y = -t * t * 160; tilt = -15 - t * 10;
    plane.textContent = "✈️"; scale = 1 + t * 0.15;
    groundSpeed = 20 + t * 60;
    if (Math.random() < .25) spawnParticle(["💨", "🔥", "💥", "⚡"][Math.floor(Math.random() * 4)]);
  } else if (p < 0.75) {     // 阶段3：高空巡航
    const t = (p - 0.5) / 0.25;
    x = 60 + Math.sin(t * Math.PI * 4) * 8;
    y = -160 - Math.sin(t * Math.PI * 2) * 36;
    tilt = -28 + Math.sin(t * Math.PI * 6) * 10;
    plane.textContent = "🛩️"; scale = 1.15;
    groundSpeed = 120;
    if (Math.random() < .3) spawnParticle(["✨", "⭐", "🌈", "💫"][Math.floor(Math.random() * 4)]);
  } else {                   // 阶段4：下降落地
    const t = ease((p - 0.75) / 0.25);
    x = 60 + t * 30;
    y = -160 + Math.pow(t, 1.6) * 160;
    tilt = 8 - 8 * Math.min(t * 2, 1);
    plane.textContent = t > 0.9 ? "🛬" : "✈️"; scale = 1.15 - t * 0.15;
    groundSpeed = 120 - t * 118;
    if (t > 0.92) spawnParticle("💨");
  }
  plane.style.transform = `translate(${x}vw, ${y}px) rotate(${tilt}deg) scale(${scale})`;

  // 云层随速度反向移动（速度感）
  clouds.forEach(c => {
    const dur = parseFloat(c.style.animationDuration) || 40;
    c.style.animationDuration = Math.max(6, dur - groundSpeed * 0.12) + "s";
  });

  if (p >= 1) land();
}

function land() {
  clearInterval(timerId);
  setPhase(3);
  $("banner").classList.add("show");
  $("controls").classList.remove("show");
  $("phaseName").textContent = "🛬 已落地";
  $("phaseDesc").textContent = "本次飞行全程 10 分钟，完美收官 ✔";
}

/* ========== 事件绑定 ========== */
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
    $("btnPause").textContent = paused ? "▶️ 继续" : "⏸ 暂停";
  };
  $("btnSkip").onclick = () => { elapsed = TOTAL - 0.01; render(); };
}

/* ========== 启动 ========== */
initStars();
initClouds();
bindEvents();

// =======================
// 🎯 STATE
// =======================
const fpsEl = document.getElementById("fps");
const pingEl = document.getElementById("ping");
const statusEl = document.getElementById("status");

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

let fpsHistory = [];
let pingHistory = [];
let autoMode = false;


// =======================
// 🎯 FPS TRACKER
// =======================
let lastFrame = performance.now();

function updateFPS() {
    const now = performance.now();
    const fps = Math.round(1000 / (now - lastFrame));
    lastFrame = now;

    fpsEl.textContent = fps;

    fpsHistory.push(fps);
    if (fpsHistory.length > 50) fpsHistory.shift();

    requestAnimationFrame(updateFPS);
}
updateFPS();


// =======================
// 🌐 PING MONITOR
// =======================
async function getPing() {
    const start = performance.now();

    try {
        await fetch("https://www.google.com/favicon.ico", {
            mode: "no-cors",
            cache: "no-store"
        });
    } catch {}

    const ping = Math.round(performance.now() - start);

    pingEl.textContent = ping;

    pingHistory.push(ping);
    if (pingHistory.length > 50) pingHistory.shift();

    updateStatus();
}
setInterval(getPing, 2000);


// =======================
// ⚠️ STATUS SYSTEM
// =======================
function updateStatus() {
    const avgFPS = average(fpsHistory);
    const avgPing = average(pingHistory);

    let status = "Stable";

    if (avgFPS < 30 || avgPing > 200) {
        status = "Lagging ⚠️";
    }

    if (avgFPS < 20 || avgPing > 400) {
        status = "Severe Lag 🚨";
    }

    statusEl.textContent = status;

    if (autoMode) autoOptimize(avgFPS, avgPing);
}

function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length || 0;
}


// =======================
// 🧠 AUTO OPTIMIZER
// =======================
function autoOptimize(fps, ping) {
    if (fps < 30) {
        document.body.style.filter = "brightness(0.9)";
        console.log("Optimizing visuals...");
    }

    if (fps < 20) {
        document.body.style.filter = "blur(1px)";
        console.log("Aggressive optimization...");
    }

    if (ping > 300) {
        console.log("Network unstable...");
    }
}


// =======================
// 📊 GRAPH SYSTEM
// =======================
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // FPS (green)
    ctx.beginPath();
    fpsHistory.forEach((v, i) => {
        ctx.lineTo(i * 5, 100 - v);
    });
    ctx.strokeStyle = "lime";
    ctx.stroke();

    // Ping (red)
    ctx.beginPath();
    pingHistory.forEach((v, i) => {
        ctx.lineTo(i * 5, 100 - v / 5);
    });
    ctx.strokeStyle = "red";
    ctx.stroke();

    requestAnimationFrame(drawGraph);
}
drawGraph();


// =======================
// 🖱 DRAG SYSTEM
// =======================
const overlay = document.getElementById("overlay");
const header = document.getElementById("header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.onmousedown = (e) => {
    isDragging = true;
    offsetX = e.clientX - overlay.offsetLeft;
    offsetY = e.clientY - overlay.offsetTop;
};

document.onmousemove = (e) => {
    if (isDragging) {
        overlay.style.left = (e.clientX - offsetX) + "px";
        overlay.style.top = (e.clientY - offsetY) + "px";
    }
};

document.onmouseup = () => {
    isDragging = false;
};


// =======================
// 🔘 BUTTON
// =======================
const btn = document.getElementById("perfBtn");

btn.onclick = () => {
    autoMode = !autoMode;

    btn.classList.toggle("active");
    btn.textContent = autoMode
        ? "Disable Auto Optimize"
        : "Enable Auto Optimize";
};

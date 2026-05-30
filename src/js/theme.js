/* ============================================
   theme.js - White Space / Black Space Portal
   ============================================ */

const EXPAND_MS = 520;
const MESSAGE_MS = 1340;
const REVEAL_MS = 520;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function animateVolume(music, targetVolume, duration = 520) {
  if (!music?.isMusicPlaying?.()) {
    return Promise.resolve();
  }

  const startVolume = music.getVolume();
  const startTime = performance.now();

  return new Promise((resolve) => {
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      music.setVolume(startVolume + (targetVolume - startVolume) * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
        return;
      }

      resolve();
    }

    requestAnimationFrame(tick);
  });
}

function playDreamNoise() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const context = new AudioContext();
  const duration = 1.05;
  const bufferSize = context.sampleRate * duration;
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const channel = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  noise.buffer = noiseBuffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(620, context.currentTime);
  filter.frequency.exponentialRampToValueAtTime(180, context.currentTime + duration);
  filter.Q.value = 0.72;

  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.075, context.currentTime + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  noise.start();
  noise.stop(context.currentTime + duration);

  noise.addEventListener("ended", () => {
    context.close();
  });
}

function getPortalGeometry(themeToggle) {
  const rect = themeToggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const corners = [
    Math.hypot(x, y),
    Math.hypot(window.innerWidth - x, y),
    Math.hypot(x, window.innerHeight - y),
    Math.hypot(window.innerWidth - x, window.innerHeight - y)
  ];

  return {
    x,
    y,
    scale: (Math.max(...corners) * 2.18) / 48
  };
}

function createPortalOverlay(themeToggle, isEnteringBlack) {
  const { x, y, scale } = getPortalGeometry(themeToggle);
  const overlay = document.createElement("div");
  const circle = document.createElement("div");
  const message = document.createElement("p");

  overlay.className = "space-portal";
  overlay.setAttribute("aria-hidden", "true");

  circle.className = "space-portal-circle";
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.background = isEnteringBlack ? "#050505" : "#fffdf8";

  message.className = "space-portal-message";
  message.textContent = isEnteringBlack ? "entering black space..." : "waking up...";

  overlay.style.setProperty("--portal-text", isEnteringBlack ? "#fffdf8" : "#161514");
  overlay.append(circle, message);
  document.body.append(overlay);

  return { overlay, circle, message, scale };
}

function setTheme(isDark, themeToggle) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.textContent = isDark ? "modo: black space" : "modo: white space";
  themeToggle.setAttribute("aria-label", isDark ? "retornar para white space" : "entrar em black space");
}

export function initTheme(music) {
  const themeToggle = document.querySelector("#themeToggle");
  let isTransitioning = false;

  setTheme(document.body.classList.contains("dark-mode"), themeToggle);

  themeToggle.addEventListener("click", async () => {
    if (isTransitioning) {
      return;
    }

    isTransitioning = true;
    themeToggle.disabled = true;
    document.body.classList.add("space-transitioning");

    const isEnteringBlack = !document.body.classList.contains("dark-mode");
    const originalVolume = music?.getVolume?.() ?? 0.45;
    const { overlay, circle, message, scale } = createPortalOverlay(themeToggle, isEnteringBlack);

    document.body.classList.toggle("space-transition-entering-black", isEnteringBlack);
    document.body.classList.toggle("space-transition-returning-white", !isEnteringBlack);

    playDreamNoise();
    animateVolume(music, Math.max(originalVolume * 0.28, 0.08), 520);

    circle.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.18)" },
        { transform: `translate(-50%, -50%) scale(${scale})` }
      ],
      {
        duration: EXPAND_MS,
        easing: "cubic-bezier(0.72, 0, 0.16, 1)",
        fill: "forwards"
      }
    );

    await wait(EXPAND_MS);
    overlay.classList.add("is-covered");
    setTheme(isEnteringBlack, themeToggle);

    await wait(40);
    message.classList.add("is-visible");
    await wait(MESSAGE_MS);
    message.classList.remove("is-visible");
    await wait(60);

    circle.animate(
      [
        { transform: `translate(-50%, -50%) scale(${scale})` },
        { transform: "translate(-50%, -50%) scale(0.18)" }
      ],
      {
        duration: REVEAL_MS,
        easing: "cubic-bezier(0.72, 0, 0.16, 1)",
        fill: "forwards"
      }
    );

    await wait(REVEAL_MS);
    overlay.remove();
    document.body.classList.remove(
      "space-transitioning",
      "space-transition-entering-black",
      "space-transition-returning-white"
    );
    animateVolume(music, originalVolume, 420);

    themeToggle.disabled = false;
    isTransitioning = false;
  });
}

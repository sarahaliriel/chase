/* ============================================
   memoryBox.js - Shared Memory Box Interaction
   ============================================ */

export function initMemoryBox(dialogueModule) {
  const boxButton = document.querySelector("#memoryBoxButton");
  const boxImage = document.querySelector("#memoryBoxImage");
  const memoryItems = document.querySelector("#memoryItems");

  if (!boxButton || !boxImage || !memoryItems || !dialogueModule) return;

  const REQUIRED_SHAKES = 6;
  const unlockAchievements = [
    "parece pesado...",
    "ainda nao...",
    "voce ouviu alguma coisa.",
    "tem algo se mexendo la dentro!",
    "quase la...",
    "memorias desbloqueadas XD"
  ];
  const unlockLabels = [
    "o bau parece emperrado",
    "acho que tem algo preso aqui...",
    "ele mexeu um pouquinho",
    "tem alguma coisa ai dentro",
    "a tampa quase abriu",
    "so mais um empurraozinho..."
  ];
  const escapeDelays = [200, 340, 480, 620];
  const particleGlyphs = ["✦", "✿", "♡", "⌁", "✧", "╱", "﹏", "♡", "✦"];

  const label = boxButton.querySelector("span");
  const items = Array.from(memoryItems.querySelectorAll(".memory-item"));
  const openedItems = new Set();
  let hasOpenedBox = false;
  let hasShownFinalMessage = false;
  let unlockProgress = 0;
  let isFinishingUnlock = false;

  boxButton.dataset.unlockState = "0";

  items.forEach((item) => {
    item.disabled = true;
    item.tabIndex = -1;
  });

  function showAchievement(text) {
    if (dialogueModule.showAchievement) {
      dialogueModule.showAchievement(text);
    }
  }

  function shakeBox(progress) {
    boxButton.classList.remove("is-shaking", "is-final-unlock");
    boxButton.style.setProperty("--lid-gap", `${Math.min(progress + 2, 7)}px`);
    boxButton.style.setProperty("--lid-tilt", `${progress * 0.45}deg`);
    boxButton.style.setProperty("--lid-lift", `${progress * -1}px`);
    boxButton.style.setProperty("--shake-x-strong", `${progress * 1.5}px`);
    boxButton.style.setProperty("--shake-x-soft", `${progress * 0.7}px`);
    boxButton.style.setProperty("--shake-x-strong-negative", `${progress * -1.2}px`);
    boxButton.style.setProperty("--shake-x-soft-negative", `${progress * -0.7}px`);
    boxButton.style.setProperty("--shake-y", `${progress * 1.1}px`);
    boxButton.style.setProperty("--shake-rotate-strong", `${progress * 1.1}deg`);
    boxButton.style.setProperty("--shake-rotate-soft", `${progress * 0.7}deg`);
    boxButton.style.setProperty("--shake-scale-x-up", `${1 + progress * 0.006}`);
    boxButton.style.setProperty("--shake-scale-x-down", `${1 - progress * 0.004}`);
    boxButton.style.setProperty("--shake-scale-y-up", `${1 + progress * 0.006}`);
    boxButton.style.setProperty("--shake-scale-y-down", `${1 - progress * 0.005}`);

    void boxButton.offsetWidth;

    if (progress >= REQUIRED_SHAKES) {
      boxButton.classList.add("is-final-unlock");
    } else {
      boxButton.classList.add("is-shaking");
    }
  }

  function scatterParticles() {
    const particles = document.createElement("div");
    particles.className = "memory-particles";
    particles.setAttribute("aria-hidden", "true");

    particleGlyphs.forEach((glyph, index) => {
      const particle = document.createElement("span");
      particle.textContent = glyph;
      particle.style.setProperty("--particle-x", `${[-78, -42, -12, 26, 62, 88, -64, 18, 74][index]}px`);
      particle.style.setProperty("--particle-y", `${[-56, -86, -42, -78, -38, -68, -12, 6, -4][index]}px`);
      particle.style.setProperty("--particle-rotate", `${[-18, 14, -7, 21, -12, 8, 28, -24, 16][index]}deg`);
      particle.style.setProperty("--particle-mid-x", `${[-61, -33, -9, 20, 48, 69, -50, 14, 58][index]}px`);
      particle.style.setProperty("--particle-mid-y", `${[-40, -62, -30, -56, -27, -49, -9, 4, -3][index]}px`);
      particle.style.setProperty("--particle-rotate-end", `${[-25, 20, -10, 30, -17, 11, 39, -34, 22][index]}deg`);
      particle.style.setProperty("--particle-delay", `${index * 70}ms`);
      particles.appendChild(particle);
    });

    boxButton.insertAdjacentElement("afterend", particles);

    setTimeout(() => {
      particles.remove();
    }, 2600);
  }

  function openBox() {
    if (!hasOpenedBox) {
      hasOpenedBox = true;
      isFinishingUnlock = false;
      boxButton.classList.remove("is-shaking", "is-final-unlock");
      boxButton.dataset.unlockState = String(REQUIRED_SHAKES);
      boxButton.classList.add("is-open");
      memoryItems.classList.add("is-visible");
      memoryItems.setAttribute("aria-hidden", "false");
      boxImage.src = boxImage.dataset.openSrc || boxImage.src;
      boxImage.alt = "Caixa de memórias aberta";
      boxButton.setAttribute("aria-label", "caixa de memorias aberta");
      scatterParticles();

      items.forEach((item, index) => {
        item.style.setProperty("--memory-delay", `${escapeDelays[index] || 620}ms`);
        item.disabled = false;
        item.tabIndex = 0;
      });

      if (label) {
        label.textContent = "memorias espalhadas";
      }
    }
  }

  function tryUnlockBox() {
    if (hasOpenedBox || isFinishingUnlock) return;

    unlockProgress = Math.min(unlockProgress + 1, REQUIRED_SHAKES);
    boxButton.dataset.unlockState = String(unlockProgress);
    shakeBox(unlockProgress);

    showAchievement(unlockAchievements[unlockProgress - 1]);

    if (label && unlockProgress < REQUIRED_SHAKES) {
      label.textContent = unlockLabels[unlockProgress] || unlockLabels[0];
    }

    if (unlockProgress >= REQUIRED_SHAKES) {
      isFinishingUnlock = true;

      if (label) {
        label.textContent = "memorias desbloqueadas";
      }

      setTimeout(openBox, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 560);
    }
  }

  function showFinalMemoryMessage() {
    if (hasShownFinalMessage || openedItems.size < items.length) return;

    hasShownFinalMessage = true;
    const finalAchievement = "voce encontrou todas as pequenas coisas que fizeram parte da nossas conversas.";

    if (dialogueModule.showAchievement) {
      dialogueModule.showAchievement(finalAchievement);
    } else {
      dialogueModule.openDialogue(finalAchievement, "todas as pequenas memorias encontradas");
    }

    const finalMessage = document.createElement("p");
    finalMessage.className = "memory-box-final-message";
    finalMessage.textContent = "no fim das contas, nunca foram so os jogos, os fandoms ou as musicas. foi voce <3";
    boxButton.insertAdjacentElement("afterend", finalMessage);
  }

  boxButton.addEventListener("click", tryUnlockBox);

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (!hasOpenedBox) return;

      item.classList.add("has-been-opened");
      openedItems.add(item);

      dialogueModule.openDialogue(
        item.dataset.message || "",
        item.dataset.achievement || "objeto encontrado"
      );

      showFinalMemoryMessage();
    });
  });
}

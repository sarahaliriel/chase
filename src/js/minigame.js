/* ============================================
   minigame.js - Complete Minigame System
   ============================================ */

export function initMinigame(dialogueModule) {
  const gameTrigger = document.querySelector("#gameTrigger");
  const gameOverlay = document.querySelector("#gameOverlay");
  const closeGame = document.querySelector("#closeGame");
  const gameStage = document.querySelector("#gameStage");
  const catsFoundCount = document.querySelector("#catsFoundCount");
  const gameComplete = document.querySelector("#gameComplete");
  const giftBox = document.querySelector("#giftBox");
  const rewardLink = document.querySelector("#rewardLink");
  const closeComplete = document.querySelector("#closeComplete");
  const gamePrintViewer = document.querySelector("#gamePrintViewer");
  const closePrintViewer = document.querySelector("#closePrintViewer");
  const printImage = document.querySelector("#printImage");
  const videoGiftCard = document.querySelector("#videoGiftCard");
  const videoGift = document.querySelector("#videoGift");
  const closeVideoGiftButton = document.querySelector("#closeVideoGift");
  const giftVideo = document.querySelector("#giftVideo");
  const memoryMusic = document.querySelector("#memoryMusic");

  let foundCats = 0;
  const totalCats = 18;
  let catStates = [];
  let catAnimationId = null;
  let isMusicPlaying = false;

  document.querySelector("#musicToggle").addEventListener("click", () => {
    isMusicPlaying = !isMusicPlaying;
  });

  const catMessages = [
    "voce desbloqueou: 1 neuronio funcionando!",
    "esse mewo sabe demais sobre voce...",
    "parabens! voce ganhou: absolutamente nada.",
    "o mewo te julgou. silenciosamente.",
    "cuidado!!! esse mewo morde pessoas bonitas.",
    "achievement unlocked: tocou num mewo invisivel.",
    "o gatinho disse 'miau' mas em tom ameacador!",
    "voce encontrou um easter egg inutil. parabens!!!",
    "mewo pediu pra voce beber agua.",
    "esse mewo tem acesso ao historico do discord...",
    "ele sabe o que fizemos em 2022.",
    "voce acabou de alimentar o ego de um mewo digital.",
    "esse gatinho eh pago pra ficar escondido.",
    "voce foi escolhido pelo conselho internacional dos mewos bobos.",
    "o mewo gostaria de reclamar do capitalismo.",
    "inacreditavel. outro mewo encontrado por acidente.",
    "voce desbloqueou um nivel preocupante de tempo livre.",
    "esse mewo e testemunha de amizade em excesso.",
    "o gatinho aprovou sua existencia. temporariamente...",
    "404 sanidade not found." //isso aqui foi mto bom de escrever
  ];

  const catPositions = [
    { top: "10%", left: "14%" },
    { top: "8%", left: "55%" },
    { top: "22%", left: "72%" },
    { top: "34%", left: "26%" },
    { top: "48%", left: "12%" },
    { top: "52%", left: "66%" },
    { top: "64%", left: "38%" },
    { top: "72%", left: "82%" },
    { top: "84%", left: "16%" },
    { top: "24%", left: "44%" },
    { top: "36%", left: "86%" },
    { top: "58%", left: "8%" },
    { top: "68%", left: "52%" },
    { top: "16%", left: "86%" },
    { top: "92%", left: "48%" },
    { top: "54%", left: "28%" },
    { top: "78%", left: "60%" },
    { top: "34%", left: "16%" }
  ];

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Helper Functions
  function randomCatVelocity() {
    const speed = 0.65 + Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
  }

  function stopCatAnimation() {
    if (catAnimationId !== null) {
      cancelAnimationFrame(catAnimationId);
      catAnimationId = null;
    }
  }

  function updateCatPositions() {
    const stageRect = gameStage.getBoundingClientRect();
    const maxX = Math.max(0, stageRect.width - 46);
    const maxY = Math.max(0, stageRect.height - 46);

    catStates.forEach((catState) => {
      if (catState.found) return;

      catState.x += catState.vx;
      catState.y += catState.vy;

      if (catState.x <= 0 || catState.x >= maxX) {
        catState.vx *= -1;
        catState.x = Math.min(Math.max(catState.x, 0), maxX);
      }

      if (catState.y <= 0 || catState.y >= maxY) {
        catState.vy *= -1;
        catState.y = Math.min(Math.max(catState.y, 0), maxY);
      }

      catState.element.style.left = `${catState.x}px`;
      catState.element.style.top = `${catState.y}px`;
    });

    catAnimationId = requestAnimationFrame(updateCatPositions);
  }

  function startCatAnimation() {
    stopCatAnimation();
    catAnimationId = requestAnimationFrame(updateCatPositions);
  }

  function playMeowTone() {
    if (!audioContext) return;
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(480, audioContext.currentTime);
    gain.gain.setValueAtTime(0.0005, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.28);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.28);
  }

  function updateCatsFound() {
    catsFoundCount.textContent = `${foundCats}`;
  }

  function openGame() {
    document.body.classList.add("no-scroll");
    gameOverlay.classList.remove("hidden");
    window.requestAnimationFrame(() => {
      gameOverlay.classList.add("is-visible");
    });
  }

  function closeGameOverlay() {
    stopCatAnimation();
    gameOverlay.classList.remove("is-visible");
    setTimeout(() => {
      gameOverlay.classList.add("hidden");
      document.body.classList.remove("no-scroll");
    }, 420);
  }

  function openCompleteScreen() {
    gameComplete.classList.remove("hidden");
    window.requestAnimationFrame(() => {
      gameComplete.classList.add("is-visible");
    });
    dialogueModule.openDialogue(
      "você encontrou todos os gatinhos escondidos. abra a caixa para receber sua playlist-presentes de amizade.",
      "final desbloqueado"
    );
  }

  function closeCompleteScreen() {
    gameComplete.classList.remove("is-visible");
    setTimeout(() => {
      gameComplete.classList.add("hidden");
    }, 420);
  }

  function revealGiftLink() {
    rewardLink.classList.remove("hidden");
    giftBox.classList.add("opened");
    dialogueModule.showAchievement("aqui nao bestao, o botao de baixo eh que tem o presente!");
  }

  function onCatClick(event) {
    const button = event.currentTarget;
    if (button.classList.contains("found")) return;

    const catIndex = parseInt(button.classList[1].split("-")[1]) - 1;

    button.classList.add("found");
    button.disabled = true;
    foundCats += 1;
    updateCatsFound();
    playMeowTone();

    if (catStates[catIndex]) {
      catStates[catIndex].found = true;
    }

    openPrintViewer(catIndex + 1, catMessages[catIndex]);
    dialogueModule.openDialogue(catMessages[catIndex], "gatinho encontrado");

    if (foundCats === totalCats) {
      setTimeout(openCompleteScreen, 900);
    }
  }

  function openPrintViewer(printNumber, caption) {
    const printPath = `public/assets/images/minigame/prints/print-${String(printNumber).padStart(2, '0')}.png`;
    const printPathJpg = `public/assets/images/minigame/prints/print-${String(printNumber).padStart(2, '0')}.jpg`;

    printImage.src = printPath;
    printImage.onerror = () => {
      printImage.src = printPathJpg;
    };

    gamePrintViewer.classList.remove("hidden");
    window.requestAnimationFrame(() => {
      gamePrintViewer.classList.add("is-visible");
    });
  }

  function closePrintViewerOverlay() {
    gamePrintViewer.classList.remove("is-visible");
    setTimeout(() => {
      gamePrintViewer.classList.add("hidden");
    }, 320);
  }

  function buildGameCats() {
    const gameCatsLayer = document.querySelector(".game-cats-layer");
    gameCatsLayer.innerHTML = "";
    catStates = [];

    const stageRect = gameStage.getBoundingClientRect();
    const maxX = Math.max(0, stageRect.width - 46);
    const maxY = Math.max(0, stageRect.height - 46);

    catPositions.forEach((position, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `game-cat-token cat-${index + 1}`;
      button.dataset.message = catMessages[index] || "um pedacinho de amizade guardado nesta memória.";
      button.setAttribute("aria-label", `gatinho ${index + 1} escondido`);

      const img = document.createElement("img");
      img.src = "public/assets/images/ui/omori-cat.png";
      img.alt = `Gatinho ${index + 1}`;
      button.appendChild(img);

      const initialX = Math.min(Math.max((parseFloat(position.left) / 100) * maxX, 0), maxX);
      const initialY = Math.min(Math.max((parseFloat(position.top) / 100) * maxY, 0), maxY);
      button.style.left = `${initialX}px`;
      button.style.top = `${initialY}px`;

      button.addEventListener("click", onCatClick);
      gameCatsLayer.appendChild(button);

      const velocity = randomCatVelocity();
      catStates.push({
        element: button,
        x: initialX,
        y: initialY,
        vx: velocity.vx,
        vy: velocity.vy,
        found: false
      });
    });
  }

  const gameGrass = document.querySelector("#gameGrass");
  let grassHoleTimeout;

  function createGrassHole(x, y) {
    const holeSize = 68;
    const hole = document.createElement("div");
    hole.className = "grass-reveal-hole";
    
    hole.style.left = (x - holeSize / 2) + "px";
    hole.style.top = (y - holeSize / 2) + "px";
    hole.style.width = holeSize + "px";
    hole.style.height = holeSize + "px";
    hole.style.background = "transparent";
    
    gameGrass.appendChild(hole);
    
    setTimeout(() => hole.remove(), 280);
  }

  function handleGrassMove(event) {
    if (!gameGrass) return;
    
    const rect = gameGrass.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    clearTimeout(grassHoleTimeout);
    createGrassHole(x, y);
    
    const gameCatsLayer = document.querySelector(".game-cats-layer");
    const cats = gameCatsLayer.querySelectorAll(".game-cat-token:not(.found)");
    
    cats.forEach(cat => {
      const catRect = cat.getBoundingClientRect();
      const catCenterX = catRect.left + catRect.width / 2;
      const catCenterY = catRect.top + catRect.height / 2;
      
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      const distance = Math.sqrt(
        Math.pow(mouseX - catCenterX, 2) + Math.pow(mouseY - catCenterY, 2)
      );
      
      if (distance < 45) {
        cat.style.opacity = "1";
        cat.style.zIndex = "15";
      } else {
        cat.style.opacity = "";
        cat.style.zIndex = "";
      }
    });
  }

  function handleGrassLeave() {
    const gameCatsLayer = document.querySelector(".game-cats-layer");
    const cats = gameCatsLayer.querySelectorAll(".game-cat-token:not(.found)");
    
    cats.forEach(cat => {
      cat.style.opacity = "";
      cat.style.zIndex = "";
    });
  }

  if (gameGrass) {
    gameGrass.addEventListener("mousemove", handleGrassMove);
    gameGrass.addEventListener("mouseleave", handleGrassLeave);
  }

  // Video Gift Modal
  function openVideoGift() {
    videoGift.classList.add("is-visible");
    videoGift.setAttribute("aria-hidden", "false");
    dialogueModule.showAchievement("video secreto desbloqueado");

    if (isMusicPlaying) {
      memoryMusic.volume = 0.18;
    }
  }

  function closeVideoGift() {
    videoGift.classList.remove("is-visible");
    videoGift.setAttribute("aria-hidden", "true");
    giftVideo.pause();

    if (isMusicPlaying) {
      memoryMusic.volume = 0.45;
    }
  }

  gameTrigger.addEventListener("click", () => {
    if (gameOverlay.classList.contains("hidden")) {
      openGame();
      window.requestAnimationFrame(() => {
        buildGameCats();
        updateCatsFound();
        startCatAnimation();
      });
    }
  });

  closeGame.addEventListener("click", closeGameOverlay);
  closeComplete.addEventListener("click", closeCompleteScreen);
  giftBox.addEventListener("click", revealGiftLink);
  closePrintViewer.addEventListener("click", closePrintViewerOverlay);

  videoGiftCard.addEventListener("click", openVideoGift);
  closeVideoGiftButton.addEventListener("click", closeVideoGift);

  videoGift.addEventListener("click", (event) => {
    if (event.target === videoGift) {
      closeVideoGift();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!gamePrintViewer.classList.contains("hidden")) {
        closePrintViewerOverlay();
      } else if (!gameComplete.classList.contains("hidden")) {
        closeCompleteScreen();
      } else if (!gameOverlay.classList.contains("hidden")) {
        closeGameOverlay();
      }
    }
  });

  gamePrintViewer.addEventListener("click", (event) => {
    if (event.target === gamePrintViewer) {
      closePrintViewerOverlay();
    }
  });

  gameOverlay.addEventListener("click", (event) => {
    if (event.target === gameOverlay) {
      closeGameOverlay();
    }
  });

  gameComplete.addEventListener("click", (event) => {
    if (event.target === gameComplete) {
      closeCompleteScreen();
    }
  });
}

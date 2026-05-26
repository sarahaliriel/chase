/* ============================================
   dialogue.js - Dialogue Modal & Achievements
   ============================================ */

export function initDialogue() {
  const dialogue = document.querySelector("#dialogue");
  const dialogueText = document.querySelector("#dialogueText");
  const dialogueMemory = document.querySelector("#dialogueMemory");
  const dialogueImage = document.querySelector("#dialogueImage");
  const closeDialogue = document.querySelector("#closeDialogue");
  const achievement = document.querySelector("#achievement");

  function showAchievement(text = "memoria desbloqueada") {
    achievement.textContent = text;
    achievement.classList.add("is-visible");

    setTimeout(() => {
      achievement.classList.remove("is-visible");
    }, 1800);
  }

  function openDialogue(message, achievementText, imageSrc = "", imageAlt = "") {
    dialogueText.textContent = message;

    if (imageSrc) {
      dialogueImage.src = imageSrc;
      dialogueImage.alt = imageAlt || "";
      dialogueMemory.classList.remove("hidden");
      dialogue.classList.add("has-memory");
    } else {
      dialogueImage.removeAttribute("src");
      dialogueImage.alt = "";
      dialogueMemory.classList.add("hidden");
      dialogue.classList.remove("has-memory");
    }

    dialogue.classList.add("is-visible");
    dialogue.setAttribute("aria-hidden", "false");

    if (achievementText) {
      showAchievement(achievementText);
    }
  }

  function closeDialogueBox() {
    dialogue.classList.remove("is-visible");
    dialogue.setAttribute("aria-hidden", "true");
  }

  // Event Listeners
  document.querySelectorAll(".note").forEach((note) => {
    note.addEventListener("click", () => {
      openDialogue(note.dataset.message, "cartinha aberta");
    });
  });

  document.querySelectorAll(".secret").forEach((secret) => {
    secret.addEventListener("click", () => {
      openDialogue(secret.dataset.secret, "uma mensagem secreta desbloqueada");
    });
  });

  document.querySelectorAll(".timeline-memory").forEach((memory) => {
    memory.addEventListener("click", () => {
      openDialogue(
        memory.dataset.message,
        `fragmento de ${memory.dataset.year} aberto`,
        memory.dataset.image,
        memory.dataset.alt
      );
    });
  });

  closeDialogue.addEventListener("click", closeDialogueBox);

  dialogue.addEventListener("click", (event) => {
    if (event.target === dialogue) {
      closeDialogueBox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDialogueBox();
    }
  });

  return {
    openDialogue,
    closeDialogueBox,
    showAchievement
  };
}

export function initLoader() {
  const loader = document.querySelector("#loader");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("is-hidden");
    }, 950);
  });
}

export function initTypewriter() {
  const typewriter = document.querySelector("#typewriter");
  const lines = [
    "eu espero que hoje e todos os dias sejam especiais pra voce.",
    "sitezinho boiola pra alguem boiola XD.",
    "tire um tempinho nessa pagina e se divirta - fiz com muito carinho."
  ];
  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentLine = lines[lineIndex];
    const visibleText = currentLine.slice(0, charIndex);
    typewriter.textContent = visibleText;

    if (!isDeleting && charIndex < currentLine.length) {
      charIndex += 1;
      setTimeout(typeLoop, 70);
      return;
    }

    if (!isDeleting && charIndex === currentLine.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeLoop, 35);
      return;
    }

    isDeleting = false;
    lineIndex = (lineIndex + 1) % lines.length;
    setTimeout(typeLoop, 300);
  }

  typeLoop();
}

export function initFadeIn() {
  const fadeTargets = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  fadeTargets.forEach((target) => observer.observe(target));
}

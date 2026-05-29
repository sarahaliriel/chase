/* ============================================
   memoryBox.js - Shared Memory Box Interaction
   ============================================ */

export function initMemoryBox(dialogueModule) {
  const boxButton = document.querySelector("#memoryBoxButton");
  const boxImage = document.querySelector("#memoryBoxImage");
  const memoryItems = document.querySelector("#memoryItems");

  if (!boxButton || !boxImage || !memoryItems || !dialogueModule) return;

  const label = boxButton.querySelector("span");
  const items = Array.from(memoryItems.querySelectorAll(".memory-item"));
  const openedItems = new Set();
  let hasOpenedBox = false;
  let hasShownFinalMessage = false;

  items.forEach((item) => {
    item.disabled = true;
    item.tabIndex = -1;
  });

  function openBox() {
    if (!hasOpenedBox) {
      hasOpenedBox = true;
      boxButton.classList.add("is-open");
      memoryItems.classList.add("is-visible");
      memoryItems.setAttribute("aria-hidden", "false");
      boxImage.src = boxImage.dataset.openSrc || boxImage.src;
      boxImage.alt = "Caixa de memórias aberta";

      items.forEach((item) => {
        item.disabled = false;
        item.tabIndex = 0;
      });

      if (label) {
        label.textContent = "memórias espalhadas";
      }
    }
  }

  function showFinalMemoryMessage() {
    if (hasShownFinalMessage || openedItems.size < items.length) return;

    hasShownFinalMessage = true;
    const finalAchievement = "você encontrou todas as pequenas coisas que fizeram parte da nossas conversas.";

    if (dialogueModule.showAchievement) {
      dialogueModule.showAchievement(finalAchievement);
    } else {
      dialogueModule.openDialogue(finalAchievement, "todas as pequenas memorias encontradas");
    }

    const finalMessage = document.createElement("p");
    finalMessage.className = "memory-box-final-message";
    finalMessage.textContent = "no fim das contas, nunca foram só os jogos, os fandoms ou as músicas. foi você <3";
    boxButton.insertAdjacentElement("afterend", finalMessage);
  }

  boxButton.addEventListener("click", openBox);

  items.forEach((item) => {
    item.addEventListener("click", () => {
      openBox();
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

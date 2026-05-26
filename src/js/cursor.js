/* ============================================
   cursor.js - Custom Cursor Behavior
   ============================================ */

export function initCursor() {
  const customCursor = document.querySelector(".custom-cursor");

  if (!customCursor) return;

  document.addEventListener("mousemove", (event) => {
    customCursor.style.left = `${event.clientX}px`;
    customCursor.style.top = `${event.clientY}px`;
  });

  const hoverElements = document.querySelectorAll(
    "a, button, .note, .timeline-memory, .ending-card, .home-cat"
  );

  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      customCursor.classList.add("is-hovering");
    });

    element.addEventListener("mouseleave", () => {
      customCursor.classList.remove("is-hovering");
    });
  });
}

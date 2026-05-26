/* ============================================
   timeline.js - Timeline & Parallax Scroll
   ============================================ */

export function initTimeline() {
  const doodles = document.querySelectorAll(".floating-doodle");

  window.addEventListener("scroll", () => {
    const scrollAmount = window.scrollY;

    doodles.forEach((doodle, index) => {
      const speed = 0.025 + index * 0.012;
      doodle.style.translate = `0 ${scrollAmount * speed}px`;
    });
  });
}

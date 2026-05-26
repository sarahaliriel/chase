/* ============================================
   theme.js - Dark/Light Mode Toggle
   ============================================ */

export function initTheme() {
  const themeToggle = document.querySelector("#themeToggle");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "modo: black space" : "modo: white space";
  });
}

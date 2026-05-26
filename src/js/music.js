/* ============================================
   music.js - Music Player Controls
   ============================================ */

export function initMusic() {
  const musicToggle = document.querySelector("#musicToggle");
  const memoryMusic = document.querySelector("#memoryMusic");
  let isMusicPlaying = false;

  memoryMusic.volume = 0.45;

  musicToggle.addEventListener("click", () => {
    isMusicPlaying = !isMusicPlaying;
    musicToggle.textContent = isMusicPlaying ? "musica: on" : "musica: off";

    if (isMusicPlaying) {
      memoryMusic.play().catch(() => {
        isMusicPlaying = false;
        musicToggle.textContent = "musica: off";
      });
    } else {
      memoryMusic.pause();
    }
  });

  return {
    isMusicPlaying: () => isMusicPlaying,
    setVolume: (volume) => { memoryMusic.volume = volume; },
    getVolume: () => memoryMusic.volume
  };
}

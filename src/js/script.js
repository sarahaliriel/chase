/* ============================================
   script.js - Main initialization file
   Imports and initializes all modules
   ============================================ */

import { initCounter } from './counter.js';
import { initCursor } from './cursor.js';
import { initTheme } from './theme.js';
import { initMusic } from './music.js';
import { initDialogue, initLoader, initTypewriter, initFadeIn } from './dialogue.js';
import { initTimeline } from './timeline.js';
import { initMinigame } from './minigame.js';

document.addEventListener('DOMContentLoaded', () => {
  const dialogueModule = initDialogue();
  
  initLoader();
  initCounter();
  initCursor();
  initTheme();
  initMusic();
  initTypewriter();
  initFadeIn();
  initTimeline();
  
  initMinigame(dialogueModule);
});

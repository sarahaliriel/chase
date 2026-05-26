/* ============================================
   counter.js - Friendship Time Counter
   ============================================ */

export function initCounter() {
  const friendshipStartDate = new Date("2022-02-15T16:38:00+00:00");
  const friendshipCounter = document.querySelector("#friendshipCounter");

  function updateFriendshipTime() {
    const now = new Date();
    const diffMs = now - friendshipStartDate;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    friendshipCounter.textContent = `${days} dias • ${hours}h • ${minutes}m • ${seconds}s`;
  }

  updateFriendshipTime();
  setInterval(updateFriendshipTime, 1000);
}

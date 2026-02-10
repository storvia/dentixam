// Get student ID from URL params
const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

const welcome = document.getElementById("welcome");
const countdownEl = document.getElementById("countdown");
const errorEl = document.getElementById("error");
const pinInput = document.getElementById("pin");
const accessCard = document.querySelector(".access-card");

// Set welcome message
welcome.textContent = studentId
  ? `Welcome, ${studentId}`
  : "Welcome Student";

// ---------- Obfuscation helper ----------
function obscure(value) {
  return btoa(value.split("").reverse().join(""));
}

// ---------- Shake animation for wrong PIN ----------
function shakeCard() {
  accessCard.classList.add("shake");
  setTimeout(() => accessCard.classList.remove("shake"), 600);
}

// ---------- Login function ----------
async function login() {
  errorEl.textContent = "";

  const pinValue = pinInput.value.trim();

  if (!pinValue) return;

  const res = await fetch("../data/users.json");
  const users = await res.json();

  const user = users[studentId];
  if (!user) {
    errorEl.textContent = "Invalid access page.";
    shakeCard();
    pinInput.value = "";
    return;
  }

  const now = new Date();
  const expiry = new Date(user.valid_to);

  if (now > expiry) {
    errorEl.textContent = "Your PIN has expired ⛔";
    shakeCard();
    pinInput.value = "";
    return;
  }

  // Check PIN (obfuscated)
  if (obscure(pinValue) === obscure(user.pin)) {
    sessionStorage.setItem("access", "granted");
    window.location.href = "../showcase/index.html";
  } else {
    errorEl.textContent = "Incorrect PIN ❌";
    shakeCard();
    pinInput.value = "";
  }
}

// ---------- Countdown timer with pulsing ----------
(async function countdown() {
  if (!studentId) return;

  const res = await fetch("../data/users.json");
  const users = await res.json();
  const user = users[studentId];
  if (!user || !user.valid_to) return;

  const expiry = new Date(user.valid_to);

  setInterval(() => {
    const now = new Date();
    const diff = expiry - now;

    if (diff <= 0) {
      countdownEl.textContent = "PIN expired";
      countdownEl.classList.remove("pulse");
      return;
    }

    const h = Math.floor(diff / 1000 / 60 / 60);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `PIN expires in ${h}h ${m}m ${s}s`;
    countdownEl.classList.add("pulse"); // pulsing effect

  }, 1000);
})();

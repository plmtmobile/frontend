const BASE_URL = "https://mpservice-6tm6.onrender.com";
let currentApiKey = "";
let pollingInterval = null;

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch(BASE_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.apiKey) showApiKey(data.apiKey);
    else alert("❌ " + (data.error || "Registration failed"));
  });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch(BASE_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.apiKey) showApiKey(data.apiKey);
    else alert("❌ " + (data.error || "Login failed"));
  });
}

function showApiKey(apiKey) {
  currentApiKey = apiKey;
  document.getElementById("form-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");
  document.getElementById("apiKeyBox").value = apiKey;
}

function findMatch() {
  if (!currentApiKey) return alert("Not authenticated");
  document.getElementById("matchStatus").classList.remove("hidden");
  document.getElementById("matchStatus").textContent = "🔍 Looking for match...";
  clearInterval(pollingInterval);
  sendMatchRequest(true);
}

function sendMatchRequest(startPolling = false) {
  fetch(BASE_URL + "/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey })
  })
  .then(r => r.json())
  .then(data => {
    if (data.status === "matched") {
      document.getElementById("matchStatus").textContent = "🎯 Opponent found: " + data.opponent;
      clearInterval(pollingInterval);
    } else if (data.status === "waiting") {
      document.getElementById("matchStatus").textContent = "⏳ Waiting for an opponent...";
      if (startPolling) {
        pollingInterval = setInterval(() => sendMatchRequest(false), 5000);
      }
    } else {
      document.getElementById("matchStatus").textContent = "❌ Error: " + (data.error || "Unknown response");
      clearInterval(pollingInterval);
    }
  });
}

function logout() {
  currentApiKey = "";
  clearInterval(pollingInterval);
  document.getElementById("form-section").classList.remove("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("apiKeyBox").value = "";
  document.getElementById("matchStatus").classList.add("hidden");
  document.getElementById("matchStatus").textContent = "";
}

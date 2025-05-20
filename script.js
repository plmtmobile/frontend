const BASE_URL = "https://mpservice-6tm6.onrender.com";
let currentApiKey = "";

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

  fetch(BASE_URL + "/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey })
  })
  .then(r => r.json())
  .then(data => {
    if (data.status === "matched") {
      document.getElementById("matchStatus").textContent = "🎯 Opponent found: " + data.opponent;
    } else if (data.status === "waiting") {
      document.getElementById("matchStatus").textContent = "⏳ Waiting for an opponent...";
    } else {
      document.getElementById("matchStatus").textContent = "❌ Error: " + (data.error || "Unknown response");
    }
  });
}

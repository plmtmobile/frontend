const BASE_URL = "https://mpservice-6tm6.onrender.com";
let currentApiKey = "";
let roomPolling = null;

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

function createRoom() {
  const maxPlayers = parseInt(document.getElementById("maxPlayers").value) || 2;
  fetch(BASE_URL + "/room/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey, maxPlayers })
  })
  .then(r => r.json())
  .then(data => {
    if (data.roomId) {
      document.getElementById("matchStatus").classList.remove("hidden");
      document.getElementById("matchStatus").textContent = "🛠 Room created. Waiting for players...";
      startPollingStatus();
    } else {
      alert("❌ Failed to create room");
    }
  });
}

function joinRoom() {
  fetch(BASE_URL + "/room/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey })
  })
  .then(r => r.json())
  .then(data => {
    document.getElementById("matchStatus").classList.remove("hidden");
    if (data.status === "joined") {
      document.getElementById("matchStatus").textContent = "🎮 Joined room. Waiting for others...";
      startPollingStatus();
    } else {
      document.getElementById("matchStatus").textContent = "⏳ No open rooms. Try again later.";
    }
  });
}

function startPollingStatus() {
  clearInterval(roomPolling);
  roomPolling = setInterval(() => {
    fetch(BASE_URL + "/room/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: currentApiKey })
    })
    .then(r => r.json())
    .then(data => {
      if (data.status === "full") {
        document.getElementById("matchStatus").textContent = "✅ Room full! Opponents: " + data.opponent.join(", ");
        clearInterval(roomPolling);
      } else if (data.status === "waiting") {
        document.getElementById("matchStatus").textContent = "⏳ Waiting for players...";
      }
    });
  }, 5000);
}

function logout() {
  currentApiKey = "";
  clearInterval(roomPolling);
  document.getElementById("form-section").classList.remove("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("apiKeyBox").value = "";
  document.getElementById("matchStatus").classList.add("hidden");
  document.getElementById("matchStatus").textContent = "";
}

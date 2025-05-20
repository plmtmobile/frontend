const BASE_URL = "https://mpservice-6tm6.onrender.com";

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
  document.getElementById("form-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.remove("hidden");
  document.getElementById("apiKeyBox").value = apiKey;
}

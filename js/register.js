document.getElementById("registerForm").addEventListener("submit", async (e) => {
   const API_URL = "https://backendcuidado2.onrender.com";
   e.preventDefault();
   const data = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      birthdate: document.getElementById("birthdate").value
   };

   const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
   });

   const result = await res.json();
   alert(result.message);
   if (res.ok) window.location.href = "/html/login.html";

});





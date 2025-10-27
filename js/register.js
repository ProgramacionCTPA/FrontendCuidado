document.getElementById("registerForm").addEventListener("submit", async (e) => {
   e.preventDefault();
   const data = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      birthdate: document.getElementById("birthdate").value
   };

   const res = await fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
   });

   const result = await res.json();
   alert(result.message);
   if (res.ok) window.location.href = "/html/login.html";
});
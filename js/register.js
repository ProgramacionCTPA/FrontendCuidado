document.getElementById("registerForm").addEventListener("submit", async (e) => {
   const API_URL = "https://backendcuidado2.onrender.com";
   e.preventDefault();

   const data = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      birthdate: document.getElementById("birthdate").value
   };

   try {
      const res = await fetch(`${API_URL}/api/register`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data)
      });

      const text = await res.text();
      let result;
      try {
         result = JSON.parse(text);
      } catch {
         console.error("Respuesta no JSON:", text);
         throw new Error("Respuesta no válida del servidor");
      }

      alert(result.message);
      if (res.ok) window.location.href = "/html/login.html";
   } catch (error) {
      console.error("Error en el registro:", error);
      alert("No se pudo conectar con el servidor.");
   }
});


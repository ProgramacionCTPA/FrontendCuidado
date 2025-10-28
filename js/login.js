    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const API_URL = "https://backendcuidado2.onrender.com";
      const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      };

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message);

      if (res.ok) {
        localStorage.setItem("token", result.token);
        window.location.href = "/html/encuesta.html";
      }
    });

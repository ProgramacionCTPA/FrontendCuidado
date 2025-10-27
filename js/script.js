// Ejemplo de animación simple al hacer scroll
document.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.style.opacity = 1 - window.scrollY / 400;
});

(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("btnCerrar").style.display="none";
  }else{
    document.getElementById("btnCerrar").style.display="inline";

  }

  
})();

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}
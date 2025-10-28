const API_URL = "https://backendcuidado2.onrender.com";

(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para acceder a la encuesta.");
    window.location.href = "/html/login.html";
  }

  const res = await fetch(`${API_URL}/api/survey/status`, {
    headers: {"Authorization": `Bearer ${token}` }

  });
  const data = await res.json();

  if (data.hasCompletedSurvey) {
    alert("Ya has completado la encuesta. Solo puedes hacerlo una vez.");
    window.location.href = "/index.html";
  }
})();


const questions = [
    // Área Física
    "Duermo al menos 7 horas por noche.",
    "Mantengo una alimentación equilibrada y tomo suficiente agua.",
    "Realizo actividad física al menos tres veces por semana.",
    "Evito el consumo excesivo de cafeína, alcohol o tabaco.",
    // Área Emocional
    "Identifico y gestiono mis emociones de forma saludable.",
    "Busco apoyo emocional cuando lo necesito.",
    "Practico la autocompasión y evito ser demasiado crítico conmigo.",
    "Dedico tiempo a actividades que me generan alegría y satisfacción.",
    // Área Mental
    "Tomo descansos cuando me siento saturado o estresado.",
    "Mantengo pensamientos positivos sobre mí y mis capacidades.",
    "Administro bien mi tiempo y evito la procrastinación.",
    "Tengo estrategias para manejar el estrés o la ansiedad.",
    // Área Social
    "Mantengo relaciones positivas con familiares y amigos.",
    "Me comunico de forma asertiva con las personas a mi alrededor.",
    "Participo en actividades o grupos donde me siento valorado/a.",
    "Ofrezco apoyo y escucha a las personas cercanas cuando lo necesitan.",
    // Área Espiritual
    "Dedico tiempo a la reflexión, meditación o silencio interior.",
    "Practico la gratitud de manera frecuente.",
    "Me siento conectado con mis valores y propósito de vida.",
    "Encuentro serenidad en momentos difíciles."
];

const options = [
    {text: "Nunca", value: 1},
    {text: "Rara vez", value: 2},
    {text: "A veces", value: 3},
    {text: "Frecuentemente", value: 4},
    {text: "Siempre", value: 5}
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const resultEl = document.getElementById("result");
const questionContainer = document.getElementById("question-container");
const scoreEl = document.getElementById("score");
const recommendationEl = document.getElementById("recommendation");

function loadQuestion() {
    questionEl.textContent = questions[currentQuestion];
    optionsEl.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt.text;
        btn.onclick = () => selectOption(opt.value);
        optionsEl.appendChild(btn);
    });
    progressEl.style.width = ((currentQuestion) / questions.length) * 100 + "%";
}

function selectOption(value) {
    score += value;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

async function showResult() {
  questionContainer.style.display = "none";
  resultEl.style.display = "block";
  progressEl.style.width = "100%";

  let level = "";
  let message = "";

  if (score <= 50) {
    level = "Bajo";
    message = "Necesitas mejorar tu autocuidado.";
  } else if (score <= 80) {
    level = "Medio";
    message = "Tienes un buen nivel de autocuidado. Sigue así.";
  } else {
    level = "Alto";
    message = "¡Excelente autocuidado!";
  }

  scoreEl.textContent = `${level} (${score} puntos)`;
  recommendationEl.textContent = message;

  // Guardar resultado en MongoDB
  await saveSurvey(score, level, message);
}

async function saveSurvey(score, level, recommendation) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_URL}/api/survey/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ score, level, recommendation })
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Encuesta guardada correctamente ✅");
  } catch (error) {
    console.error("Error al guardar encuesta:", error);
    alert("Ocurrió un error al guardar la encuesta");
  }
}


function restartSurvey() {
    score = 0;
    currentQuestion = 0;
    resultEl.style.display = "none";
    questionContainer.style.display = "block";
    loadQuestion();
}

loadQuestion();

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/index.html";

}


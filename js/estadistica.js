  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para ver las estadísticas.");
    window.location.href = "login.html";
  }

  let myChart = null;

  async function cargarDatos() {
    const API_URL = "https://backendcuidado2.onrender.com";
    const res = await fetch(`${API_URL}/api/stats`, {
      headers: { "Authorization": token }
    });
    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      alert("Error al cargar datos.");
      return;
    }

    // === Mapeo numérico del nivel ===
    const Y_MAP = { "Bajo": 30, "Medio": 60, "Alto": 90 };
    const niveles = ["Bajo", "Medio", "Alto"];

    // === Construcción de dataset base ===
    const dataset = niveles.map(nivel => ({
      label: nivel,
      data: data
        .filter(d => d.level === nivel)
        .map(d => ({ x: Number(d.age), y: Y_MAP[nivel] }))
    }));

    // === Estilos visuales por nivel ===
    const datasetStyled = dataset.map(ds => ({
      ...ds,
      pointRadius: 7,
      pointHoverRadius: 10,
      borderWidth: 2,
      pointBackgroundColor:
        ds.label === "Bajo" ? "rgba(255, 99, 132, 0.9)" :
        ds.label === "Medio" ? "rgba(255, 205, 86, 0.9)" :
                               "rgba(75, 192, 192, 0.9)"
    }));

    // === Plugin para franjas horizontales ===
    const backgroundPlugin = {
      id: "nivelBackground",
      beforeDraw(chart) {
        const { ctx, chartArea } = chart;
        const height = chartArea.bottom - chartArea.top;

        const stripeHeight = height / 3;
        const colors = [
          "rgba(255, 99, 132, 0.15)",  // Bajo
          "rgba(255, 205, 86, 0.15)", // Medio
          "rgba(75, 192, 192, 0.15)"  // Alto
        ];

        colores = colors.reverse();

        ["Alto","Medio","Bajo"].forEach((nivel, i) => {
          ctx.fillStyle = colors[i];
          ctx.fillRect(
            chartArea.left,
            chartArea.top + stripeHeight * i,
            chartArea.right - chartArea.left,
            stripeHeight
          );
        });
      }
    };

    // Destruir gráfico anterior si existe
    if (myChart) {
      myChart.destroy();
    }

    const ctx = document.getElementById("chart").getContext("2d");

    // === Crear gráfico ===
    myChart = new Chart(ctx, {
      type: "scatter",
      data: { datasets: datasetStyled },
      plugins: [backgroundPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Niveles de Autocuidado por Edad"
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `Edad: ${ctx.parsed.x} años | Nivel: ${ctx.dataset.label}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Edad" },
            min: 10,
            max: 80
          },
          y: {
            title: { display: true, text: "Nivel" },
            min: 0,
            max: 100,
            ticks: {
              callback: (val) => {
                if (val === 30) return "Bajo";
                if (val === 60) return "Medio";
                if (val === 90) return "Alto";
                return "";
              }
            }
          }
        }
      }
    });
  }

  cargarDatos();

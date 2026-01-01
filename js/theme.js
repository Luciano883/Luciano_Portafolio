const btn = document.getElementById("themeBtn");

function loadTheme(){
  const stored = localStorage.getItem("portafolioTheme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isDark = stored === "dark" || (!stored && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
  btn.setAttribute("aria-pressed", isDark);

  const lbl = btn.querySelector(".label");
  lbl.textContent = isDark ? "Modo claro" : "Modo oscuro";
}

function toggleTheme(){
  const isDark = document.documentElement.classList.toggle("dark");
  btn.setAttribute("aria-pressed", isDark);
  localStorage.setItem("portafolioTheme", isDark ? "dark" : "light");

  const lbl = btn.querySelector(".label");
  lbl.textContent = isDark ? "Modo claro" : "Modo oscuro";
}

btn.addEventListener("click", toggleTheme);
loadTheme();
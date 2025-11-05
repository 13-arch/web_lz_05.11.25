const API_KEY = "d6ddc4d28c4347df8b8d90bf96e96103";

const cities = {
  "Минск": { lat: 53.9, lon: 27.5667 },
  "Москва": { lat: 55.7558, lon: 37.6173 },
  "Киев": { lat: 50.45, lon: 30.523 },
  "Варшава": { lat: 52.2297, lon: 21.0122 },
  "Берлин": { lat: 52.52, lon: 13.405 },
  "Париж": { lat: 48.8566, lon: 2.3522 },
  "Лондон": { lat: 51.5074, lon: -0.1278 },
  "Нью-Йорк": { lat: 40.7128, lon: -74.006 },
  "Токио": { lat: 35.6895, lon: 139.6917 },
  "Рим": { lat: 41.9028, lon: 12.4964 }
};

const buttonsContainer = document.getElementById("cityButtons");
Object.keys(cities).forEach(city => {
  const btn = document.createElement("button");
  btn.textContent = city;
  btn.addEventListener("click", () => loadWeather(city));
  buttonsContainer.appendChild(btn);
});

function showMessage(text, type="info") {
  const el = document.getElementById("message");
  el.textContent = text;
  el.className = type;
}

async function fetchWeather(lat, lon) {
  const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}&lang=ru&units=M`;
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Ошибка сети");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка API");
  return data;
}

function renderWeather(data) {
  const el = document.getElementById("weather");
  const info = data.data[0];

  const temp = Math.round(info.temp);
  const desc = info.weather.description;
  const icon = info.weather.icon;
  const city = info.city_name || "Неизвестное место";

  el.innerHTML = `
    <div><strong>${city}</strong></div>
    <div>Температура: ${temp}°C</div>
    <div>Погода: ${desc}</div>
    <div><img src="https://www.weatherbit.io/static/img/icons/${icon}.png" alt="${desc}"></div>
  `;

  el.classList.remove("fade-in");
  void el.offsetWidth;
  el.classList.add("fade-in");

  const code = info.weather.code;
  document.body.className = "default";
  if (code === 800) document.body.className = "clear"; 
  else if (code >= 801 && code <= 804) document.body.className = "clouds"; 
  else if (code >= 500 && code < 700) document.body.className = "rain";    
  else if (code >= 600 && code < 700) document.body.className = "snow";  
}

async function loadWeather(city) {
  showMessage(`Загружаем погоду для ${city}...`);
  document.getElementById("weather").innerHTML = "";
  try {
    const { lat, lon } = cities[city];
    const data = await fetchWeather(lat, lon);
    renderWeather(data);
    showMessage("Готово", "success");
  } catch (err) {
    showMessage(err.message, "error");
  }
}

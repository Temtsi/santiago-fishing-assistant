const catchForm = document.getElementById("catch-form");
const catchList = document.getElementById("catch-list");
const stats = document.getElementById("stats");
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const quickVoiceBtn = document.getElementById("quick-voice-btn");
const quickVoiceWrap = document.getElementById("quick-voice-wrap");
const voiceOutput = document.getElementById("voice-output");
const voiceHint = document.getElementById("voice-hint");
const aiEnabledInput = document.getElementById("ai-enabled");
const aiBackendUrlInput = document.getElementById("ai-api-key");
const aiModelInput = document.getElementById("ai-model");
const aiSaveBtn = document.getElementById("ai-save-btn");
const aiStatusEl = document.getElementById("ai-status");
const spotInput = document.getElementById("spot");
const catchLocationStatusEl = document.getElementById("catch-location-status");
const speciesNoteInput = document.getElementById("species-note");
const baitNoteInput = document.getElementById("bait-note");
const speciesPhotoFileInput = document.getElementById("species-photo-file");
const baitPhotoFileInput = document.getElementById("bait-photo-file");
const speciesOpenCameraBtn = document.getElementById("species-open-camera-btn");
const baitOpenCameraBtn = document.getElementById("bait-open-camera-btn");
const speciesCaptureBtn = document.getElementById("species-capture-btn");
const baitCaptureBtn = document.getElementById("bait-capture-btn");
const speciesCameraCloseBtn = document.getElementById("species-camera-close-btn");
const baitCameraCloseBtn = document.getElementById("bait-camera-close-btn");
const speciesCameraPanel = document.getElementById("species-camera-panel");
const baitCameraPanel = document.getElementById("bait-camera-panel");
const speciesCameraVideo = document.getElementById("species-camera-video");
const baitCameraVideo = document.getElementById("bait-camera-video");
const speciesPhotoPreview = document.getElementById("species-photo-preview");
const baitPhotoPreview = document.getElementById("bait-photo-preview");

const apiKeyInput = document.getElementById("owm-api-key");
const cityInput = document.getElementById("city-input");
const refreshForecastBtn = document.getElementById("forecast-refresh-btn");
const forecastStatus = document.getElementById("forecast-status");
const forecastScoreEl = document.getElementById("forecast-score");
const forecastGradeEl = document.getElementById("forecast-grade");
const weatherMetricsEl = document.getElementById("weather-metrics");
const forecastReasonsEl = document.getElementById("forecast-reasons");
const assistantWarningEl = document.getElementById("assistant-warning");

const tripDateInput = document.getElementById("trip-date");
const runDateForecastBtn = document.getElementById("run-date-forecast-btn");
const dateForecastStatusEl = document.getElementById("date-forecast-status");
const dateWeatherMetricsEl = document.getElementById("date-weather-metrics");
const dateBiteForecastEl = document.getElementById("date-bite-forecast");
const dailyForecastListEl = document.getElementById("daily-forecast-list");
const hourlyForecastListEl = document.getElementById("hourly-forecast-list");
const forecastOverviewEl = document.getElementById("forecast-overview");
const hourlyPageEl = document.getElementById("hourly-page");
const hourlyPageTitleEl = document.getElementById("hourly-page-title");
const hourlyPageStatusEl = document.getElementById("hourly-page-status");
const backToWeekBtn = document.getElementById("back-to-week-btn");

const mapEl = document.getElementById("main-map");
const poiListEl = document.getElementById("poi-list");
const addCurrentPoiBtn = document.getElementById("add-current-poi-btn");
const clearPoiBtn = document.getElementById("clear-poi-btn");
const mapStatusEl = document.getElementById("map-status");
const mapWindows = Array.from(document.querySelectorAll(".map-window"));
const navMapBtn = document.getElementById("nav-map");
const navCatchBtn = document.getElementById("nav-catch");
const navForecastBtn = document.getElementById("nav-forecast");
const navAssistantBtn = document.getElementById("nav-assistant");
const pages = {
  map: document.getElementById("page-map"),
  catch: document.getElementById("page-catch"),
  forecast: document.getElementById("page-forecast"),
  assistant: document.getElementById("page-assistant"),
};

const STORAGE_CATCHES = "fishmate_catches_v1";
const STORAGE_CHAT = "fishmate_chat_v1";
const STORAGE_SETTINGS = "fishmate_settings_v6";
const STORAGE_FORECAST_CACHE = "fishmate_forecast_cache_v1";
const STORAGE_POI = "fishmate_poi_v2";
const STORAGE_KB = "fishmate_knowledge_base_v1";
const DEFAULT_KNOWLEDGE_BASE = {
  version: 1,
  regions: ["Кобулети", "Батуми", "Черное море", "реки и озера Грузии"],
  species: [
    {
      name: "Ставрида",
      aliases: ["ставрида", "horse mackerel"],
      season: { startMonth: 4, endMonth: 10, peak: [6, 7, 8] },
      locations: ["Кобулети", "Батуми", "пирс", "берег", "лодка"],
      methods: ["самодур", "микроджиг", "пилькер"],
      gear: ["спиннинг 2-10 г", "шнур 0.3-0.6 PE", "флюр 0.16-0.20"],
      baits: ["узкие блестящие приманки", "светонакопительные ночью"]
    },
    {
      name: "Сибас",
      aliases: ["сибас", "лаврак", "sea bass"],
      season: { startMonth: 5, endMonth: 11, peak: [9, 10] },
      locations: ["Кобулети", "Батуми", "каменистый берег", "пирс"],
      methods: ["воблер минноу", "пилькер", "джиг"],
      gear: ["спиннинг 7-28 г", "шнур 0.8-1.2 PE", "флюр 0.22-0.30"],
      baits: ["воблер 90-120 мм", "силикон 3-4 дюйма", "пилькер 15-30 г"]
    },
    {
      name: "Камбала",
      aliases: ["камбала", "flounder"],
      season: { startMonth: 10, endMonth: 3, peak: [11, 12, 1, 2] },
      locations: ["Кобулети", "Батуми", "песчаное дно", "берег", "лодка"],
      methods: ["донка", "медленная придонная проводка"],
      gear: ["донное удилище", "груз 30-80 г", "поводок 0.22-0.28"],
      baits: ["креветка", "червь", "полоски рыбы"]
    },
    {
      name: "Щука",
      aliases: ["щука", "pike"],
      season: { startMonth: 3, endMonth: 11, peak: [4, 5, 9, 10] },
      locations: ["река", "озеро", "граница травы", "мелководье"],
      methods: ["джиг", "воблер", "колебалка"],
      gear: ["спиннинг 10-35 г", "поводок струна/титан"],
      baits: ["воблер 90-130 мм", "силикон 4-6 дюймов", "колебалка"]
    },
    {
      name: "Окунь",
      aliases: ["окунь", "perch"],
      season: { startMonth: 4, endMonth: 11, peak: [5, 6, 9] },
      locations: ["бровка", "камни", "прибрежная зона"],
      methods: ["микроджиг", "воблер", "вертушка"],
      gear: ["ультралайт 1-7 г", "шнур 0.2-0.4 PE"],
      baits: ["силикон 1.5-2.5 дюйма", "воблер 45-65 мм", "вертушка №0-2"]
    },
    {
      name: "Судак",
      aliases: ["судак", "zander"],
      season: { startMonth: 5, endMonth: 11, peak: [6, 7, 8, 9] },
      locations: ["русловой свал", "твердое дно", "глубина"],
      methods: ["джиг", "отводной"],
      gear: ["спиннинг 10-35 г", "шнур 0.6-1.0 PE", "флюр 0.25-0.30"],
      baits: ["силикон 3-5 дюймов", "поролон", "виброхвост"]
    },
    {
      name: "Карп",
      aliases: ["карп", "carp"],
      season: { startMonth: 5, endMonth: 10, peak: [6, 7, 8, 9] },
      locations: ["пруд", "озеро", "тихая река"],
      methods: ["фидер", "карпфишинг"],
      gear: ["карповик", "фидер", "монтаж волос"],
      baits: ["бойлы", "кукуруза", "пеллетс"]
    },
    {
      name: "Кефаль",
      aliases: ["кефаль", "лобан", "mullet"],
      season: { startMonth: 5, endMonth: 11, peak: [8, 9, 10] },
      locations: ["Кобулети", "Батуми", "устье", "берег"],
      methods: ["поплавок", "фидер", "легкий спиннинг"],
      gear: ["легкая снасть", "тонкий поводок 0.14-0.18"],
      baits: ["хлеб", "креветка", "мелкий силикон"]
    }
  ]
};

const catches = Array.isArray(loadJson(STORAGE_CATCHES, [])) ? loadJson(STORAGE_CATCHES, []) : [];
const chatHistory = Array.isArray(loadJson(STORAGE_CHAT, [])) ? loadJson(STORAGE_CHAT, []) : [];
const settings = loadJson(STORAGE_SETTINGS, {
  city: "Batumi",
  owmApiKey: "",
  mapStyle: "standard",
  ai: {
    enabled: false,
    backendUrl: "http://localhost:8787/api/ai",
    model: "gpt-4o-mini",
  },
});

if (!settings.ai || typeof settings.ai !== "object") {
  settings.ai = { enabled: false, backendUrl: "http://localhost:8787/api/ai", model: "gpt-4o-mini" };
}
settings.ai.model = settings.ai.model || "gpt-4o-mini";
settings.ai.backendUrl = settings.ai.backendUrl || "http://localhost:8787/api/ai";
settings.ai.enabled = Boolean(settings.ai.enabled);
const poiListRaw = Array.isArray(loadJson(STORAGE_POI, [])) ? loadJson(STORAGE_POI, []) : [];
const poiList = poiListRaw.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));

let lastForecast = loadJson(STORAGE_FORECAST_CACHE, null);
let lastRawForecastPayload = null;
let lastDailyForecasts = [];
let realMap = null;
let markerLayer = null;
let baseLayers = null;
let currentBaseLayer = null;
let currentCatchGps = null;
let catchGpsWatchId = null;
let catchSpeciesPhotoData = "";
let catchBaitPhotoData = "";
let activePhotoStream = null;
let knowledgeBase = loadJson(STORAGE_KB, null);

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function weatherIconByCode(code) {
  // OpenWeather condition groups
  if (code >= 200 && code < 600) return "Дождь"; // rain/thunder/drizzle
  if (code === 800) return "Ясно"; // clear
  if (code >= 801 && code <= 802) return "Облачно"; // partly cloudy
  if (code >= 803 && code <= 804) return "Пасмурно"; // cloudy/overcast
  return "Погода";
}

function weatherLabelByCode(code) {
  if (code >= 200 && code < 600) return "Дождь";
  if (code === 800) return "Солнце";
  if (code >= 801 && code <= 802) return "Облачно";
  if (code >= 803 && code <= 804) return "Пасмурно";
  return "Погода";
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dateKeyLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMoonPhase(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const c = Math.floor((year - 2000) / 100);
  const y = year - 2000 - c * 100;
  let jd = 0;
  jd += Math.floor((146097 * c) / 4);
  jd += Math.floor((1461 * y) / 4);
  jd += Math.floor((153 * (month + 9) % 12 + 2) / 5);
  jd += day + 1721119;
  const daysSinceNew = jd - 2451550.1;
  const newMoons = daysSinceNew / 29.53058867;
  return newMoons - Math.floor(newMoons);
}

function computeSolarLunarScore(date = new Date()) {
  const phase = getMoonPhase(date);
  const distanceToNew = Math.min(Math.abs(phase - 0), Math.abs(phase - 1));
  const distanceToFull = Math.abs(phase - 0.5);
  const bestDistance = Math.min(distanceToNew, distanceToFull);
  const normalized = clamp(1 - bestDistance / 0.25, 0, 1);
  return Math.round(35 + normalized * 55);
}

function pressureJumpFromForecast(list) {
  if (!Array.isArray(list) || list.length < 2) return 0;
  const pressures = list.map((x) => x.main?.pressure).filter((x) => typeof x === "number");
  if (pressures.length < 2) return 0;
  return Number((Math.max(...pressures) - Math.min(...pressures)).toFixed(1));
}

function weatherToInputs(data) {
  const first = data.list?.[0] ?? {};
  return {
    city: data.city?.name ?? settings.city,
    weatherCode: first.weather?.[0]?.id ?? 800,
    rain3h: first.rain?.["3h"] ?? 0,
    windMs: first.wind?.speed ?? 0,
    pressure: first.main?.pressure ?? 1013,
    pressureJump: pressureJumpFromForecast(data.list ?? []),
    tempC: first.main?.temp ?? null,
  };
}

function evaluateHonestForecast(weather, date = new Date()) {
  const lunarScore = computeSolarLunarScore(date);
  let finalScore = lunarScore;
  const reasons = [];
  const hardBlocks = [];

  if (weather.windMs >= 10) hardBlocks.push(`Штормовой ветер ${weather.windMs.toFixed(1)} м/с`);
  else if (weather.windMs >= 8) {
    reasons.push(`Сильный ветер ${weather.windMs.toFixed(1)} м/с снижает активность рыбы`);
    finalScore -= 25;
  }

  if (weather.rain3h >= 4 || (weather.weatherCode >= 200 && weather.weatherCode < 300)) hardBlocks.push("Сильный дождь или гроза");
  else if (weather.rain3h > 0) {
    reasons.push(`Осадки ${weather.rain3h.toFixed(1)} мм/3ч могут ухудшить клев`);
    finalScore -= 12;
  }

  if (weather.pressureJump >= 8) hardBlocks.push(`Резкий скачок давления ${weather.pressureJump} гПа`);
  else if (weather.pressureJump >= 5) {
    reasons.push(`Нестабильное давление (${weather.pressureJump} гПа)`);
    finalScore -= 15;
  }

  let explanation;
  if (hardBlocks.length > 0) {
    finalScore = clamp(Math.round(3 + Math.random() * 7), 0, 10);
    const intro = lunarScore >= 70 ? "Луна идеальна, но условия опасные." : "Даже при нормальной теории реальная погода критична.";
    explanation = `${intro} ${hardBlocks.join(", ")}. Рыба вероятно уйдет на глубину, а рыбалка может быть небезопасной.`;
  } else {
    finalScore = clamp(Math.round(finalScore), 0, 100);
    if (reasons.length === 0) reasons.push("Погодные условия стабильные, критичных факторов не обнаружено");
    explanation = "Погода не противоречит теоретическому прогнозу. Можно планировать выезд с учетом локальных условий.";
  }

  const grade = finalScore <= 10 ? "опасно" : finalScore <= 35 ? "слабый клев" : finalScore <= 65 ? "средний" : "хороший";
  return { lunarScore, finalScore, grade, reasons: [...hardBlocks, ...reasons], explanation, weather, evaluatedAt: new Date().toISOString(), hardLimitApplied: hardBlocks.length > 0 };
}

function renderForecast(result, sourceLabel = "") {
  if (!result) return;
  const score = result.finalScore;
  forecastScoreEl.textContent = `${score}%`;
  forecastGradeEl.textContent = result.grade;
  forecastGradeEl.style.background = score <= 10 ? "#c94949" : score <= 35 ? "#d28729" : score <= 65 ? "#7a9e2f" : "#1d9b6e";

  const w = result.weather;
  weatherMetricsEl.innerHTML = `
    <div class="metric"><small>Ветер</small><b>${w.windMs.toFixed(1)} м/с</b></div>
    <div class="metric"><small>Дождь (3ч)</small><b>${w.rain3h.toFixed(1)} мм</b></div>
    <div class="metric"><small>Давление</small><b>${w.pressure} гПа</b></div>
    <div class="metric"><small>Скачок давления</small><b>${w.pressureJump} гПа</b></div>
    <div class="metric"><small>Теория (Луна)</small><b>${result.lunarScore}%</b></div>
    <div class="metric"><small>Температура</small><b>${w.tempC == null ? "--" : `${w.tempC.toFixed(1)} °C`}</b></div>
    <div class="metric weather-icon-metric"><small>${weatherLabelByCode(w.weatherCode)}</small><b>${weatherIconByCode(w.weatherCode)}</b></div>
  `;

  forecastReasonsEl.innerHTML = "";
  result.reasons.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r;
    forecastReasonsEl.appendChild(li);
  });
  assistantWarningEl.textContent = result.explanation;

  const dt = new Date(result.evaluatedAt);
  forecastStatus.textContent = `${sourceLabel ? `Источник: ${sourceLabel}. ` : ""}Обновлено: ${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}.`;
}

function buildDailyForecasts(rawPayload) {
  if (!rawPayload || !Array.isArray(rawPayload.list)) return [];

  const byDay = new Map();
  rawPayload.list.forEach((entry) => {
    const dt = new Date((entry.dt ?? 0) * 1000);
    const key = dateKeyLocal(dt);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(entry);
  });

  const sortedKeys = Array.from(byDay.keys()).sort((a, b) => a.localeCompare(b));
  if (!sortedKeys.length) return [];

  const normalizeDay = (entries, dayKey) => {
    const winds = entries.map((e) => e.wind?.speed ?? 0);
    const rains = entries.map((e) => e.rain?.["3h"] ?? 0);
    const temps = entries.map((e) => e.main?.temp).filter((x) => typeof x === "number");
    const pressures = entries.map((e) => e.main?.pressure).filter((x) => typeof x === "number");
    const weatherCode = entries[0]?.weather?.[0]?.id ?? 800;

    const weather = {
      city: rawPayload.city?.name ?? settings.city,
      weatherCode,
      windMs: winds.length ? winds.reduce((a, b) => a + b, 0) / winds.length : 0,
      rain3h: rains.length ? Math.max(...rains) : 0,
      pressure: pressures.length ? Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length) : 1013,
      pressureJump: pressures.length ? Number((Math.max(...pressures) - Math.min(...pressures)).toFixed(1)) : 0,
      tempC: temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null,
    };

    return {
      dateKey: dayKey,
      weather,
      result: evaluateHonestForecast(weather, new Date(`${dayKey}T12:00:00`)),
    };
  };

  const actualDays = sortedKeys.map((k) => normalizeDay(byDay.get(k), k));

  // Always show 7 days. If API has fewer, extrapolate from last known day.
  const week = [];
  const firstDate = new Date(`${sortedKeys[0]}T00:00:00`);

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(firstDate);
    targetDate.setDate(targetDate.getDate() + i);
    const key = dateKeyLocal(targetDate);

    const found = actualDays.find((d) => d.dateKey === key);
    if (found) {
      week.push(found);
      continue;
    }

    const seed = week[week.length - 1] || actualDays[actualDays.length - 1];
    const wave = Math.sin(i / 2);
    const weather = {
      city: seed.weather.city,
      weatherCode: seed.weather.weatherCode,
      windMs: Math.max(0, seed.weather.windMs + wave * 0.6),
      rain3h: Math.max(0, seed.weather.rain3h + wave * 0.2),
      pressure: Math.round(seed.weather.pressure + wave * 2),
      pressureJump: Math.max(0, seed.weather.pressureJump + Math.abs(wave) * 0.6),
      tempC: seed.weather.tempC == null ? null : seed.weather.tempC + wave * 0.8,
    };

    week.push({
      dateKey: key,
      weather,
      result: evaluateHonestForecast(weather, new Date(`${key}T12:00:00`)),
    });
  }

  return week;
}
function formatDayTitle(dateKey) {
  const dt = new Date(`${dateKey}T00:00:00`);
  const weekday = dt.toLocaleDateString("ru-RU", { weekday: "short" }).replace(".", "");
  const dayMonth = dt.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
  return `${weekday.toUpperCase()} ${dayMonth}`;
}

function renderDailyForecastList(days) {
  if (!dailyForecastListEl) return;
  dailyForecastListEl.innerHTML = "";

  if (!days.length) {
    const li = document.createElement("li");
    li.textContent = "Нет данных прогноза по дням.";
    dailyForecastListEl.appendChild(li);
    return;
  }

  days.forEach((d) => {
    const temp = d.weather.tempC == null ? "--" : `${d.weather.tempC.toFixed(1)}°C`;
    const li = document.createElement("li");
    li.className = "daily-card";
    li.setAttribute("data-date", d.dateKey);
    li.innerHTML = `
      <div class="daily-card-head">${formatDayTitle(d.dateKey)}</div>
      <div class="daily-card-body">
        <div class="daily-icon">${weatherIconByCode(d.weather.weatherCode)}</div>
        <div class="daily-temps">
          <div class="daily-temp-max">Темп: ${temp}</div>
          <div class="daily-temp-min">Клев: ${d.result.finalScore}%</div>
        </div>
        <div class="daily-metrics">
          <div>Ветер: <b>${d.weather.windMs.toFixed(1)} м/с</b></div>
          <div>Осадки: <b>${d.weather.rain3h.toFixed(1)} мм</b></div>
        </div>
        <div class="daily-bite">${d.result.grade}</div>
      </div>
    `;
    li.addEventListener("click", () => {
      if (tripDateInput) tripDateInput.value = d.dateKey;
      openHourlyPage(d.dateKey);
    });
    dailyForecastListEl.appendChild(li);
  });
}

function buildHourlyForecastForDate(dateKey, rawPayload) {
  if (!rawPayload || !Array.isArray(rawPayload.list)) return [];

  const dayEntries = rawPayload.list
    .map((entry) => {
      const dt = new Date((entry.dt ?? 0) * 1000);
      return {
        dt,
        minuteOfDay: dt.getHours() * 60 + dt.getMinutes(),
        weatherCode: entry.weather?.[0]?.id ?? 800,
        tempC: entry.main?.temp ?? null,
        windMs: entry.wind?.speed ?? 0,
        rain3h: entry.rain?.["3h"] ?? 0,
        pressure: entry.main?.pressure ?? 1013,
      };
    })
    .filter((entry) => dateKeyLocal(entry.dt) === dateKey)
    .sort((a, b) => a.minuteOfDay - b.minuteOfDay);

  if (!dayEntries.length) return [];

  const sampleAtHour = (hour) => {
    const targetMin = hour * 60;
    let left = dayEntries[0];
    let right = dayEntries[dayEntries.length - 1];

    for (let i = 0; i < dayEntries.length; i++) {
      const p = dayEntries[i];
      if (p.minuteOfDay <= targetMin) left = p;
      if (p.minuteOfDay >= targetMin) {
        right = p;
        break;
      }
    }

    if (left.minuteOfDay === right.minuteOfDay) {
      return { ...left };
    }

    const ratio = (targetMin - left.minuteOfDay) / (right.minuteOfDay - left.minuteOfDay);
    const lerp = (a, b) => a + (b - a) * ratio;

    return {
      minuteOfDay: targetMin,
      weatherCode: ratio < 0.5 ? left.weatherCode : right.weatherCode,
      tempC: left.tempC == null || right.tempC == null ? null : lerp(left.tempC, right.tempC),
      windMs: lerp(left.windMs, right.windMs),
      rain3h: lerp(left.rain3h, right.rain3h),
      pressure: lerp(left.pressure, right.pressure),
    };
  };

  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    const sample = sampleAtHour(hour);
    const dt = new Date(`${dateKey}T00:00:00`);
    dt.setHours(hour, 0, 0, 0);

    const weather = {
      city: rawPayload.city?.name ?? settings.city,
      weatherCode: sample.weatherCode,
      rain3h: sample.rain3h,
      windMs: sample.windMs,
      pressure: Math.round(sample.pressure),
      pressureJump: 0,
      tempC: sample.tempC,
    };

    hours.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      weather,
      result: evaluateHonestForecast(weather, dt),
    });
  }

  return hours;
}
function showForecastOverview() {
  if (forecastOverviewEl) forecastOverviewEl.classList.remove("is-hidden");
  if (hourlyPageEl) hourlyPageEl.classList.add("is-hidden");
}

function openHourlyPage(dateKey) {
  if (!dateKey) return;

  if (tripDateInput) tripDateInput.value = dateKey;
  renderDateForecast(dateKey);

  if (forecastOverviewEl) forecastOverviewEl.classList.add("is-hidden");
  if (hourlyPageEl) hourlyPageEl.classList.remove("is-hidden");

  if (hourlyPageTitleEl) {
    hourlyPageTitleEl.textContent = `Почасовой прогноз (24ч) на ${dateKey}`;
  }
  if (hourlyPageStatusEl) {
    hourlyPageStatusEl.textContent = `Детальный прогноз по часам для ${dateKey}.`;
  }
}

function renderHourlyForecast(dateKey) {
  if (!hourlyForecastListEl) return;
  hourlyForecastListEl.innerHTML = "";

  const rows = buildHourlyForecastForDate(dateKey, lastRawForecastPayload);
  if (!rows.length) {
    const li = document.createElement("li");
    li.textContent = "На выбранную дату нет почасовых данных.";
    hourlyForecastListEl.appendChild(li);
    return;
  }

  rows.forEach((r) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="hour-time">${r.time}</span>
      <span class="hour-icon">${weatherIconByCode(r.weather.weatherCode)}</span>
      <span class="hour-temp">${r.weather.tempC == null ? "--" : `${r.weather.tempC.toFixed(1)} °C`}</span>
      <span class="hour-wind">Ветер: ${r.weather.windMs.toFixed(1)} м/с</span>
      <span class="hour-rain">Осадки: ${r.weather.rain3h.toFixed(1)} мм</span>
      <span class="hour-bite">Клев: ${r.result.finalScore}%</span>
    `;
    hourlyForecastListEl.appendChild(li);
  });
}
function renderDateForecast(dateKey) {
  if (!dateKey) return;

  const day = lastDailyForecasts.find((d) => d.dateKey === dateKey);
  if (!day) {
    dateForecastStatusEl.textContent = `На дату ${dateKey} нет данных. Выбери дату из доступных в прогнозе.`;
    dateWeatherMetricsEl.innerHTML = "";
    dateBiteForecastEl.innerHTML = "";
    if (hourlyForecastListEl) hourlyForecastListEl.innerHTML = "";
    return;
  }

  dateForecastStatusEl.textContent = `Прогноз на ${dateKey}`;
  const cards = dailyForecastListEl ? dailyForecastListEl.querySelectorAll(".daily-card") : [];
  cards.forEach((card) => {
    card.classList.toggle("active", card.getAttribute("data-date") === dateKey);
  });
  dateWeatherMetricsEl.innerHTML = `
    <div class="metric"><small>Ветер</small><b>${day.weather.windMs.toFixed(1)} м/с</b></div>
    <div class="metric"><small>Дождь (пик 3ч)</small><b>${day.weather.rain3h.toFixed(1)} мм</b></div>
    <div class="metric"><small>Давление</small><b>${day.weather.pressure} гПа</b></div>
    <div class="metric"><small>Скачок давления</small><b>${day.weather.pressureJump} гПа</b></div>
    <div class="metric"><small>Температура</small><b>${day.weather.tempC == null ? "--" : `${day.weather.tempC.toFixed(1)} °C`}</b></div>
    <div class="metric weather-icon-metric"><small>${weatherLabelByCode(day.weather.weatherCode)}</small><b>${weatherIconByCode(day.weather.weatherCode)}</b></div>
  `;

  dateBiteForecastEl.innerHTML = `<div class="score-label">Прогноз клева на дату</div><div class="score-value">${day.result.finalScore}%</div><div class="score-badge">${day.result.grade}</div><div class="hint">${day.result.explanation}</div>`;

  renderHourlyForecast(dateKey);
}

async function fetchOpenWeatherForecast(city, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(apiKey)}&units=metric&lang=ru`;
  const response = await fetch(url, { method: "GET" });
  const payload = await response.json();
  if (!response.ok) {
    const msg = payload?.message ? `: ${payload.message}` : "";
    throw new Error(`OpenWeather error ${response.status}${msg}`);
  }
  return payload;
}

async function refreshForecast() {
  const city = cityInput.value.trim();
  const apiKey = apiKeyInput.value.trim();
  if (!city) return (forecastStatus.textContent = "Введите город.");
  if (!apiKey) return (forecastStatus.textContent = "Введите OpenWeather API key.");

  settings.city = city;
  settings.owmApiKey = apiKey;
  saveJson(STORAGE_SETTINGS, settings);

  forecastStatus.textContent = "Загружаю погоду...";
  try {
    const raw = await fetchOpenWeatherForecast(city, apiKey);
    lastRawForecastPayload = raw;

    const currentResult = evaluateHonestForecast(weatherToInputs(raw));
    lastForecast = currentResult;
    saveJson(STORAGE_FORECAST_CACHE, currentResult);
    renderForecast(currentResult, "OpenWeather");

    lastDailyForecasts = buildDailyForecasts(raw);
    renderDailyForecastList(lastDailyForecasts);

    if (!tripDateInput.value && lastDailyForecasts.length > 0) {
      tripDateInput.value = lastDailyForecasts[0].dateKey;
    }

    const selectedDate = tripDateInput.value || (lastDailyForecasts[0]?.dateKey ?? "");
    if (selectedDate) {
      renderDateForecast(selectedDate);
      showForecastOverview();
    }
  } catch (err) {
    forecastStatus.textContent = `Ошибка загрузки: ${err instanceof Error ? err.message : "unknown error"}`;
  }
}

function createStandardLayer() {
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  });
}

function createSatelliteLayer() {
  return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles © Esri",
  });
}

function createLabelsLayer() {
  return L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Labels © Esri",
  });
}

function setMapStyle(styleKey) {
  if (!realMap || !baseLayers) return;

  const nextLayer = baseLayers[styleKey] || baseLayers.standard;
  if (currentBaseLayer) {
    realMap.removeLayer(currentBaseLayer);
  }
  nextLayer.addTo(realMap);
  currentBaseLayer = nextLayer;

  settings.mapStyle = styleKey in baseLayers ? styleKey : "standard";
  saveJson(STORAGE_SETTINGS, settings);

  mapWindows.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.style === settings.mapStyle);
  });

  const label = settings.mapStyle === "hybrid" ? "Гибрид" : settings.mapStyle === "satellite" ? "Спутник" : "Стандарт";
  if (mapStatusEl) mapStatusEl.textContent = `Точек: ${poiList.length} | Слой: ${label}`;
}

function initPreviewMap(elId, style) {
  const el = document.getElementById(elId);
  if (!(window.L && el)) return;

  const map = L.map(el, {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    boxZoom: false,
    keyboard: false,
    tap: false,
    touchZoom: false,
  }).setView([41.6168, 41.6367], 7);

  if (style === "standard") {
    createStandardLayer().addTo(map);
  } else if (style === "satellite") {
    createSatelliteLayer().addTo(map);
  } else {
    createSatelliteLayer().addTo(map);
    createLabelsLayer().addTo(map);
  }

  setTimeout(() => map.invalidateSize(), 80);
}

function initMap() {
  if (!(window.L && mapEl)) {
    mapStatusEl.textContent = "Карта не загрузилась (нет Leaflet).";
    return;
  }

  realMap = L.map("main-map").setView([41.6168, 41.6367], 8);

  baseLayers = {
    standard: createStandardLayer(),
    satellite: createSatelliteLayer(),
    hybrid: L.layerGroup([createSatelliteLayer(), createLabelsLayer()]),
  };

  setMapStyle(settings.mapStyle || "standard");

  markerLayer = L.layerGroup().addTo(realMap);
  realMap.on("click", (e) => addPoi(e.latlng.lat, e.latlng.lng, "map-click"));
  setTimeout(() => realMap.invalidateSize(), 150);

  initPreviewMap("preview-standard", "standard");
  initPreviewMap("preview-satellite", "satellite");
  initPreviewMap("preview-hybrid", "hybrid");
}

function formatGpsLabel(lat, lng) {
  return `GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function setCatchGps(lat, lng) {
  currentCatchGps = { lat, lng };
  if (spotInput) {
    spotInput.value = formatGpsLabel(lat, lng);
  }
  if (catchLocationStatusEl) {
    catchLocationStatusEl.textContent = `GPS обновлен: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

function startCatchLocationTracking() {
  if (!navigator.geolocation) {
    if (catchLocationStatusEl) {
      catchLocationStatusEl.textContent = "Геолокация не поддерживается в этом браузере.";
    }
    return;
  }

  catchGpsWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      setCatchGps(pos.coords.latitude, pos.coords.longitude);
    },
    (err) => {
      if (catchLocationStatusEl) {
        catchLocationStatusEl.textContent = `GPS недоступен: ${err.message}`;
      }
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
  );
}

function getCurrentGpsOnce() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Геолокация не поддерживается"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function addPoi(lat, lng, source = "manual") {
  const point = {
    id: Date.now(),
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    source,
    createdAt: new Date().toISOString(),
  };
  poiList.push(point);
  saveJson(STORAGE_POI, poiList);
  renderPoi();
}

function addCurrentPositionPoi() {
  if (!navigator.geolocation) {
    mapStatusEl.textContent = "Геолокация не поддерживается в этом браузере.";
    return;
  }

  mapStatusEl.textContent = "Определяю геопозицию...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      addPoi(lat, lng, "gps-device");
      setCatchGps(lat, lng);
      if (realMap) realMap.setView([lat, lng], 12);
    },
    (err) => {
      mapStatusEl.textContent = `Ошибка геолокации: ${err.message}`;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function renderPoi() {
  if (markerLayer) markerLayer.clearLayers();
  const label = settings.mapStyle === "hybrid" ? "Гибрид" : settings.mapStyle === "satellite" ? "Спутник" : "Стандарт";
  if (mapStatusEl) mapStatusEl.textContent = `Точек: ${poiList.length} | Слой: ${label}`;

  poiListEl.innerHTML = "";
  poiList.forEach((p, idx) => {
    if (markerLayer) {
      L.marker([p.lat, p.lng]).addTo(markerLayer).bindPopup(`Точка ${idx + 1}<br>${p.lat}, ${p.lng}`);
    }

    const li = document.createElement("li");
    li.innerHTML = `<b>Точка ${idx + 1}</b><br>GPS: ${p.lat}, ${p.lng}<br>Источник: ${p.source}`;
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.style.marginTop = "6px";
    del.addEventListener("click", () => {
      poiList.splice(idx, 1);
      saveJson(STORAGE_POI, poiList);
      renderPoi();
    });
    li.appendChild(document.createElement("br"));
    li.appendChild(del);
    poiListEl.appendChild(li);
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setPreview(previewEl, dataUrl) {
  if (!previewEl) return;
  if (!dataUrl) {
    previewEl.classList.add("is-hidden");
    previewEl.removeAttribute("src");
    return;
  }
  previewEl.src = dataUrl;
  previewEl.classList.remove("is-hidden");
}

function bindPhotoInput(inputEl, previewEl, setter) {
  if (!inputEl) return;
  inputEl.addEventListener("change", async () => {
    const file = inputEl.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setter(dataUrl);
      setPreview(previewEl, dataUrl);
    } catch {
      setPreview(previewEl, "");
    }
  });
}
function stopActivePhotoStream() {
  if (activePhotoStream) {
    activePhotoStream.getTracks().forEach((t) => t.stop());
    activePhotoStream = null;
  }
}

function closeCameraPanel(panelEl, videoEl) {
  if (panelEl) panelEl.classList.add("is-hidden");
  if (videoEl) videoEl.srcObject = null;
  stopActivePhotoStream();
}

async function openCameraPanel(panelEl, videoEl) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (voiceHint) voiceHint.textContent = "Камера не поддерживается в этом браузере.";
    return;
  }

  try {
    stopActivePhotoStream();
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    activePhotoStream = stream;
    if (videoEl) {
      videoEl.srcObject = stream;
      await videoEl.play();
    }
    if (panelEl) panelEl.classList.remove("is-hidden");
  } catch {
    if (voiceHint) voiceHint.textContent = "Нет доступа к камере. Разреши камеру для сайта.";
  }
}

function captureFromCamera(videoEl, panelEl, setter, previewEl) {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  setter(dataUrl);
  setPreview(previewEl, dataUrl);
  closeCameraPanel(panelEl, videoEl);
}
function renderCatches() {
  catchList.innerHTML = "";
  const sorted = catches.map((item, idx) => ({ ...item, _idx: idx })).sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${item.species}</b> ${item.weight} кг
      <br>${item.spot} | ${item.bait} | ${item.date}
      ${item.speciesNote ? `<br><small><b>Описание рыбы:</b> ${item.speciesNote}</small>` : ""}
      ${item.baitNote ? `<br><small><b>Описание приманки:</b> ${item.baitNote}</small>` : ""}
      ${item.speciesPhoto ? `<div class="catch-photo-wrap"><small>Фото рыбы</small><img class="catch-photo" src="${item.speciesPhoto}" alt="Фото рыбы" /></div>` : ""}
      ${item.baitPhoto ? `<div class="catch-photo-wrap"><small>Фото приманки</small><img class="catch-photo" src="${item.baitPhoto}" alt="Фото приманки" /></div>` : ""}
    `;
    const del = document.createElement("button");
    del.textContent = "Удалить";
    del.style.marginTop = "6px";
    del.addEventListener("click", () => { catches.splice(item._idx, 1); saveJson(STORAGE_CATCHES, catches); renderCatches(); });
    li.appendChild(document.createElement("br"));
    li.appendChild(del);
    catchList.appendChild(li);
  });

  const total = catches.length;
  const totalWeight = catches.reduce((sum, c) => sum + Number(c.weight), 0);
  const speciesCount = new Set(catches.map((c) => c.species.toLowerCase())).size;
  stats.innerHTML = `<div class="stat"><small>Всего уловов</small><b>${total}</b></div><div class="stat"><small>Общий вес</small><b>${totalWeight.toFixed(2)} кг</b></div><div class="stat"><small>Видов рыбы</small><b>${speciesCount}</b></div>`;
}

catchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    if (!currentCatchGps) {
      const gps = await getCurrentGpsOnce();
      setCatchGps(gps.lat, gps.lng);
    }
  } catch {
    if (catchLocationStatusEl) {
      catchLocationStatusEl.textContent = "Не удалось получить GPS перед записью.";
    }
  }

  catches.push({
    species: document.getElementById("species").value.trim(),
    speciesNote: speciesNoteInput ? speciesNoteInput.value.trim() : "",
    speciesPhoto: catchSpeciesPhotoData,
    weight: document.getElementById("weight").value.trim(),
    spot: spotInput ? spotInput.value.trim() : "",
    bait: document.getElementById("bait").value.trim(),
    baitNote: baitNoteInput ? baitNoteInput.value.trim() : "",
    baitPhoto: catchBaitPhotoData,
    date: document.getElementById("date").value,
  });
  saveJson(STORAGE_CATCHES, catches);
  catchForm.reset();
  catchSpeciesPhotoData = "";
  catchBaitPhotoData = "";
  setPreview(speciesPhotoPreview, "");
  setPreview(baitPhotoPreview, "");
  if (speciesPhotoFileInput) speciesPhotoFileInput.value = "";
  if (baitPhotoFileInput) baitPhotoFileInput.value = "";
  closeCameraPanel(speciesCameraPanel, speciesCameraVideo);
  closeCameraPanel(baitCameraPanel, baitCameraVideo);

  if (currentCatchGps && spotInput) {
    spotInput.value = formatGpsLabel(currentCatchGps.lat, currentCatchGps.lng);
  }

  renderCatches();
  botReply("Запись улова добавлена с текущей GPS-локацией.");
});

function addChat(role, text, persist = true) {
  const row = document.createElement("div");
  row.className = `msg ${role}`;
  row.textContent = text;
  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
  if (persist) {
    chatHistory.push({ role, text, ts: Date.now() });
    saveJson(STORAGE_CHAT, chatHistory);
  }
}

function botReply(text) {
  addChat("bot", text);
  if (voiceOutput.checked && "speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}

function forecastContextNote() {
  if (!lastForecast) return "Сначала обнови честный прогноз.";
  if (lastForecast.hardLimitApplied) return `Сейчас прогноз занижен до ${lastForecast.finalScore}%: ${lastForecast.explanation}`;
  return `Текущая оценка клева ${lastForecast.finalScore}% (${lastForecast.grade}).`;
}

async function loadKnowledgeBase() {
  if (knowledgeBase && Array.isArray(knowledgeBase.species) && knowledgeBase.species.length) {
    return;
  }

  // file:// mode often blocks fetch to local JSON. Use embedded fallback KB.
  const fallbackKb = JSON.parse(JSON.stringify(DEFAULT_KNOWLEDGE_BASE));

  try {
    const isFileProtocol = window.location.protocol === "file:";
    if (isFileProtocol) {
      knowledgeBase = fallbackKb;
      saveJson(STORAGE_KB, knowledgeBase);
      return;
    }

    const res = await fetch("./data/knowledge-base.json");
    if (!res.ok) throw new Error("kb fetch failed");
    const payload = await res.json();
    if (!payload || !Array.isArray(payload.species) || payload.species.length === 0) throw new Error("kb invalid");
    knowledgeBase = payload;
    saveJson(STORAGE_KB, payload);
  } catch {
    knowledgeBase = fallbackKb;
    saveJson(STORAGE_KB, knowledgeBase);
  }
}

function normalizeRu(text) {
  return String(text || "").toLowerCase().replaceAll("ё", "е");
}

function getTargetDateFromQuery(query) {
  const q = normalizeRu(query);
  const d = new Date();
  if (q.includes("послезавтра")) d.setDate(d.getDate() + 2);
  else if (q.includes("завтра")) d.setDate(d.getDate() + 1);
  return d;
}

function isInSeason(month, season) {
  if (!season || !season.startMonth || !season.endMonth) return true;
  const start = Number(season.startMonth);
  const end = Number(season.endMonth);
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

function scoreSpeciesHit(query, item) {
  const q = normalizeRu(query);
  const aliases = [item.name, ...(item.aliases || [])].map(normalizeRu);
  return aliases.reduce((acc, a) => acc + (q.includes(a) ? 1 : 0), 0);
}

function searchKnowledge(query, limit = 4) {
  if (!knowledgeBase || !Array.isArray(knowledgeBase.species)) return [];
  const scored = knowledgeBase.species
    .map((s) => ({ s, score: scoreSpeciesHit(query, s) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);

  if (scored.length) return scored;
  return knowledgeBase.species.slice(0, Math.min(limit, knowledgeBase.species.length));
}

function speciesToText(item, query) {
  const date = getTargetDateFromQuery(query);
  const month = date.getMonth() + 1;
  const inSeason = isInSeason(month, item.season);
  const seasonText = item.season
    ? `${item.season.startMonth}-${item.season.endMonth} мес.`
    : "круглый год";

  return [
    `${item.name}: сезон ${seasonText}.`,
    inSeason ? "Сезон по дате подходит." : "По указанной дате сезон может не подходить.",
    `Локации: ${(item.locations || []).join(", ")}.`,
    `Методы: ${(item.methods || []).join(", ")}.`,
    `Снасти: ${(item.gear || []).join(", ")}.`,
    `Приманки/насадки: ${(item.baits || []).join(", ")}.`,
  ].join(" ");
}

function searchDocuments(query, limit = 3) {
  const docs = Array.isArray(knowledgeBase?.documents) ? knowledgeBase.documents : [];
  if (!docs.length) return [];
  const q = normalizeRu(query || "");
  const words = q.split(/\s+/).filter((w) => w.length >= 4).slice(0, 8);
  const scored = docs
    .map((d) => {
      const text = normalizeRu(d.text || "");
      const score = words.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
  return scored;
}

function buildKnowledgeContext(query) {
  const hits = searchKnowledge(query);
  const docs = searchDocuments(query);

  if (!hits.length && !docs.length) return "База знаний пока пуста.";

  const speciesPart = hits.map((h, i) => `${i + 1}. ${speciesToText(h, query)}`);
  const docsPart = docs.map((d, i) => `${i + 1}. [${d.topic || "book"}] ${(d.text || "").slice(0, 420)}`);

  return [
    speciesPart.length ? `Виды рыб:\n${speciesPart.join("\n")}` : "",
    docsPart.length ? `Книжные заметки:\n${docsPart.join("\n")}` : "",
  ].filter(Boolean).join("\n\n");
}

function knowledgeSpeciesCount() {
  return Array.isArray(knowledgeBase?.species) ? knowledgeBase.species.length : 0;
}

function updateAiStatus(text) {
  if (aiStatusEl) aiStatusEl.textContent = text;
}

function buildKnowledgeOnlyReply(userText) {
  const hits = searchKnowledge(userText, 1);
  if (!hits.length) {
    return "Я не нашел этот вид в базе знаний. Напиши вид рыбы точнее, например: сибас, камбала, ставрида.";
  }
  const main = hits[0];
  const seasonInfo = speciesToText(main, userText);
  return `${seasonInfo} Чтобы получать полноценные рекомендации ИИ, включи ИИ и укажи OpenAI API key.`;
}

async function askOpenAiAdvice(userText) {
  if (!settings.ai.enabled || !settings.ai.backendUrl) return null;

  const knowledge = buildKnowledgeContext(userText);
  const weatherNote = lastForecast
    ? `Текущая оценка клева ${lastForecast.finalScore}% (${lastForecast.grade}). ${lastForecast.explanation}`
    : "Текущая оценка клева не рассчитана.";

  try {
    updateAiStatus("AI обрабатывает запрос...");
    const response = await fetch(settings.ai.backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: settings.ai.model || "gpt-4o-mini",
        userText,
        knowledge,
        weatherNote,
        history: chatHistory.slice(-8),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      updateAiStatus(`Ошибка AI backend: ${data?.error || response.status}`);
      return null;
    }

    const answer = String(data?.answer || "").trim();
    if (!answer) {
      updateAiStatus("AI backend не вернул ответ.");
      return null;
    }

    updateAiStatus("AI подключен через backend.");
    return answer;
  } catch {
    updateAiStatus("Нет связи с AI backend. Проверь URL и статус сервиса.");
    return null;
  }
}

async function buildAssistantReply(input) {
  await loadKnowledgeBase();

  const aiAnswer = await askOpenAiAdvice(input);
  if (aiAnswer) return aiAnswer;

  // If AI is disabled or backend is unavailable, always answer from local knowledge.
  const kbReply = buildKnowledgeOnlyReply(input);
  if (kbReply) return kbReply;

  return makeAssistantAnswer(input);
}
function makeAssistantAnswer(input) {
  const q = input.toLowerCase();
  if (q.includes("карта") || q.includes("точк") || q.includes("gps")) return "Выбери окно карты: Стандарт, Спутник или Гибрид. Точки ставятся в GPS-координатах.";
  if (q.includes("прогноз") || q.includes("погод") || q.includes("календар")) return "Выбери дату в календаре и нажми 'Прогноз на дату' для погоды и клева.";
  return `Напиши вид рыбы и сезон. ${forecastContextNote()}`;
}

function initAiSettingsUi() {
  if (aiEnabledInput) aiEnabledInput.checked = settings.ai.enabled;
  if (aiBackendUrlInput) aiBackendUrlInput.value = settings.ai.backendUrl || "http://localhost:8787/api/ai";
  if (aiModelInput) aiModelInput.value = settings.ai.model || "gpt-4o-mini";

  const kbCount = knowledgeSpeciesCount();
  if (settings.ai.enabled && settings.ai.backendUrl) {
    updateAiStatus(`AI enabled. Backend: ${settings.ai.backendUrl}. Knowledge base: ${kbCount} species.`);
    return;
  }
  if (settings.ai.enabled && !settings.ai.backendUrl) {
    updateAiStatus(`AI enabled, but backend URL is empty. Knowledge base: ${kbCount} species.`);
    return;
  }
  updateAiStatus(`AI disabled. Knowledge base: ${kbCount} species. Enable AI and set backend URL.`);
}

function saveAiSettingsFromUi() {
  settings.ai.enabled = Boolean(aiEnabledInput?.checked);
  settings.ai.backendUrl = aiBackendUrlInput?.value.trim() || "";
  settings.ai.model = aiModelInput?.value.trim() || "gpt-4o-mini";
  if (!settings.ai.enabled && settings.ai.backendUrl) {
    settings.ai.enabled = true;
    if (aiEnabledInput) aiEnabledInput.checked = true;
  }
  saveJson(STORAGE_SETTINGS, settings);

  const kbCount = knowledgeSpeciesCount();
  if (settings.ai.enabled && !settings.ai.backendUrl) {
    updateAiStatus(`AI enabled, but backend URL is empty. Knowledge base: ${kbCount} species.`);
    return;
  }
  updateAiStatus(
    settings.ai.enabled
      ? `AI settings saved. Backend: ${settings.ai.backendUrl}. Knowledge base: ${kbCount} species.`
      : `AI disabled. Knowledge base: ${kbCount} species.`
  );
}
function detectMapStyleCommand(input) {
  const q = input.toLowerCase();
  const hasMapIntent = q.includes("карт") || q.includes("слой") || q.includes("вид");
  const hasAction = ["открой", "открыть", "включи", "покажи", "переключи", "сделай"].some((v) => q.includes(v));

  const wantsStandard = q.includes("стандарт");
  const wantsSatellite = q.includes("спутник") || q.includes("satellite");
  const wantsHybrid = q.includes("гибрид") || q.includes("hybrid");

  if (!(wantsStandard || wantsSatellite || wantsHybrid)) return null;
  if (!hasAction && !hasMapIntent) return null;

  if (wantsSatellite) return "satellite";
  if (wantsHybrid) return "hybrid";
  return "standard";
}

function mapStyleLabel(style) {
  if (style === "satellite") return "Спутник";
  if (style === "hybrid") return "Гибрид";
  return "Стандарт";
}
function detectForecastDateCommand(input) {
  const q = input.toLowerCase().trim();
  const asksForecast = q.includes("прогноз") || q.includes("погод") || q.includes("по часам");
  if (!asksForecast) return null;

  if (!Array.isArray(lastDailyForecasts) || lastDailyForecasts.length === 0) {
    return { error: "no_data" };
  }

  const now = new Date();
  let targetDate = null;

  if (q.includes("послезавтра")) {
    targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (q.includes("завтра")) {
    targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (q.includes("сегодня")) {
    targetDate = new Date(now);
  }

  if (!targetDate) {
    const weekdays = {
      "воскрес": 0,
      "понед": 1,
      "втор": 2,
      "сред": 3,
      "четв": 4,
      "пят": 5,
      "суб": 6,
    };
    const hit = Object.entries(weekdays).find(([k]) => q.includes(k));
    if (hit) {
      const targetWeekday = hit[1];
      targetDate = new Date(now);
      let diff = (targetWeekday - targetDate.getDay() + 7) % 7;
      if (diff === 0) diff = 7;
      targetDate.setDate(targetDate.getDate() + diff);
    }
  }

  if (!targetDate) return null;

  const key = dateKeyLocal(targetDate);
  const day = lastDailyForecasts.find((d) => d.dateKey === key);
  if (day) return { dateKey: key };

  const fallback = lastDailyForecasts[0]?.dateKey || null;
  return fallback ? { dateKey: fallback, fallback: true } : { error: "no_data" };
}
function setActivePage(pageKey) {
  Object.entries(pages).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle("active", key === pageKey);
  });

  navMapBtn?.classList.toggle("active", pageKey === "map");
  navCatchBtn?.classList.toggle("active", pageKey === "catch");
  navForecastBtn?.classList.toggle("active", pageKey === "forecast");
  navAssistantBtn?.classList.toggle("active", pageKey === "assistant");

  if (quickVoiceWrap) {
    quickVoiceWrap.classList.toggle("is-hidden", pageKey === "assistant");
  }

  if (pageKey === "map" && realMap) {
    setTimeout(() => realMap.invalidateSize(), 80);
  }

  if (pageKey === "forecast") {
    showForecastOverview();
    renderDailyForecastList(lastDailyForecasts);
  }
}
function detectPageCommand(input) {
  const q = input.toLowerCase().trim();
  const hasNavVerb = ["открой", "перейди", "покажи", "открыть"].some((v) => q.includes(v));

  if ((q.includes("карт") || q.includes("map")) && (hasNavVerb || q === "карта")) {
    return "map";
  }
  if ((q.includes("журнал") || q.includes("улов") || q.includes("запис")) && (hasNavVerb || q.includes("журнал улова"))) {
    return "catch";
  }
  if ((q.includes("прогноз") || q.includes("погод")) && (hasNavVerb || q.includes("прогноз погоды"))) {
    return "forecast";
  }
  if ((q.includes("ассист") || q.includes("чат")) && (hasNavVerb || q.includes("ассистент"))) {
    return "assistant";
  }

  return null;
}
async function onUserMessage(text) {
  if (!text.trim()) return;
  addChat("user", text);

  const dateCommand = detectForecastDateCommand(text);
  if (dateCommand) {
    if (dateCommand.error === "no_data") {
      setTimeout(() => botReply("Сначала обнови погоду, чтобы открыть почасовой прогноз."), 120);
      return;
    }
    setActivePage("forecast");
    openHourlyPage(dateCommand.dateKey);
    const note = dateCommand.fallback ? " Данных на эту дату нет, открыл ближайший доступный день." : "";
    setTimeout(() => botReply(`Открыл почасовой прогноз на ${dateCommand.dateKey}.${note}`), 120);
    return;
  }

  const styleCommand = detectMapStyleCommand(text);
  if (styleCommand) {
    setActivePage("map");
    setMapStyle(styleCommand);
    setTimeout(() => botReply(`Открыл карту: ${mapStyleLabel(styleCommand)}.`), 120);
    return;
  }

  const pageCommand = detectPageCommand(text);
  if (pageCommand) {
    setActivePage(pageCommand);
    const label = pageCommand === "map" ? "Карта" : pageCommand === "catch" ? "Журнал улова" : pageCommand === "forecast" ? "Прогноз погоды" : "Ассистент";
    setTimeout(() => botReply(`Открыл страницу: ${label}.`), 120);
    return;
  }

  const reply = await buildAssistantReply(text);
  setTimeout(() => botReply(reply), 120);
}

sendBtn.addEventListener("click", async () => { await onUserMessage(chatInput.value); chatInput.value = ""; });
chatInput.addEventListener("keydown", async (e) => { if (e.key === "Enter") { await onUserMessage(chatInput.value); chatInput.value = ""; } });
refreshForecastBtn.addEventListener("click", refreshForecast);
runDateForecastBtn?.addEventListener("click", () => openHourlyPage(tripDateInput.value));
tripDateInput?.addEventListener("change", () => { renderDateForecast(tripDateInput.value); showForecastOverview(); });

addCurrentPoiBtn.addEventListener("click", addCurrentPositionPoi);
clearPoiBtn.addEventListener("click", () => { poiList.length = 0; saveJson(STORAGE_POI, poiList); renderPoi(); });

mapWindows.forEach((btn) => {
  btn.addEventListener("click", () => setMapStyle(btn.dataset.style));
});

navMapBtn?.addEventListener("click", () => setActivePage("map"));
navCatchBtn?.addEventListener("click", () => setActivePage("catch"));
navForecastBtn?.addEventListener("click", () => setActivePage("forecast"));
navAssistantBtn?.addEventListener("click", () => setActivePage("assistant"));
backToWeekBtn?.addEventListener("click", showForecastOverview);
aiSaveBtn?.addEventListener("click", saveAiSettingsFromUi);
aiEnabledInput?.addEventListener("change", saveAiSettingsFromUi);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let wakeModeEnabled = false;
let recognitionActive = false;
let pendingWakeCommand = false;
let recognitionBlocked = false;
const WAKE_WORD = "сантьяго";

function updateWakeButtons() {
  if (quickVoiceBtn) {
    quickVoiceBtn.textContent = wakeModeEnabled ? "Слушаю: Сантьяго" : "Голосовая команда";
    quickVoiceBtn.classList.toggle("is-listening", wakeModeEnabled);
  }
  if (micBtn && !recognitionActive) {
    micBtn.textContent = wakeModeEnabled ? "Слушаю: Сантьяго" : "Голос";
    micBtn.classList.toggle("is-listening", wakeModeEnabled);
  }
}

function processWakeTranscript(text) {
  const raw = String(text || "").trim();
  if (!raw) return;

  const normalized = raw.toLowerCase();

  if (!wakeModeEnabled) {
    void onUserMessage(raw);
    return;
  }

  const wakeIndex = normalized.indexOf(WAKE_WORD);
  if (wakeIndex >= 0) {
    const command = raw.slice(wakeIndex + WAKE_WORD.length).trim();
    if (command) {
      pendingWakeCommand = false;
      void onUserMessage(command);
    } else {
      pendingWakeCommand = true;
      botReply("Слушаю. Скажи команду.");
    }
    return;
  }

  if (pendingWakeCommand) {
    pendingWakeCommand = false;
    void onUserMessage(raw);
  }
}

function startWakeMode() {
  if (!recognition) return;
  if (recognitionBlocked) {
    if (voiceHint) voiceHint.textContent = "Доступ к микрофону заблокирован в браузере. Разреши доступ для сайта и обнови страницу.";
    return;
  }
  wakeModeEnabled = true;
  pendingWakeCommand = false;
  updateWakeButtons();
  try {
    recognition.start();
  } catch {
    if (voiceHint) voiceHint.textContent = "Автозапуск микрофона заблокирован браузером. Нажми кнопку Голосовая команда.";
  }
}

function stopWakeMode() {
  wakeModeEnabled = false;
  pendingWakeCommand = false;
  updateWakeButtons();
  try {
    recognition.stop();
  } catch {
    // Already stopped.
  }
}

function toggleWakeMode() {
  if (wakeModeEnabled) {
    stopWakeMode();
    return;
  }
  recognitionBlocked = false;
  startWakeMode();
}

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    recognitionActive = true;
    if (micBtn) {
      micBtn.classList.add("is-listening");
      micBtn.textContent = wakeModeEnabled ? "Слушаю: Сантьяго" : "Остановить";
    }
    if (quickVoiceBtn) {
      quickVoiceBtn.classList.add("is-listening");
      quickVoiceBtn.textContent = wakeModeEnabled ? "Слушаю: Сантьяго" : "Ожидаю команду...";
    }
  };

  recognition.onend = () => {
    recognitionActive = false;
    if (wakeModeEnabled && !recognitionBlocked) {
      setTimeout(() => {
        try {
          recognition.start();
        } catch {
          // Ignore restart errors.
        }
      }, 1200);
      return;
    }
    updateWakeButtons();
  };

  recognition.onerror = (event) => {
    const err = event?.error || "unknown";
    if (err === "not-allowed" || err === "service-not-allowed" || err === "audio-capture") {
      recognitionBlocked = true;
      wakeModeEnabled = false;
      pendingWakeCommand = false;
      updateWakeButtons();
      if (voiceHint) {
        voiceHint.textContent = "Микрофон заблокирован браузером. Для постоянного доступа открой через localhost и разреши микрофон в настройках сайта.";
      }
      return;
    }
    if (voiceHint) voiceHint.textContent = `Ошибка микрофона: ${err}.`;
  };

  recognition.onresult = (event) => {
    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const part = event.results[i];
      if (part.isFinal) finalText += `${part[0].transcript} `;
    }
    processWakeTranscript(finalText);
  };

  micBtn?.addEventListener("click", toggleWakeMode);
  quickVoiceBtn?.addEventListener("click", toggleWakeMode);
} else {
  if (micBtn) micBtn.disabled = true;
  if (quickVoiceBtn) quickVoiceBtn.disabled = true;
  if (voiceHint) voiceHint.textContent = "Голосовой ввод не поддерживается в этом браузере.";
}

async function init() {
  cityInput.value = settings.city || "Batumi";
  apiKeyInput.value = settings.owmApiKey || "";
  if (tripDateInput) {
    tripDateInput.value = dateKeyLocal(new Date());
  }

  initMap();
  startCatchLocationTracking();
  renderPoi();
  renderCatches();
  await loadKnowledgeBase();
  initAiSettingsUi();

  bindPhotoInput(speciesPhotoFileInput, speciesPhotoPreview, (v) => { catchSpeciesPhotoData = v; });
  bindPhotoInput(baitPhotoFileInput, baitPhotoPreview, (v) => { catchBaitPhotoData = v; });

  speciesOpenCameraBtn?.addEventListener("click", () => openCameraPanel(speciesCameraPanel, speciesCameraVideo));
  baitOpenCameraBtn?.addEventListener("click", () => openCameraPanel(baitCameraPanel, baitCameraVideo));
  speciesCaptureBtn?.addEventListener("click", () => captureFromCamera(speciesCameraVideo, speciesCameraPanel, (v) => { catchSpeciesPhotoData = v; }, speciesPhotoPreview));
  baitCaptureBtn?.addEventListener("click", () => captureFromCamera(baitCameraVideo, baitCameraPanel, (v) => { catchBaitPhotoData = v; }, baitPhotoPreview));
  speciesCameraCloseBtn?.addEventListener("click", () => closeCameraPanel(speciesCameraPanel, speciesCameraVideo));
  baitCameraCloseBtn?.addEventListener("click", () => closeCameraPanel(baitCameraPanel, baitCameraVideo));

  if (chatHistory.length) chatHistory.slice(-20).forEach((m) => addChat(m.role, m.text, false));
  else botReply("Готов к тесту. Теперь есть календарь и прогноз клева на выбранную дату.");

  if (lastForecast) renderForecast(lastForecast, "кэш устройства");
  renderDailyForecastList(lastDailyForecasts);
  showForecastOverview();
  updateWakeButtons();
  if (recognition) {
    startWakeMode();
  }
}

window.addEventListener("beforeunload", () => {
  if (catchGpsWatchId != null && navigator.geolocation) {
    navigator.geolocation.clearWatch(catchGpsWatchId);
  }
  stopActivePhotoStream();
});

init();










































































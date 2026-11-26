"use strict";
const $ = (selector) => document.querySelector(selector);
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const params = new URLSearchParams(location.search);
const clampMinutes = (value) =>
  Math.min(120, Math.max(1, Math.trunc(Number(value) || 15)));
const minutes = clampMinutes(params.get("minutes"));
const firstDuration = minutes * 60000;
const duration = 15 * 60000;
const anomalyDuration = 5400;
const period = duration + anomalyDuration;
const key = "chronos.v1." + minutes;
const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};
const safeNumber = (value) => Number.isFinite(value) && value >= 0;
const initial = Date.now();
const restored = read(key);
function validState(state) {
  return (
    state &&
    [state.start, state.joined, state.cycles].every(safeNumber) &&
    Number.isInteger(state.cycles)
  );
}
let state = validState(restored)
  ? restored
  : { start: initial, joined: initial, cycles: 0 };
save(key, state);
window.addEventListener("storage", (event) => {
  if (event.key === key) {
    const update = read(key);
    if (validState(update)) state = update;
  }
});
const name = (params.get("name") || "").slice(0, 60);
const question = (params.get("q") || "").slice(0, 180);
if (name || question) {
  $("#personal").textContent = [
    name && "Для " + name,
    question && "«" + question + "»",
  ]
    .filter(Boolean)
    .join(" · ");
  $("#personal").hidden = false;
}
$("#promise").textContent = minutes;
const unit = (value) =>
  value % 100 >= 11 && value % 100 <= 14
    ? "МИНУТ"
    : { 1: "МИНУТА", 2: "МИНУТЫ", 3: "МИНУТЫ", 4: "МИНУТЫ" }[value % 10] ||
      "МИНУТ";
// After “через”, the singular requires the accusative.
$("#promise").nextSibling.textContent =
  " " + (unit(minutes) === "МИНУТА" ? "МИНУТУ" : unit(minutes));
if (minutes >= 100) $(".hero").classList.add("wide-number");

const statuses = [
  "Намерение прибыть подтверждено.",
  "Моральная подготовка завершена.",
  "Поиск носков завершён.",
  "Ключи обнаружены.",
  "Повторная проверка ключей.",
  "Выход из дома теоретически возможен.",
  "Траектория прибытия рассчитывается.",
  "Обнаружены непредвиденные обстоятельства.",
  "Осталось 15 минут.",
];
const reasons = [
  "Временная аномалия локального масштаба.",
  "Незначительное расхождение с реальностью.",
  "Неожиданная гравитация дивана.",
  "Сложности с материализацией в нужной точке пространства.",
  "Критическая ошибка поиска второго носка.",
  "Обновление личности перед выходом.",
  "Несогласованность биологических и механических часов.",
  "Задержка на этапе принятия решения выйти.",
  "Моя пунктуальность временно недоступна.",
  "Пробки в пространственно-временном континууме.",
  "Технически я уже почти там.",
  "Ключи отказались покидать альтернативную реальность.",
  "Домофон потребовал подтверждения от Совета времени.",
  "Лифт ушёл в геостационарную орбиту.",
  "Маршрут пересчитан через обратную сторону Луны.",
  "Чай пришлось охладить до комнатной эпохи.",
  "Проверка карманов перешла в фазу глубокого сканирования.",
  "Сигнал «пора выходить» застрял у Сатурна.",
  "Дверная ручка потребовала обновления прошивки.",
  "Куртка оказалась в другой системе отсчёта.",
  "Движение ограничено из-за метеоритного дождя из уведомлений.",
  "Микроволновка приостановила локальное время.",
  "Пешеходный переход ожидает выравнивания планет.",
  "Идёт согласование с будущей версией меня.",
  "Будильник отчитался по вчерашним данным.",
  "На выходе обнаружен гравитационный колодец.",
  "Кофе неожиданно перешёл в стадию аккреции.",
  "Вселенная расширилась прямо перед подъездом.",
  "Навигатор выбрал живописный маршрут через туманность.",
  "Подсистема «я уже иду» потеряла связь с обувью.",
  "Через пятнадцать минут будет известна точная версия событий.",
  "Тапочки заблокировали запуск маршевого двигателя.",
  "Ожидается разрешение на взлёт с придиванной площадки.",
  "Текущий момент временно зарезервирован прошлым.",
];
const answers = [
  "Морально — да.",
  "Процесс выхода находится на финальной стадии.",
  "Моё физическое тело догоняет мои намерения.",
  "В одной из параллельных вселенных я уже пришёл.",
  "Не отвлекай меня. Я опаздываю.",
];
const anomalies = [
  "Обнаружена пространственно-временная аномалия.",
  "Пересчитываем время прибытия.",
  "Синхронизируем альтернативные временные линии.",
];
const technologies = [
  [
    "CHRONOS ENGINE",
    "Интеллектуальная система преобразования любого времени ожидания в 15 минут.",
  ],
  [
    "ADAPTIVE ETA",
    "Динамическая корректировка прогноза прибытия без изменения первоначального обещания.",
  ],
  [
    "RELATIVITY PRO",
    "Продвинутая технология замедления субъективного времени.",
  ],
  ["QUANTUM DEPARTURE", "Человек одновременно уже вышел и ещё собирается."],
  ["HOPE MANAGEMENT", "Поддержание уверенности ожидающей стороны."],
  [
    "INFINITE FIFTEEN",
    "Запатентованная технология бесконечных пятнадцатиминутных интервалов.",
  ],
];
const statusRows = statuses.map((status) => {
  const row = document.createElement("li");
  row.textContent = status;
  $("#status-list").append(row);
  return row;
});
const techButtons = technologies.map(([title], index) => {
  const button = document.createElement("button");
  button.textContent = title;
  button.dataset.action = "technology";
  button.dataset.index = index;
  $(".tech-choices").append(button);
  return button;
});
function showTech(index) {
  techButtons.forEach((button, i) =>
    button.setAttribute("aria-pressed", i === index),
  );
  const [title, description] = technologies[index];
  $("#tech-title").textContent = title;
  $("#tech-description").textContent = description;
  $(".core").dataset.tech = index;
  $(".core b").textContent = ["15", "ETA", "Δt", "ψ", "99%", "∞"][index];
}
showTech(0);

const ns = "http://www.w3.org/2000/svg";
function shape(parent, name, attributes) {
  const element = document.createElementNS(ns, name);
  for (const [key, value] of Object.entries(attributes))
    element.setAttribute(key, value);
  parent.append(element);
  return element;
}
const dial = $("#dial");
const defs = shape(dial, "defs", {});
const gradient = shape(defs, "linearGradient", {
  id: "dial-light",
  x1: "8%",
  x2: "92%",
  y1: "98%",
  y2: "2%",
});
for (const [offset, color] of [
  ["0%", "#663d25"],
  ["35%", "#ffc479"],
  ["62%", "#f2a361"],
  ["100%", "#80b9e3"],
])
  shape(gradient, "stop", { offset, "stop-color": color });
const rings = shape(dial, "g", { fill: "none", stroke: "url(#dial-light)" });
for (const [radius, opacity, width, dash] of [
  [320, 0.38, 1, "1 6"],
  [310, 0.55, 1, ""],
  [299, 0.8, 2, ""],
  [290, 0.28, 1, ""],
  [258, 0.76, 1, ""],
  [229, 0.35, 1, ""],
  [207, 0.2, 1, "2 6"],
  [154, 0.15, 1, ""],
])
  shape(rings, "circle", {
    cx: 350,
    cy: 350,
    r: radius,
    opacity,
    "stroke-width": width,
    "stroke-dasharray": dash,
  });
const outer = shape(rings, "g", {});
for (let angle = 0; angle < 360; angle += 3) {
  const major = angle % 15 === 0;
  shape(outer, "path", {
    d: "M350 65v" + (major ? 19 : 8),
    transform: "rotate(" + angle + " 350 350)",
    "stroke-width": major ? 2 : 1,
    opacity: major ? 0.9 : 0.5,
  });
}
const segments = shape(rings, "g", {});
for (const rotation of [12, 99, 184, 268]) {
  shape(segments, "path", {
    d: "M350 26a324 324 0 0 1 125 25",
    transform: "rotate(" + rotation + " 350 350)",
    "stroke-width": 3,
  });
  shape(segments, "path", {
    d: "M350 108a242 242 0 0 1 146 51",
    transform: "rotate(" + rotation + " 350 350)",
    "stroke-width": 1,
    opacity: 0.6,
  });
}
for (let hour = 1; hour <= 12; hour++) {
  const angle = (hour * Math.PI) / 6;
  const number = shape(dial, "text", {
    x: 350 + 245 * Math.sin(angle),
    y: 350 - 245 * Math.cos(angle) + 5,
    fill: "#ffda91",
    "text-anchor": "middle",
    "font-size": 14,
    "font-family": "monospace",
    opacity: 0.8,
  });
  number.textContent = String(hour).padStart(2, "0");
}
const diagram = $(".diagram");
for (const className of [
  "dial-spin orbit-sweep",
  "clock-hand dial-needle",
  "clock-hand dial-needle dial-needle-short",
]) {
  const overlay = document.createElement("i");
  overlay.className = className;
  diagram.append(overlay);
}
shape(rings, "circle", { cx: 350, cy: 350, r: 6, fill: "#ffda91" });
const foreground = $(".foreground");
const frontArc = shape(foreground, "svg", {
  class: "front-arc",
  viewBox: "0 0 700 700",
});
shape(frontArc, "path", {
  d: "M100 535 A300 300 0 0 0 610 500",
  fill: "none",
  stroke: "#ffda91",
  "stroke-width": 1,
  "stroke-opacity": 0.58,
  "stroke-dasharray": "2 9",
});

let noticeTimeout;
function notify(message, time = 4200) {
  const notice = $("#notice");
  clearTimeout(noticeTimeout);
  notice.textContent = message;
  notice.hidden = false;
  noticeTimeout = setTimeout(() => {
    notice.hidden = true;
  }, time);
}
const theme = $("#theme");
let soundEnabled = read("chronos.sound") !== false;
let audioUnlocked = false;
let audioUnavailable = false;
const storedVolume = read("chronos.volume");
if (typeof storedVolume === "number") $("#volume").value = storedVolume;
let fade,
  effect,
  warpUntil = 0;
let audioContext, musicGain, effectGain;
function prepareAudio() {
  if (audioContext) {
    audioContext.resume().catch(() => {});
    return;
  }
  const originalVolume = theme.volume;
  theme.volume = 0.5;
  const supportsMediaVolume = theme.volume === 0.5;
  theme.volume = originalVolume;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (supportsMediaVolume || !AudioEngine) return;
  try {
    audioContext = new AudioEngine();
    musicGain = audioContext.createGain();
    effectGain = audioContext.createGain();
    musicGain.connect(audioContext.destination);
    effectGain.connect(audioContext.destination);
    effect = new Audio();
    audioContext.createMediaElementSource(effect).connect(effectGain);
    audioContext.createMediaElementSource(theme).connect(musicGain);
    audioContext.resume().catch(() => {});
  } catch {
    musicGain = effectGain = null;
  }
}
function setMusicVolume(value) {
  if (musicGain) musicGain.gain.value = value;
  else theme.volume = value;
}
function setEffectVolume(value) {
  if (effectGain) effectGain.gain.value = value;
  else if (effect) effect.volume = value;
}
function soundLabel() {
  const active = soundEnabled && audioUnlocked && !audioUnavailable;
  $("[data-action=sound]").setAttribute("aria-pressed", active);
  $("#sound-label").textContent = audioUnavailable
    ? "Звук недоступен"
    : active
      ? "Звук вкл."
      : "Звук выкл.";
}
function syncAudio() {
  cancelAnimationFrame(fade);
  const target =
    soundEnabled &&
    audioUnlocked &&
    !audioUnavailable &&
    !document.hidden &&
    anomalyPhase < 0
      ? Number($("#volume").value)
      : 0;
  if (target && theme.paused) {
    setMusicVolume(0);
    theme.play().catch(() => {
      if (theme.error) audioUnavailable = true;
      else audioUnlocked = false;
      soundLabel();
    });
  }
  if (document.hidden) {
    theme.pause();
    effect?.pause();
    return;
  }
  if (theme.paused) return;
  const from = musicGain ? musicGain.gain.value : theme.volume;
  const start = performance.now();
  function ramp(now) {
    const progress = Math.max(0, Math.min(1, (now - start) / 360));
    setMusicVolume(from + (target - from) * progress);
    if (progress < 1) fade = requestAnimationFrame(ramp);
    else if (!target) theme.pause();
  }
  fade = requestAnimationFrame(ramp);
}
function sfx(kind) {
  if (!soundEnabled || !audioUnlocked || document.hidden) return;
  if (!effect) effect = new Audio();
  effect.pause();
  effect.src = "./assets/sfx/" + kind + ".wav";
  setEffectVolume(Number($("#volume").value) * 0.7);
  effect.play().catch(() => {});
}
theme.addEventListener("error", () => {
  audioUnavailable = true;
  soundLabel();
});
$("#volume").addEventListener("input", (event) => {
  save("chronos.volume", Number(event.target.value));
  setEffectVolume(Number(event.target.value) * 0.7);
  syncAudio();
});
function unlock(event) {
  if (
    !event.isTrusted ||
    event.target.closest("[data-action=sound]") ||
    audioUnlocked
  )
    return;
  audioUnlocked = true;
  prepareAudio();
  syncAudio();
  soundLabel();
}
document.addEventListener("click", unlock, true);

let anomalyPhase = -1;
let shownCycle = state.cycles;
let statusIndex = -1;
let awards = Number(read(key + ".awards")) || 0;
const timer = $("#timer");
const cycleDisplay = $("#cycle");
const missionMap = $(".map");
const finale = $(".finale");
let tickHandle;
function tick() {
  const now = Date.now();
  let elapsed = Math.max(0, now - state.start);
  if (state.cycles === 0 && elapsed >= firstDuration + anomalyDuration) {
    state.start += firstDuration + anomalyDuration;
    state.cycles++;
    elapsed = now - state.start;
    save(key, state);
  }
  const completed = state.cycles ? Math.floor(elapsed / period) : 0;
  if (completed) {
    state.start += completed * period;
    state.cycles += completed;
    save(key, state);
  }
  const position = Math.max(0, now - state.start);
  const currentDuration = state.cycles ? duration : firstDuration;
  const seconds = Math.ceil(Math.max(0, currentDuration - position) / 1000);
  const phase =
    position >= currentDuration
      ? Math.min(2, Math.floor((position - currentDuration) / 1800))
      : -1;
  const formatted =
    String(Math.floor(seconds / 60)).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0");
  if (timer.textContent !== formatted) {
    timer.textContent = formatted;
    timer.setAttribute("aria-label", "Таймер ожидания, " + formatted);
  }
  const cycleLabel = String(state.cycles + 1).padStart(2, "0");
  if (cycleDisplay.textContent !== cycleLabel)
    cycleDisplay.textContent = cycleLabel;
  if (!document.hidden) {
    if (anomalyPhase !== phase) {
      anomalyPhase = phase;
      timer.parentElement.dataset.phase = phase;
      if (phase >= 0) {
        notify(anomalies[phase], 1900);
        sfx(phase === 0 ? "recalculate" : "signal");
      }
      syncAudio();
    }
    if (shownCycle !== state.cycles) {
      shownCycle = state.cycles;
      notify(
        "Хорошие новости. Осталось всего 15 минут. " +
          reasons[(state.cycles - 1) % reasons.length],
        7200,
      );
    }
    const earned = Math.min(
      2,
      Math.floor(Math.max(0, now - state.joined) / 3600000),
    );
    if (earned > awards) {
      awards++;
      save(key + ".awards", awards);
      sfx("signal");
      notify(
        awards === 1
          ? "Награда · Почётный путешественник во времени"
          : "Достижение · Терпение легендарного уровня",
        7500,
      );
    }
  }
  const warpActive = phase >= 0 || now < warpUntil;
  if (document.body.classList.contains("warp") !== warpActive) {
    document.body.classList.toggle("warp", warpActive);
    forcePaint = true;
    scheduleFrames();
  }
  document.body.classList.toggle("anomaly", phase >= 0);
  const nextStatus = Math.floor(position / 6300) % statuses.length;
  if (statusIndex !== nextStatus) {
    statusIndex = nextStatus;
    missionMap.dataset.signal = nextStatus % 2;
    statusRows.forEach((row, index) =>
      row.classList.toggle("active", index === nextStatus),
    );
    $("#hero-status").textContent =
      nextStatus === 0 ? "Прибытие неизбежно" : statuses[nextStatus];
  }
}
function emergency() {
  const elapsed = Math.max(0, Date.now() - state.start);
  const currentDuration = state.cycles ? duration : firstDuration;
  state.start -= currentDuration - Math.min(elapsed, currentDuration);
  save(key, state);
  tick();
}

const modal = $("#modal");
const film = $("#film");
const filmText = $("#film-text");
const filmSurface = $(".film-surface");
const shots = [
  [0, "Человечество тысячелетиями пыталось понять время."],
  [3, "Мы научились измерять секунды."],
  [6, "Мы научились предсказывать будущее."],
  [8.5, "Но некоторые загадки остались нерешёнными."],
  [11.5, "Например, когда я приду."],
  [14, "15 МИНУТ."],
  [17, "Для вас прошло 40 минут."],
  [19.5, "Для меня — практически ничего."],
  [22, "Это не опоздание. Это разница систем отсчёта."],
  [25, "Сквозь пространство. Сквозь время."],
  [28, "Сквозь непредвиденные обстоятельства."],
  [30.5, "Я обязательно появлюсь."],
  [33, "ЧЕРЕЗ 15 МИНУТ."],
];
let filmStart, filmTimer, filmIndex;
const filmProgress = $("progress");
function progressFilm() {
  const elapsed = (Date.now() - filmStart) / 1000;
  if (elapsed >= 36) {
    film.close();
    return;
  }
  filmProgress.value = elapsed;
  let index = shots.length - 1;
  while (elapsed < shots[index][0]) index--;
  if (filmIndex !== index) {
    filmIndex = index;
    filmSurface.dataset.sequence =
      index === 12
        ? "arrival"
        : index >= 9
          ? "tunnel"
          : index >= 6
            ? "relativity"
            : index === 5
              ? "ignition"
              : "prologue";
    filmSurface.classList.toggle("title-shot", index === 5 || index === 12);
    filmText.textContent = shots[index][1];
    filmSurface.style.setProperty(
      "--film-light",
      index === 5 || index === 12 ? 0.8 : 0,
    );
    filmText.classList.remove("reveal");
    void filmText.offsetWidth;
    filmText.classList.add("reveal");
    if (index === 0) sfx("tick");
    if (index === 5 || index === 12) sfx("impact");
    if (index === 9) sfx("transition");
  }
}
function showFilm() {
  filmStart = Date.now();
  filmIndex = -1;
  film.showModal();
  document.body.classList.add("film-open");
  if (audioUnlocked && soundEnabled && theme.readyState) theme.currentTime = 0;
  progressFilm();
  filmTimer = setInterval(progressFilm, 100);
}
film.addEventListener("close", () => {
  clearInterval(filmTimer);
  document.body.classList.remove("film-open");
  forcePaint = true;
  scheduleFrames();
  updateScrollMotion();
});
function openTemplate(id) {
  $("#modal-body").replaceChildren(
    $("#" + id + "-template").content.cloneNode(true),
  );
  modal.showModal();
}
function shareUrl() {
  const form = $("#link-form");
  const url = new URL(location.href);
  url.hash = "";
  url.search = "";
  const data = new FormData(form);
  for (const key of ["q", "name"]) {
    const value = data.get(key).trim();
    if (value) url.searchParams.set(key, value);
  }
  url.searchParams.set("minutes", clampMinutes(data.get("minutes")));
  $("#share-url").value = url.href;
  return url.href;
}
function showShare() {
  openTemplate("share");
  const form = $("#link-form");
  form.elements.q.value = question;
  form.elements.name.value = name;
  form.elements.minutes.value = minutes;
  form.addEventListener("input", shareUrl);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    copyLink();
  });
  shareUrl();
}
function shareFeedback(message) {
  let output = $("#link-feedback");
  if (!output) {
    output = document.createElement("p");
    output.id = "link-feedback";
    output.setAttribute("role", "status");
    $("#link-form").append(output);
  }
  output.textContent = message;
}
async function copyLink() {
  const value = shareUrl();
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    $("#share-url").select();
    if (!document.execCommand("copy")) {
      shareFeedback("Ссылка выделена для копирования.");
      return;
    }
  }
  shareFeedback("Ссылка скопирована.");
}
let lastExcuse = -1;
let checks = 0,
  timerHits = 0;
const actions = {
  sound() {
    soundEnabled = audioUnlocked ? !soundEnabled : true;
    audioUnlocked = true;
    save("chronos.sound", soundEnabled);
    if (soundEnabled) prepareAudio();
    else effect?.pause();
    syncAudio();
    soundLabel();
  },
  check() {
    checks++;
    if (checks % 6 === 0) emergency();
    else {
      notify(answers[(checks - 1) % 6]);
      sfx("signal");
    }
  },
  timer() {
    timerHits++;
    if (timerHits % 7 === 0) {
      document.body.classList.toggle("ultra");
      notify(
        document.body.classList.contains("ultra")
          ? "15 минут. Ultra Relativity Edition"
          : "CHRONOS ENGINE 3.0",
      );
      sfx("transition");
    }
  },
  film: showFilm,
  skip() {
    film.close();
  },
  technology(button) {
    showTech(Number(button.dataset.index));
    sfx("signal");
  },
  where() {
    openTemplate("universe");
    sfx("signal");
  },
  taxi() {
    openTemplate("taxi");
    sfx("hyperdrive");
  },
  boost() {
    warpUntil = Date.now() + 2800;
    tick();
    sfx("hyperdrive");
    notify("Гипердвигатель активирован. Время прибытия осталось прежним.");
  },
  excuse(button) {
    const result = $("#excuse");
    button.disabled = true;
    result.textContent = "Сверяем показания атомных часов…";
    result.classList.add("calculating");
    sfx("recalculate");
    setTimeout(
      () => {
        const pick = Math.floor(
          Math.random() * (reasons.length - Number(lastExcuse >= 0)),
        );
        lastExcuse = lastExcuse >= 0 && pick >= lastExcuse ? pick + 1 : pick;
        result.textContent = reasons[lastExcuse];
        result.classList.remove("calculating");
        button.disabled = false;
      },
      reduced.matches ? 100 : 820,
    );
  },
  estimate() {
    notify("Расчёт завершён. Через " + (state.cycles ? 15 : minutes) + " мин.");
    sfx("signal");
  },
  share: showShare,
  copy: copyLink,
  async "native-share"() {
    const url = shareUrl();
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title: document.title, url });
    } catch (error) {
      if (error.name !== "AbortError") await copyLink();
    }
  },
};
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (target && Object.hasOwn(actions, target.dataset.action))
    actions[target.dataset.action](target);
  const waiting = event.target.closest('a[href="#waiting"]');
  if (waiting) {
    $(".telemetry").classList.add("waiting-active");
    $("#waiting").focus({ preventScroll: true });
    notify("Режим ожидания активен.");
  }
});
function continuum(event) {
  event.preventDefault();
  notify("Нарушение пространственно-временного континуума");
  sfx("impact");
}
timer.addEventListener("keydown", (event) => {
  if (
    ["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(
      event.key,
    )
  )
    continuum(event);
});
let origin;
timer.addEventListener("pointerdown", (event) => {
  origin = [event.clientX, event.clientY];
});
timer.addEventListener("pointerup", (event) => {
  if (
    origin &&
    Math.hypot(event.clientX - origin[0], event.clientY - origin[1]) > 14
  )
    continuum(event);
  origin = null;
});
timer.addEventListener("dragstart", continuum);
timer.addEventListener("pointercancel", () => {
  origin = null;
});

const hero = $(".hero");
const finePointer = matchMedia("(pointer:fine)");
hero.addEventListener("pointermove", (event) => {
  if (reduced.matches || !finePointer.matches) return;
  const bounds = hero.getBoundingClientRect();
  hero.style.setProperty(
    "--px",
    (event.clientX / bounds.width - 0.5) * 15 + "px",
  );
  hero.style.setProperty(
    "--py",
    ((event.clientY - bounds.top) / bounds.height - 0.5) * 10 + "px",
  );
});
document.addEventListener(
  "pointermove",
  (event) => {
    const button = event.target.closest(".actions button,.actions a");
    if (
      !button ||
      reduced.matches ||
      !finePointer.matches ||
      (event.movementX === 0 && event.movementY === 0)
    )
      return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty(
      "--mx",
      (event.clientX - rect.left - rect.width / 2) * 0.055 + "px",
    );
    button.style.setProperty(
      "--my",
      (event.clientY - rect.top - rect.height / 2) * 0.12 + "px",
    );
  },
  { passive: true },
);
document.querySelectorAll(".actions button,.actions a").forEach((button) =>
  button.addEventListener("pointerleave", () => {
    button.style.removeProperty("--mx");
    button.style.removeProperty("--my");
  }),
);
hero.addEventListener("pointerleave", () => {
  hero.style.removeProperty("--px");
  hero.style.removeProperty("--py");
});
const motionSections = [hero, $(".story"), $(".relativity"), finale];
const visibleMotion = new Set();
let scrollFrame = 0;
function updateScrollMotion() {
  if (
    scrollFrame ||
    document.hidden ||
    reduced.matches ||
    film.open ||
    !visibleMotion.size
  )
    return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    if (document.hidden || reduced.matches || film.open) return;
    const height = innerHeight;
    for (const section of visibleMotion) {
      const box = section.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (height - box.top) / (height + box.height)),
      );
      section.style.setProperty("--scene-progress", progress.toFixed(3));
    }
  });
}
window.addEventListener("scroll", updateScrollMotion, { passive: true });
window.addEventListener("resize", updateScrollMotion, { passive: true });
const fragments = $(".timer-fragments");
for (let index = 0; index < 18; index++) {
  const fragment = document.createElement("i");
  const angle = index * 2.39996;
  fragment.style.setProperty(
    "--dx",
    Math.round(Math.cos(angle) * (23 + index * 2.5)) + "px",
  );
  fragment.style.setProperty(
    "--dy",
    Math.round(Math.sin(angle) * (13 + index)) + "px",
  );
  fragment.style.setProperty("--delay", index * 19 + "ms");
  fragments.append(fragment);
}

const weak =
  (navigator.hardwareConcurrency || 8) <= 4 ||
  (navigator.deviceMemory || 8) <= 4 ||
  matchMedia("(max-width: 600px)").matches;
const particles = Array.from({ length: weak ? 62 : 160 }, () => ({
  x: Math.random(),
  y: Math.random(),
  depth: Math.random(),
  phase: Math.random() * 6.283,
}));
const surfaces = [$("#stars"), $("#tunnel"), $("#film-stars")].map(
  (canvas, index) => ({
    canvas,
    context: canvas.getContext("2d", { alpha: true }),
    tunnel: index > 0,
    visible: false,
  }),
);
let frame = 0,
  lastPaint = -Infinity,
  forcePaint = true;
function draw(surface, time) {
  const { canvas, context: ctx, tunnel } = surface;
  if (!ctx) return;
  const width = canvas.clientWidth,
    height = canvas.clientHeight;
  const dpr = 1;
  const w = Math.round(width * dpr),
    h = Math.round(height * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const warp = document.body.classList.contains("warp");
  const progress =
    Number(finale.style.getPropertyValue("--scene-progress")) || 0;
  const speed =
    canvas.id === "tunnel"
      ? 0.4 + Math.sin(progress * Math.PI) * 1.4
      : filmSurface.dataset.sequence === "arrival"
        ? 0.35
        : 1.5;
  if (surface.lastFrame !== undefined) {
    surface.travel =
      (surface.travel || 0) + Math.min(70, time - surface.lastFrame) * speed;
  }
  surface.lastFrame = time;
  const motion =
    reduced.matches || (!tunnel && !warp)
      ? 0
      : warp
        ? time
        : surface.travel || 0;
  const shatter = warp && !tunnel && !reduced.matches && anomalyPhase >= 0;
  for (const star of particles) {
    const size = 0.5 + star.depth * 1.35;
    const radius = (star.depth + motion / (warp ? 700 : 4200)) % 1;
    const angle = star.phase + motion * 0.00008;
    const scale = Math.max(width, height) * 0.79;
    const dx = Math.cos(angle) * radius * scale,
      dy = Math.sin(angle) * radius * scale;
    const x = tunnel || warp ? width * 0.5 + dx : star.x * width;
    const y =
      tunnel || warp
        ? height * 0.47 + dy
        : (star.y * height + motion * 0.007) % height;
    ctx.globalAlpha = 0.19 + star.depth * 0.64;
    ctx.fillStyle = ctx.strokeStyle = star.depth > 0.53 ? "#ffcb85" : "#8ec9f0";
    if ((tunnel || warp) && !reduced.matches) {
      const trail = warp ? 0.19 : 0.065;
      ctx.beginPath();
      ctx.moveTo(x - dx * trail, y - dy * trail);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else ctx.fillRect(x, y, size, size);
  }
  if (shatter) {
    const bounds = timer.getBoundingClientRect();
    const canvasBounds = canvas.getBoundingClientRect();
    const left = bounds.left - canvasBounds.left,
      top = bounds.top - canvasBounds.top;
    for (let index = 0; index < Math.min(70, particles.length); index++) {
      const star = particles[index],
        progress = (motion / 1100 + star.depth * 0.45) % 1;
      ctx.globalAlpha = (1 - progress) * 0.9;
      ctx.fillStyle = index % 4 ? "#ffda91" : "#77b8e8";
      ctx.fillRect(
        left + bounds.width * star.x + Math.cos(star.phase) * progress * 80,
        top + bounds.height * star.y + Math.sin(star.phase) * progress * 46,
        1.7,
        1.7,
      );
    }
  }
  ctx.globalAlpha = 1;
}
const mapAnimation = $(".map svg");
let mapVisible = false;
function syncMap() {
  if (document.hidden || reduced.matches || !mapVisible)
    mapAnimation.pauseAnimations?.();
  else mapAnimation.unpauseAnimations?.();
}
function activeSurface(surface) {
  return (
    surface.visible &&
    (film.open
      ? surface.canvas.id === "film-stars"
      : surface.canvas.id !== "film-stars")
  );
}
function scheduleFrames() {
  if (frame || document.hidden || !surfaces.some(activeSurface)) return;
  frame = requestAnimationFrame(function render(time) {
    frame = 0;
    if (document.hidden) return;
    const warp = document.body.classList.contains("warp");
    const interval = weak ? 1000 / 30 : 1000 / 45;
    if (forcePaint || time - lastPaint >= interval - 2) {
      lastPaint = time;
      const available = surfaces.filter(activeSurface);
      const surface = available.find((item) => item.tunnel) || available[0];
      if (surface && (forcePaint || surface.tunnel || warp || surface.warped)) {
        draw(surface, time);
        surface.warped = warp;
      }
      forcePaint = false;
    }
    if (
      !reduced.matches &&
      (warp ||
        surfaces.some((surface) => surface.tunnel && activeSurface(surface)))
    )
      scheduleFrames();
  });
}
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const surface = surfaces.find((item) => item.canvas === entry.target);
    if (surface) surface.visible = entry.isIntersecting;
    else if (entry.target === mapAnimation) {
      mapVisible = entry.isIntersecting;
      syncMap();
    } else {
      entry.target.classList.toggle("paused", !entry.isIntersecting);
      if (entry.isIntersecting) entry.target.classList.add("entered");
      if (motionSections.includes(entry.target)) {
        if (entry.isIntersecting) visibleMotion.add(entry.target);
        else visibleMotion.delete(entry.target);
      }
    }
  }
  forcePaint = true;
  scheduleFrames();
  updateScrollMotion();
});
surfaces.forEach((surface) => observer.observe(surface.canvas));
document
  .querySelectorAll(".hero,.act")
  .forEach((section) => observer.observe(section));
observer.observe(mapAnimation);
syncMap();
window.addEventListener(
  "resize",
  () => {
    forcePaint = true;
    scheduleFrames();
  },
  { passive: true },
);
reduced.addEventListener("change", () => {
  forcePaint = true;
  scheduleFrames();
  syncMap();
});
document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("backgrounded", document.hidden);
  if (document.hidden) {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    cancelAnimationFrame(frame);
    frame = 0;
    clearInterval(tickHandle);
    clearInterval(filmTimer);
  } else {
    tick();
    tickHandle = setInterval(tick, 200);
    if (film.open) {
      progressFilm();
      if (film.open) filmTimer = setInterval(progressFilm, 100);
    }
    scheduleFrames();
    updateScrollMotion();
  }
  syncAudio();
  syncMap();
});
soundLabel();
tick();
tickHandle = setInterval(tick, 200);

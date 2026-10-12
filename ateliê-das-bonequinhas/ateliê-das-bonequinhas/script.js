const NAMES = [
  "Aurora", "Bia", "Cecília", "Duda", "Eloá", "Fênix",
  "Gabi", "Helena", "Isis", "Júlia", "Kiara", "Lara",
  "Mel", "Nina", "Olívia", "Pietra", "Quitéria", "Rafa",
  "Sofia", "Tati", "Ursula", "Vivi", "Wanda", "Xuxa",
  "Yasmin", "Zoe", "Alice", "Bruna", "Clara", "Dani",
  "Emília", "Flora"
];

const SKINS = ["#ffe0c8", "#f6c9a5", "#e3a977", "#c68656", "#9a6140", "#fbd3d0"];
const HAIRS = ["#3a2418", "#7a4a28", "#d9a441", "#f2d27a", "#222222", "#c94a6b", "#6b5bd6", "#38a8a0", "#e8e8f0", "#ff8a5b"];
const EYES = ["#3b2a4a", "#2f7ad1", "#2e9a5d", "#8a5a2b", "#a24bd1"];

const PAL = [
  ["#ff6fa5", "#ffd1e3"],
  ["#7c5cff", "#d9d0ff"],
  ["#35b6a4", "#c8f2ea"],
  ["#ffb23f", "#fff0c9"],
  ["#4aa3ff", "#d4eaff"],
  ["#ef5350", "#ffd6d4"],
  ["#8bc34a", "#e6f5c9"],
  ["#ab47bc", "#f1d4f6"]
];

const OUTS = [
  "Vestido", "Saia e blusa", "Macacão", "Moletom",
  "Princesa", "Marinheira", "Pijama", "Quimono"
];

const ACCS = ["Nenhum", "Laço", "Coroa", "Orelhas de gato", "Óculos"];
const HSTY = ["Longo", "Maria-chiquinha", "Coque", "Chanel", "Rabo de cavalo", "Curto"];
const $ = id => document.getElementById(id);

// Todas começam com a mesma roupa e o mesmo acessório.
// Pele, cabelo, olhos e penteado variam entre as personagens.
const defaults = NAMES.map((name, i) => ({
  name,
  skin: SKINS[i % SKINS.length],
  hair: HAIRS[(i * 3) % HAIRS.length],
  eye: EYES[i % EYES.length],
  hs: i % HSTY.length,
  out: 0,
  col: 0,
  acc: 0
}));

let chars = defaults.map(c => ({ ...c }));
let cur = 0;
let score = 0;
let goal = null;
let category = "Todas";
let etapa = "personagens";
let toastTimer;

function belongsToCategory(name) {
  const first = name.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .charAt(0).toUpperCase();

  const groups = {
    "A-E": ["A", "B", "C", "D", "E"],
    "F-J": ["F", "G", "H", "I", "J"],
    "K-O": ["K", "L", "M", "N", "O"],
    "P-T": ["P", "Q", "R", "S", "T"],
    "U-Z": ["U", "V", "W", "X", "Y", "Z"]
  };

  return category === "Todas" || groups[category]?.includes(first);
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    category = button.dataset.category;

    document.querySelectorAll(".category").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    filterCharacters();
  });
});

function draw(c) {
  const [outColor, detail] = PAL[c.col];
  const skin = c.skin;
  const hair = c.hair;

  let hairstyle = "";
  let outfit = "";
  let accessory = "";

  switch (c.hs) {
    case 0:
      hairstyle = `<path d="M24 52 Q10 90 27 125 L93 125 Q110 90 96 52Z" fill="${hair}"/>`;
      break;
    case 1:
      hairstyle = `<circle cx="23" cy="77" r="17" fill="${hair}"/><circle cx="97" cy="77" r="17" fill="${hair}"/>`;
      break;
    case 2:
      hairstyle = `<circle cx="60" cy="25" r="18" fill="${hair}"/>`;
      break;
    case 3:
      hairstyle = `<path d="M25 48 Q20 85 35 100 L85 100 Q100 85 95 48Z" fill="${hair}"/>`;
      break;
    case 4:
      hairstyle = `<ellipse cx="101" cy="80" rx="13" ry="29" fill="${hair}" transform="rotate(-18 101 80)"/>`;
      break;
    case 5:
      hairstyle = `<path d="M25 55 Q22 22 60 22 Q98 22 95 55 L89 76 L31 76Z" fill="${hair}"/>`;
      break;
  }

  switch (c.out) {
    case 0:
      outfit = `<path d="M44 94 H76 L94 137 H26Z" fill="${outColor}"/><path d="M44 105 H76" stroke="${detail}" stroke-width="6"/>`;
      break;
    case 1:
      outfit = `<rect x="42" y="94" width="36" height="20" rx="5" fill="${detail}"/><path d="M42 113 H78 L88 135 H32Z" fill="${outColor}"/>`;
      break;
    case 2:
      outfit = `<path d="M43 94 H77 L81 135 H39Z" fill="${outColor}"/><path d="M46 95 V115 M74 95 V115" stroke="${detail}" stroke-width="5"/><path d="M39 116 H81" stroke="${detail}" stroke-width="3"/>`;
      break;
    case 3:
      outfit = `<rect x="40" y="93" width="40" height="42" rx="10" fill="${outColor}"/><path d="M48 116 H72" stroke="${detail}" stroke-width="5"/><path d="M32 100 H42 M78 100 H88" stroke="${outColor}" stroke-width="9" stroke-linecap="round"/>`;
      break;
    case 4:
      outfit = `<path d="M46 94 H74 L106 138 H14Z" fill="${outColor}"/><path d="M46 94 H74 L70 109 H50Z" fill="${detail}"/><circle cx="60" cy="119" r="4" fill="${detail}"/>`;
      break;
    case 5:
      outfit = `<rect x="43" y="94" width="34" height="22" rx="5" fill="#fff"/><path d="M48 94 L60 108 L72 94Z" fill="${detail}"/><path d="M42 115 H78 L88 135 H32Z" fill="${outColor}"/><path d="M42 117 H78" stroke="${detail}" stroke-width="3"/>`;
      break;
    case 6:
      outfit = `<rect x="40" y="92" width="40" height="43" rx="10" fill="${detail}"/><path d="M32 100 H43 M77 100 H88" stroke="${detail}" stroke-width="8" stroke-linecap="round"/><path d="M53 104 L60 112 L67 104" fill="none" stroke="${outColor}" stroke-width="3"/>`;
      break;
    case 7:
      outfit = `<path d="M42 94 H78 L85 136 H35Z" fill="${outColor}"/><path d="M42 109 H78" stroke="${detail}" stroke-width="7"/><path d="M56 94 L60 108 L64 94" fill="#fff"/>`;
      break;
  }

  switch (c.acc) {
    case 1:
      accessory = `<path d="M77 28 L59 15 L60 35Z M77 28 L96 15 L94 35Z" fill="${detail}" stroke="${outColor}" stroke-width="2"/><circle cx="77" cy="28" r="4" fill="${outColor}"/>`;
      break;
    case 2:
      accessory = `<path d="M39 27 L43 10 L52 20 L60 7 L68 20 L77 10 L81 27Z" fill="#ffcc42" stroke="#e09a00" stroke-width="2"/>`;
      break;
    case 3:
      accessory = `<path d="M28 40 L30 7 L53 29Z M92 40 L90 7 L67 29Z" fill="${hair}" stroke="${hair}" stroke-width="3"/><path d="M33 28 L34 15 L45 25Z M87 28 L86 15 L75 25Z" fill="#ffb7cf"/>`;
      break;
    case 4:
      accessory = `<circle cx="46" cy="64" r="12" fill="none" stroke="#3b2a4a" stroke-width="3"/><circle cx="74" cy="64" r="12" fill="none" stroke="#3b2a4a" stroke-width="3"/><path d="M58 64 H62" stroke="#3b2a4a" stroke-width="3"/>`;
      break;
  }

  const face = `
    <ellipse cx="46" cy="64" rx="6" ry="8" fill="${c.eye}"/>
    <ellipse cx="74" cy="64" rx="6" ry="8" fill="${c.eye}"/>
    <circle cx="46" cy="64" r="3" fill="#111"/>
    <circle cx="74" cy="64" r="3" fill="#111"/>
    <circle cx="48" cy="61" r="2" fill="#fff"/>
    <circle cx="76" cy="61" r="2" fill="#fff"/>
    <circle cx="36" cy="76" r="5" fill="#ff8fb0" opacity=".6"/>
    <circle cx="84" cy="76" r="5" fill="#ff8fb0" opacity=".6"/>
    <path d="M55 78 Q60 83 65 78" stroke="#b5475f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  `;

  return `
    <svg viewBox="0 0 120 156" role="img" aria-label="${c.name}">
      ${hairstyle}
      <rect x="46" y="124" width="10" height="22" rx="4" fill="${skin}"/>
      <rect x="64" y="124" width="10" height="22" rx="4" fill="${skin}"/>
      <ellipse cx="50" cy="148" rx="9" ry="5" fill="#5a3b66"/>
      <ellipse cx="70" cy="148" rx="9" ry="5" fill="#5a3b66"/>
      <rect x="34" y="96" width="9" height="24" rx="4.5" fill="${skin}"/>
      <rect x="77" y="96" width="9" height="24" rx="4.5" fill="${skin}"/>
      <rect x="53" y="86" width="14" height="12" fill="${skin}"/>
      ${outfit}
      <circle cx="60" cy="58" r="35" fill="${skin}"/>
      <path d="M25 56 Q26 18 60 18 Q94 18 95 56 Q82 38 60 40 Q38 38 25 56Z" fill="${hair}"/>
      ${face}
      ${accessory}
    </svg>
  `;
}

function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("on"), 2000);
}

function buildGrid() {
  const grid = $("grid");
  grid.innerHTML = "";

  chars.forEach((character, index) => {
    const button = document.createElement("button");
    button.className = "card";
    button.type = "button";
    button.dataset.index = index;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      cur = index;
      etapa = "personalizacao";
      goal = null;
      $("mis").textContent = "Agora escolha a roupa e o acessório!";
      render();

      if (window.innerWidth <= 1000) {
        $("personalizacao").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    grid.appendChild(button);
  });
}

function createChips(element, list, key, callback) {
  element.innerHTML = "";

  list.forEach((label, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(chars[cur][key] === index));
    button.addEventListener("click", () => callback(index));
    element.appendChild(button);
  });
}

function render() {
  const character = chars[cur];

  document.querySelectorAll(".card").forEach(button => {
    const index = Number(button.dataset.index);
    const item = chars[index];

    button.innerHTML = `${draw(item)}<span class="card-name">${item.name}</span>`;
    button.setAttribute("aria-pressed", String(index === cur));
  });

  $("big").innerHTML = draw(character);
  $("nm").textContent = character.name;
  $("customization").hidden = etapa !== "personalizacao";

  if (etapa === "personagens") {
    $("mis").textContent = "Escolha uma personagem para começar!";
  }

  createChips($("outs"), OUTS, "out", index => {
    character.out = index;
    render();
    checkChallenge();
  });

  createChips($("accs"), ACCS, "acc", index => {
    character.acc = index;
    render();
  });

  createChips($("hairs"), HSTY, "hs", index => {
    character.hs = index;
    render();
  });

  $("outfitSelected").textContent = `Roupa selecionada: ${OUTS[character.out]}`;
  $("accessorySelected").textContent = `Acessório selecionado: ${ACCS[character.acc]}`;

  $("cols").innerHTML = "";
  PAL.forEach((palette, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sw";
    button.style.backgroundColor = palette[0];
    button.setAttribute("aria-label", `Cor ${index + 1}`);
    button.setAttribute("aria-pressed", String(character.col === index));

    button.addEventListener("click", () => {
      character.col = index;
      render();
    });

    $("cols").appendChild(button);
  });

  filterCharacters();
}

function filterCharacters() {
  const query = $("search").value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;

  document.querySelectorAll(".card").forEach(button => {
    const character = chars[Number(button.dataset.index)];
    const matchesName = character.name.toLocaleLowerCase("pt-BR").includes(query);
    const matches = matchesName && belongsToCategory(character.name);

    button.hidden = !matches;
    if (matches) visible++;
  });

  $("empty").hidden = visible !== 0;
  $("counter").textContent =
    query || category !== "Todas"
      ? `${visible} de ${chars.length} personagens`
      : `${chars.length} personagens`;
}

function checkChallenge() {
  if (goal === null || chars[cur].out !== goal) return;

  score++;
  $("stars").textContent = `⭐ ${score}`;
  goal = null;
  $("mis").textContent = "Desafio cumprido! Você arrasou! 💖";
  toast("Arrasou! +1 estrela ⭐");
}

$("search").addEventListener("input", filterCharacters);

$("chal").addEventListener("click", () => {
  cur = Math.floor(Math.random() * chars.length);
  etapa = "personalizacao";
  goal = Math.floor(Math.random() * OUTS.length);

  if (chars[cur].out === goal) {
    chars[cur].out = (goal + 1) % OUTS.length;
  }

  $("mis").textContent = `Desafio: vista a ${chars[cur].name} de ${OUTS[goal]}!`;
  render();
  toast("Novo desafio lançado! ✨");

  if (window.innerWidth <= 1000) {
    $("personalizacao").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

$("reset").addEventListener("click", () => {
  chars[cur] = { ...defaults[cur] };
  goal = null;
  $("mis").textContent = "Visual reiniciado! Crie outro look 💗";
  render();
  toast("Look reiniciado!");
});

$("next").addEventListener("click", () => {
  cur = (cur + 1) % chars.length;
  etapa = "personalizacao";
  goal = null;
  $("mis").textContent = "Escolha roupas e crie seu próprio estilo!";
  render();

  if (window.innerWidth <= 1000) {
    $("personalizacao").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

buildGrid();
render();
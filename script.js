// ---------- CONFIG ----------

const rarities = [
  { name: "Common", weight: 40, multiplier: 1 },
  { name: "Uncommon", weight: 25, multiplier: 1.2 },
  { name: "Rare", weight: 18, multiplier: 1.5 },
  { name: "Epic", weight: 12, multiplier: 2 },
  { name: "Legendary", weight: 5, multiplier: 3 }
];

const gearTypes = [
  {
    name: "Sword",
    stats: {
      damage: [5, 12],
      crit: [1, 5]
    }
  },
  {
    name: "Helmet",
    stats: {
      armor: [3, 8],
      health: [10, 25]
    }
  },
  {
    name: "Chestplate",
    stats: {
      armor: [8, 20],
      health: [20, 60]
    }
  },
  {
    name: "Boots",
    stats: {
      speed: [1, 6],
      dodge: [1, 5]
    }
  }
];

const prefixes = [
  "Ancient",
  "Cursed",
  "Blessed",
  "Savage",
  "Mystic",
  "Brutal",
  "Frozen",
  "Burning"
];

const suffixes = [
  "of Power",
  "of the Bear",
  "of Agility",
  "of Doom",
  "of the Phoenix",
  "of Shadows"
];

// ---------- UTIL ----------

function weightedRandom(list) {
  const total = list.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;

  for (const item of list) {
    if (roll < item.weight) return item;
    roll -= item.weight;
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- MAIN ROLL ----------

function rollLoot() {
  const rarity = weightedRandom(rarities);
  const gear = pick(gearTypes);

  const prefix = Math.random() < 0.6 ? pick(prefixes) : "";
  const suffix = Math.random() < 0.5 ? pick(suffixes) : "";

  const stats = {};

  for (const stat in gear.stats) {
    const [min, max] = gear.stats[stat];
    const value = Math.floor(rand(min, max) * rarity.multiplier);
    stats[stat] = value;
  }

  const name = `${prefix ? prefix + " " : ""}${gear.name}${suffix ? " " + suffix : ""}`;

  displayLoot({
    name,
    rarity: rarity.name,
    stats
  });
}

// ---------- DISPLAY ----------

function displayLoot(item) {
  const lootDiv = document.getElementById("loot");

  const statsHTML = Object.entries(item.stats)
    .map(([key, value]) => `<div class="stat"><span>${key}</span><span>${value}</span></div>`)
    .join("");

  lootDiv.innerHTML = `
    <h3 class="rarity-${item.rarity.toLowerCase()}">
      ${item.name}
    </h3>
    <div>${item.rarity}</div>
    <hr>
    ${statsHTML}
  `;
}

// ---------- EVENT ----------

document.getElementById("rollBtn").addEventListener("click", rollLoot);
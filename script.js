function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- ENUMS ----------

const Rarity = Object.freeze({
  COMMON: "Common",
  UNCOMMON: "Uncommon",
  RARE: "Rare",
  EPIC: "Epic",
  LEGENDARY: "Legendary"
});

const StatType = Object.freeze({
  STRENGTH: "Strength",
  AGILITY: "Agility",
  INTELLIGENCE: "Intelligence",
  CRIT_CHANCE: "Crit Chance",
  ATTACK_SPEED: "Attack Speed",
  MOVEMENT_SPEED: "Movement Speed",
  DAMAGE_FLAT: "Flat Damage",
  ELEMENTAL_DAMAGE: "Elemental Damage"
});

const WeaponType = Object.freeze({
  ONE_HAND_SWORD: "1H Sword",
  TWO_HAND_SWORD: "2H Sword",
  AXE: "Axe",
  SPEAR: "Spear",
  POLEARM: "Polearm",
  DAGGER: "Dagger",
  STAFF: "Staff"
});

// ---------- NAME PARTS (NEW) ----------

const prefixes = ["Rusty", "Ancient", "Blessed", "Cursed", "Savage", "Forgotten"];
const suffixes = ["of Power", "of the Bear", "of Shadows", "of Fury", "of Titans"];

// ---------- CLASSES ----------

class Stat {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Item {
  constructor({ name, levelRequirement, rarity, stats = [], flavorText = "" }) {
    this.name = name;
    this.levelRequirement = levelRequirement;
    this.rarity = rarity;
    this.stats = stats;
    this.flavorText = flavorText;
  }

  addStat(stat) {
    this.stats.push(stat);
  }
}

class Weapon extends Item {
  constructor(config) {
    super(config);

    this.weaponType = config.weaponType;
    this.weaponDamageMin = config.weaponDamageMin;
    this.weaponDamageMax = config.weaponDamageMax;
  }
}

class Armor extends Item {
  constructor(config) {
    super(config);

    this.slot = config.slot;
  }
}

// ---------- LOOT GENERATOR ----------

class LootGenerator {
  constructor(playerLevel) {
    this.playerLevel = playerLevel;
  }

  getRarity() {
    const r = Math.random();
    if (r < 0.5) return Rarity.COMMON;
    if (r < 0.75) return Rarity.UNCOMMON;
    if (r < 0.9) return Rarity.RARE;
    if (r < 0.97) return Rarity.EPIC;
    return Rarity.LEGENDARY;
  }

  getWeaponType() {
    const vals = Object.values(WeaponType);
    return vals[Math.floor(Math.random() * vals.length)];
  }

  getArmorSlot() {
    const slots = ["Helmet", "Chest", "Gloves", "Boots"];
    return slots[Math.floor(Math.random() * slots.length)];
  }

  getPrefix() {
    return Math.random() < 0.6
      ? prefixes[Math.floor(Math.random() * prefixes.length)]
      : "";
  }

  getSuffix() {
    return Math.random() < 0.5
      ? suffixes[Math.floor(Math.random() * suffixes.length)]
      : "";
  }

  rollStat(rarity) {
    const base = rand(1, 10);

    const mult = {
      Common: 1,
      Uncommon: 1.2,
      Rare: 1.5,
      Epic: 2,
      Legendary: 3
    }[rarity];

    return Math.floor(base * mult);
  }

  addStats(item, rarity, statCount) {
    const pool = Object.values(StatType);
    const used = new Set();

    let attempts = 0;

    while (item.stats.length < statCount && attempts < 50) {
      const type = pool[Math.floor(Math.random() * pool.length)];

      if (used.has(type)) {
        attempts++;
        continue;
      }

      used.add(type);
      item.addStat(new Stat(type, this.rollStat(rarity)));
    }
  }

  generateWeapon() {
    const rarity = this.getRarity();

    const weaponType = this.getWeaponType(); // ✅ FIX: stored once

    const rawA = rand(5, 10) * this.playerLevel;
    const rawB = rand(10, 20) * this.playerLevel;

    const weapon = new Weapon({
      name: `${this.getPrefix()} ${weaponType} ${this.getSuffix()}`.trim(),
      levelRequirement: this.playerLevel,
      rarity,
      weaponType,
      weaponDamageMin: Math.min(rawA, rawB),
      weaponDamageMax: Math.max(rawA, rawB)
    });

    const statCount = {
      Common: 1,
      Uncommon: 2,
      Rare: 3,
      Epic: 5,
      Legendary: 6
    }[rarity];

    this.addStats(weapon, rarity, statCount);

    return weapon;
  }

  generateArmor() {
    const rarity = this.getRarity();

    const slot = this.getArmorSlot(); // ✅ FIX: stored once

    const armor = new Armor({
      name: `${this.getPrefix()} ${slot} ${this.getSuffix()}`.trim(),
      levelRequirement: this.playerLevel,
      rarity,
      slot
    });

    const statCount = {
      Common: 1,
      Uncommon: 2,
      Rare: 3,
      Epic: 4,
      Legendary: 5
    }[rarity];

    this.addStats(armor, rarity, statCount);

    return armor;
  }

  generateItem() {
    return Math.random() < 0.7
      ? this.generateWeapon()
      : this.generateArmor();
  }
}

// ---------- DISPLAY ----------

function displayItem(item) {
  const lootDiv = document.getElementById("loot");

  const statsHTML = item.stats
    .map(s => `<div class="stat"><span>${s.type}</span><span>${s.value}</span></div>`)
    .join("");

  let extra = "";

  if (item instanceof Weapon) {
    extra = `
      <div>Weapon Type: ${item.weaponType}</div>
      <div>Damage: ${item.weaponDamageMin} - ${item.weaponDamageMax}</div>
    `;
  }

  if (item instanceof Armor) {
    extra = `
      <div>Armor Slot: ${item.slot}</div>
    `;
  }

  lootDiv.innerHTML = `
    <h3 class="rarity-${item.rarity.toLowerCase()}">${item.name}</h3>
    <div>Rarity: ${item.rarity}</div>
    <div>Level Req: ${item.levelRequirement}</div>
    ${extra}
    <hr>
    ${statsHTML}
    <p><i>${item.flavorText || ""}</i></p>
  `;
}

// ---------- INIT ----------

function rollLoot() {
  const level = rand(1, 100);
  const generator = new LootGenerator(level);

  const item = generator.generateItem();
  displayItem(item);
}

document.getElementById("rollBtn").addEventListener("click", rollLoot);
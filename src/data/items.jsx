//https://github.com/xJleSx
import dragonclawHook from '../assets/Dragonclaw Hook.svg';
import avowance from '../assets/Avowance.svg';
import exaltedFeast from '../assets/Exalted Feast of Abscession - Back.svg';
import goldenshadowmasque from '../assets/Golden Shadow Masque.svg';
import goldenbasherblades from '../assets/Golden Basher Blades.svg';
import fractalhornsofinnerabysm from '../assets/Fractal Horns of Inner Abysm.svg'; 
import genuineicebabyroshan from '../assets/Genuine Ice Baby Roshan.svg';
import goldencrucibleofrile from '../assets/Golden Crucible of Rile.svg';
import goldenprofaneunion from '../assets/Golden Profane Union.svg';
import headoftheodobenusone from '../assets/Head of the Odobenus One.svg';
import inscribedbracersofaeonsofthecrimsonwitness from '../assets/Inscribed Bracers of Aeons of the Crimson Witness.svg';
import souldiffuser from '../assets/Soul Diffuser.svg';

const items = [
  {
    id: 1,
    name: 'Dragonclaw Hook',
    price: 18083.58,
    steamPrice: 19937.70,
    hero: 'Pudge',
    slot: 'Оружие',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Standard',
    hold: 'Без холда',
    image: dragonclawHook,
    subtitle: 'Коготь с левой лапы черного дракона. Единственная часть монстра, выжившая после встречи с ненасытным голодом Pudge.',
    stock: 3,
    seller: 'JleS',
    offers: [
      { price: 18083.58, seller: 'JleS' },
      { price: 18200.00, seller: 'TraderPro' }
    ]
  },
  {
    id: 2,
    name: 'Arcana of the Crimson Witness',
    price: 27153.66,
    steamPrice: 28124.80,
    hero: 'Phantom Assassin',
    slot: 'Плечо',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Standard',
    hold: 'Без холда',
    image: avowance,
    subtitle: 'Новая версия Crimson Witness',
    stock: 8,
    seller: 'kr1po4ek',
    offers: [
      { price: 27153.66, seller: 'kr1po4ek' }
    ]
  },
  {
    id: 3,
    name: 'Exalted Feast of Abscession - Back',
    price: 39.72,
    steamPrice: 59.59,
    hero: 'Pudge',
    slot: 'Спина',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Exalted',
    hold: 'Без холда',
    image: exaltedFeast,
    subtitle: 'Эксклюзивная спинка для Pudge с анимированными эффектами',
    stock: 2,
    seller: 'kr1po4ek',
    offers: [
      { price: 39.72, seller: 'kr1po4ek' },
      { price: 42.50, seller: 'ItemMaster' }
    ]
  },
  {
    id: 4,
    name: 'Golden Shadow Masque',
    price: 3128.90,
    steamPrice: 3250.00,
    hero: 'Shadow Fiend',
    slot: 'Голова',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Golden',
    hold: 'Без холда',
    image: goldenshadowmasque,
    subtitle: 'Золотая маска с анимированными эффектами',
    stock: 4,
    seller: 'ShadowKing',
    offers: [
      { price: 3128.90, seller: 'ShadowKing' }
    ]
  },
  {
    id: 5,
    name: "Golden Basher Blades",
    price: 847.87,
    steamPrice: 1220.94,
    hero: "Anti-Mage",
    slot: "Оружие",
    type: "Украшение",
    rarity: "Immortal",
    quality: "Golden",
    hold: "7 дней",
    image: goldenbasherblades,
    subtitle: "Золотые клейморды-башеры для Anti-Mage",
    stock: 2,
    seller: "Gotory Sodju",
    offers: [
      { price: 847.87, seller: "Gotory Sodju" }
    ]
  },
  {
    id: 6,
    name: "Fractal Horns of Inner Abysm",
    price: 2159.25,
    steamPrice: 2878.78,
    hero: "Terrorblade",
    slot: "Голова",
    type: "Украшение",
    rarity: "Arcana",
    quality: "Standard",
    hold: "7 дней",
    image: fractalhornsofinnerabysm,
    subtitle: "Фрактальные рога из Бездны для Terrorblade",
    stock: 2,
    seller: "NightSniper",
    offers: [
      { price: 2159.25, seller: "NightSniper" }
    ]
  },
  {
    id: 7,
    name: "Genuine Ice Baby Roshan",
    price: 60916.99,
    steamPrice: 84741.47,
    hero: "Курьер",
    slot: "Питомец",
    type: "Курьер",
    rarity: "Immortal",
    quality: "Genuine",
    hold: "7 дней",
    image: genuineicebabyroshan,
    subtitle: "Ледяной детеныш Рошана",
    stock: 2,
    seller: "XC",
    offers: [
      { price: 60916.99, seller: "XC" }
    ]
  },
  {
    id: 8,
    name: "Head of the Odobenus One",
    price: 12.92,
    steamPrice: 20.18,
    hero: "Tusk",
    slot: "Голова",
    type: "Украшение",
    rarity: "Immortal",
    quality: "Standard",
    hold: "7 дней",
    image: headoftheodobenusone,
    subtitle: "Голова Моржевого Воина для Tusk",
    stock: 2,
    seller: "Kaneki",
    offers: [
      { price: 12.92, seller: "Kaneki" }
    ]
  },
  {
    id: 9,
    name: "Inscribed Bracers of Aeons of the Crimson Witness",
    price: 48890.08,
    steamPrice: 59260.00,
    hero: "Faceless Void",
    slot: "Руки",
    type: "Украшение",
    rarity: "Immortal",
    quality: "Crimson Witness",
    hold: "7 дней",
    image: inscribedbracersofaeonsofthecrimsonwitness,
    subtitle: "Наручи Вечности с кровавых состязаний для Faceless Void",
    stock: 2,
    seller: "Ra4ok",
    offers: [
      { price: 48890.08, seller: "Ra4ok" }
    ]
  },
  {
    id: 10,
    name: "Soul Diffuser",
    price: 1770.04,
    steamPrice: 2379.70,
    hero: "Spectre",
    slot: "Руки",
    type: "Украшение",
    rarity: "Immortal",
    quality: "Standard",
    hold: "7 дней",
    image: souldiffuser,
    subtitle: "Диффузор душ для Spectre",
    stock: 2,
    seller: "Seller",
    offers: [
      { price: 1770.04, seller: "Seller" }
    ]
  },
  {
    id: 11,
    name: "Golden Crucible of Rile",
    price: 39.56,
    steamPrice: 64.60,
    hero: "Axe",
    slot: "Дополнительное оружие",
    type: "Украшение",
    rarity: "Immortal",
    quality: "Golden",
    hold: "7 дней",
    image: goldencrucibleofrile,
    subtitle: "Золотой тигель ярости для Axe",
    stock: 2,
    seller: "Gribo4ek",
    offers: [
      { price: 39.56, seller: "Gribo4ek" }
    ]
  },
  {
    id: 12,
    name: "Golden Profane Union",
    price: 74.29,
    steamPrice: 111.43,
    hero: "Lifestealer",
    slot: "Спина",
    type: "Украшение",
    rarity: "Immortal",
    quality: "Golden",
    hold: "7 дней",
    image: goldenprofaneunion,
    subtitle: "Золотая скверна для Lifestealer",
    stock: 2,
    seller: "AMFan",
    offers: [
      { price: 74.29, seller: "AMFan" }
    ]
  }
];

export default items;
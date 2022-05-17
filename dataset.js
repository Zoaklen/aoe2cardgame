const UNITACTION_STANDATTACK = 0;
const UNITACTION_ADVANCEATTACK = 1;
const UNITACTION_FALLBACK = 2;

var ageNames = ["Trevas", "Feudal", "Castelo", "Imperial"];

var unitCards = {
  "villager": {
              name: "Aldeão",
              description: "Aldeões podem gerar construções. Caso o Aldeão morra antes de uma construção ficar pronta a mesma é destruída.",
              pv: 4,
              atk: 1,
              marm: 0,
              parm: 0,
              facility: "towncenter",
              builder: {building: {}, turns: 0},
              types: [],
              image: "https://static.wikia.nocookie.net/ageofempires/images/6/68/MaleVillDE.jpg"
            },
  "militia": {
              name: "Milícia",
              description: "",
              pv: 8,
              atk: 3,
              marm: 0,
              parm: 0,
              facility: "barracks",
              types: ["infantry"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/3/3a/MilitiaDE.png"
              },
  "spearman": {
              name: "Lanceiro",
              description: "Causa +4 de dano contra unidades do tipo Montado",
              pv: 4,
              atk: 1,
              marm: 0,
              parm: 0,
              facility: "barracks",
              types: ["infantry"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/5/5b/Spearman_aoe2DE.png",
              bonusdamage: [{type: "mounted", quant: 4}]
              },
  "archer": {
              name: "Arqueiro",
              description: "",
              pv: 4,
              atk: 2,
              marm: 0,
              parm: 0,
              rng: 2,
              facility: "archeryrange",
              types: ["archery"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/d/dd/Archer_aoe2DE.png"
              },
  "skirmisher": {
              name: "Escaramuçador",
              description: "Causa +1 de dano contra unidades do tipo Arqueiro e contra a carta Lanceiro",
              pv: 3,
              atk: 1,
              marm: 0,
              parm: 2,
              rng: 2,
              facility: "archeryrange",
              types: ["archery"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/1/11/Skirmisher_aoe2DE.png",
              bonusdamage: [{type: "archer", quant: 1},{type: "spearman", quant: 1},{type: "cavalryarcher", quant: 1}]
              },
  "cavalryarcher": {
              name: "Cavalo Arqueiro",
              description: "",
              pv: 6,
              atk: 3,
              marm: 0,
              parm: 0,
              rng: 2,
              facility: "archeryrange",
              types: ["mounted", "archery"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/b/b1/Cavalryarcher_aoe2DE.png"
              },
  "scout": {
              name: "Batedor",
              description: "Causa +1 de dano contra Monges",
              pv: 9,
              atk: 2,
              marm: 0,
              parm: 0,
              facility: "stable",
              types: ["mounted", "cavalry"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/d/d0/Scoutcavalry_aoe2DE.png",
              bonusdamage: [{type: "monk", quant: 1}]
              },
  "knight": {
              name: "Cavaleiro",
              description: "",
              pv: 16,
              atk: 4,
              marm: 0,
              parm: 1,
              facility: "stable",
              types: ["mounted", "cavalry"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/7/7e/Knight_aoe2DE.png"
              },
  "camelrider": {
              name: "Cavaleiro de Camelo",
              description: "Causa +4 de dano contra unidades do tipo Montado",
              pv: 10,
              atk: 2,
              marm: 0,
              parm: 0,
              facility: "stable",
              types: ["mounted", "cavalry"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/f/ff/Camelrider_aoe2DE.png",
              bonusdamage: [{type: "cavalry", quant: 4}]
              },
  "ram": {
              name: "Aríete",
              description: "Esta carta só pode alvejar construções",
              pv: 20,
              atk: 10,
              marm: -2,
              parm: 10,
              facility: "siegeworkshop",
              types: ["siege"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/c/c3/Battering_ram_aoe2DE.png"
              },
  "trebuchet": {
              name: "Trabuco",
              description: "Esta carta só pode alvejar construções ou armas de cerco e só pode atacar se permanecer 2 turnos no mesmo lugar",
              pv: 16,
              atk: 25,
              marm: 0,
              parm: 10,
              rng: 5,
              facility: "castle",
              types: ["siege"],
              image: "https://static.wikia.nocookie.net/ageofempires/images/3/31/Trebuchet_aoe2DE.png"
              },
  "monk": {
              name: "Monge",
              description: "Regenera a vida de unidades feridas (1 de alcance) ou tenta converter uma unidade inimiga caso ela permaneça no alcance durante 3 turnos",
              pv: 8,
              atk: 0,
              marm: 0,
              parm: 0,
              rng: 3,
              facility: "monastery",
              types: [],
              image: "https://static.wikia.nocookie.net/ageofempires/images/e/e9/Monk_aoe2DE.png"
              }
}

var buildingCards = {
  "towncenter": {
              name: "Centro da Cidade",
              description: "Aumenta o número de cartas sacadas em 1, ataca unidades próximas e caso o número de Aldeões fique abaixo do número de centros um aldeão será gerado em 3 turnos.",
              pv: 100,
              atk: 12,
              rng: 2,
              creation: 5,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/6/68/Towncenter_aoe2DE.png"
            },
  "castle": {
              name: "Castelo",
              description: "Ataca unidades próximas, gera um trabuco a cada 6 turnos na Era Imperial.",
              pv: 200,
              atk: 15,
              rng: 3,
              creation: 5,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/3/36/Castle_aoe2DE.png",
              unitgeneration: [{name: "trebuchet", time: 8, age: 3}]
            },
  "barracks": {
              name: "Quartel",
              description: "Gera um Guerreiro ou Lanceiro a cada 2 turnos.",
              pv: 70,
              creation: 4,
              age: 0,
              image: "https://static.wikia.nocookie.net/ageofempires/images/5/50/Barracks_aoe2DE.png",
              unitgeneration: [{name: "militia", time: 2, age: 0}, {name: "spearman", time: 2, age: 1}]
            },
  "archeryrange": {
              name: "Campo de Arquería",
              description: "Gera um Arqueiro ou Escaramuçador a cada 3 turnos ou um Cavalo Arqueiro (Idade do Castelo) a cada 4 turnos.",
              pv: 70,
              creation: 4,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/4/42/Archery_range_aoe2DE.png",
              unitgeneration: [{name: "archer", time: 3, age: 1}, {name: "skirmisher", time: 3, age: 1}, {name: "cavalryarcher", time: 4, age: 2}]
            },
  "stable": {
              name: "Estábulo",
              description: "Gera um Batedor a cada 3 turnos ou um Cavaleiro ou Cavaleiro de Camelo (Idade do Castelo) a cada 4 turnos.",
              pv: 70,
              creation: 4,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/2/2d/Stable_aoe2DE.png",
              unitgeneration: [{name: "scout", time: 3, age: 1}, {name: "knight", time: 4, age: 2}, {name: "camelrider", time: 4, age: 2}]
            },
  "siegeworkshop": {
              name: "Oficina de Cerco",
              description: "Gera um Aríete a cada 5 turnos.",
              pv: 70,
              creation: 4,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/a/a2/Siege_workshop_aoe2DE.png",
              unitgeneration: [{name: "ram", time: 5, age: 2}]
            },
  "university": {
              name: "Universidade",
              description: "A Universidade gera uma Carta de Melhoria a cada turno que o jogador pode dispensar ou trocar com uma carta que ele tem na mão.",
              pv: 70,
              creation: 5,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/9/92/University_AoE2_DE.png"
            },
  "monastery": {
              name: "Monastério",
              description: "Gera um Monge a cada 4 turnos.",
              pv: 70,
              creation: 4,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/7/78/MonasteryAoe2DE.png",
              unitgeneration: [{name: "monk", time: 4, age: 2}]
            },
  "blacksmith": {
              name: "Ferraria",
              description: "",
              pv: 70,
              creation: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/6/64/Blacksmith_aoe2de.png"
            }
}

var upgradeCards = {
  "manatarms": {
              name: "Espadas e Escudos",
              description: "Melhora a Milícia, ATQ+1 PV+1 AD+1",
              building: "barracks",
              time: 2,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/9/96/Manatarms_aoe2DE.png",
              upgrades: [{type: "militia", name: "Homem de Armas", atk: 1, pv: 1, parm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/9/96/Manatarms_aoe2DE.png"}]
            },
  "longswordsman": {
              name: "Espada Longa",
              description: "Melhora a Milícia, ATQ+1 PV+1 AC+1",
              building: "barracks",
              time: 2,
              age: 2,
              req: "manatarms",
              image: "https://static.wikia.nocookie.net/ageofempires/images/c/ca/LongSwordmanUpgDE.png",
              upgrades: [{type: "militia", name: "Espadachim Longo", atk: 1, pv: 1, marm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/1/1a/Longswordsman_aoe2DE.png"}]
            },
  "twohandedswordsman": {
              name: "Espada de Duas Mãos",
              description: "Melhora a Milícia, ATQ+1 PV+2",
              building: "barracks",
              time: 2,
              age: 3,
              req: "longswordsman",
              image: "https://static.wikia.nocookie.net/ageofempires/images/8/83/TwoHandedSwordsmanUpgDE.png",
              upgrades: [{type: "militia", name: "Espadachim de Duas Mãos", atk: 1, pv: 2, image: "https://static.wikia.nocookie.net/ageofempires/images/3/3c/Twohanded_aoe2DE.png"}]
            },
  "champion": {
              name: "Campeão",
              description: "Melhora a Milícia, ATQ+1 PV+2",
              building: "barracks",
              time: 2,
              age: 3,
              req: "twohandedswordsman",
              image: "https://static.wikia.nocookie.net/ageofempires/images/2/21/ChampionUpgDE.png",
              upgrades: [{type: "militia", name: "Campeão", atk: 1, pv: 2, image: "https://static.wikia.nocookie.net/ageofempires/images/5/54/Champion_aoe2DE.png"}]
            },
  "pikeman": {
              name: "Piqueiro",
              description: "Melhora o Lanceiro, ATQ+1 PV+1 Dano bônus contra unidades do tipo Montado +2",
              building: "barracks",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/b/b2/PikemanUpDE.png",
              upgrades: [{type: "spearman", name: "Piqueiro", description: "Causa +6 de dano contra unidades do tipo Montado", atk: 1, pv: 1, bonusdamage:[{type: "mounted", quant: 2}], image: "https://static.wikia.nocookie.net/ageofempires/images/a/a6/Aoe2-infantry-2-pikeman.png"}]
            },
  "halberdier": {
              name: "Alabardeiro",
              description: "Melhora o Lanceiro, ATQ+1 PV+2 Dano bônus contra cavalos +4",
              building: "barracks",
              time: 2,
              age: 3,
              req: "pikeman",
              image: "https://static.wikia.nocookie.net/ageofempires/images/8/8d/HalberdierDE.png",
              upgrades: [{type: "spearman", name: "Alabardeiro", description: "Causa +10 de dano contra unidades do tipo Montado", atk: 1, pv: 2, bonusdamage:[{type: "mounted", quant: 4}], image: "https://static.wikia.nocookie.net/ageofempires/images/a/aa/Halberdier_aoe2DE.png"}]
            },
  "crossbowman": {
              name: "Besteiro",
              description: "Melhora o Arqueiro, ATQ+1 PV+1 AD+1",
              building: "archeryrange",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/b/be/CrossbowmanDE.png",
              upgrades: [{type: "archer", name: "Besteiro", atk: 1, pv: 1, parm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/d/d1/Crossbowman_aoe2DE.png"}]
            },
  "arbalest": {
              name: "Balestra",
              description: "Melhora o Arqueiro, ATQ+1 PV+1 AD+1 ALC+1",
              building: "archeryrange",
              time: 2,
              age: 3,
              req: "crossbowman",
              image: "https://static.wikia.nocookie.net/ageofempires/images/d/d0/ArbalestDE.png",
              upgrades: [{type: "archer", name: "Balestreiro", atk: 1, pv: 1, rng: 1, parm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/d/dc/Arbalester_aoe2DE.png"}]
            },
  "heavycavalryarcher": {
              name: "Cavalo Arqueiro Pesado",
              description: "Melhora o Cavalo Arqueiro, ATQ+1 PV+2 AD+1",
              building: "archeryrange",
              time: 2,
              age: 3,
              image: "https://static.wikia.nocookie.net/ageofempires/images/c/c4/Heavy-cavalry-archer-resear.jpg",
              upgrades: [{type: "cavalryarcher", name: "Cavalo Arqueiro Pesado", atk: 1, pv: 2, parm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/e/ec/Heavycavalryarcher_aoe2de.png"}]
            },
  "eliteskirmisher": {
              name: "Escaramuçador de Elite",
              description: "Melhora o Escaramuçador, ATQ+1 PV+1 AD+2 dano adicional contra unidades do tipo Arqueiro +2, aumentando para +4 caso também possuam o tipo Montado",
              building: "archeryrange",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/0/09/Imperialskirmisherresearch.png",
              upgrades: [{type: "skirmisher", name: "Escaramuçador de Elite", atk: 1, pv: 1, parm: 2, bonusdamage: [{type: "archery", quant: 2}, {type:"cavalryarcher", quant: 2}], image: "https://static.wikia.nocookie.net/ageofempires/images/8/8e/Elite_skirmisher_aoe2DE.png"}]
            },
  "heavyscout": {
              name: "Batedor Pesado",
              description: "Melhora o Batedor, ATQ+1 PV+2",
              building: "stable",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/a/a7/Light-cavalry-research.jpg",
              upgrades: [{type: "scout", name: "Batedor Pesado", atk: 1, pv: 2, image: "https://static.wikia.nocookie.net/ageofempires/images/9/97/Lightcavalry_aoe2DE.png"}]
            },
  "hussar": {
              name: "Hussardo",
              description: "Melhora o Batedor, PV+2",
              building: "stable",
              time: 2,
              age: 3,
              req: "heavyscout",
              image: "https://static.wikia.nocookie.net/ageofempires/images/a/a5/Hussar_aoe2DE.png",
              upgrades: [{type: "scout", name: "Batedor Pesado", pv: 2, image: "https://static.wikia.nocookie.net/ageofempires/images/a/a5/Hussar_aoe2DE.png"}]
            },
  "cavalier": {
              name: "Fidalgo",
              description: "Melhora o Cavaleiro, PV+4 ATQ+1 AC+1 AD+1",
              building: "stable",
              time: 3,
              age: 3,
              image: "https://static.wikia.nocookie.net/ageofempires/images/3/39/Cavalier-research.jpg",
              upgrades: [{type: "knight", name: "Fidalgo", pv: 4, atk: 1, marm: 1, parm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/1/10/Cavalier_aoe2DE.png"}]
            },
  "paladin": {
              name: "Paladino",
              description: "Melhora o Cavaleiro, PV+8 ATQ+1 AD+1",
              building: "stable",
              time: 5,
              age: 3,
              req: "cavalier",
              image: "https://static.wikia.nocookie.net/ageofempires/images/c/c0/Paladin-research.jpg",
              upgrades: [{type: "knight", name: "Paladino", pv: 8, atk: 1, parm: 1, image: "https://static.wikia.nocookie.net/ageofempires/images/2/28/Paladin_aoe2DE.png"}]
            },
  "cappedram": {
              name: "Aríete Capado",
              description: "Melhora o Aríete, ATQ+5 AD+4",
              building: "siegeworkshop",
              time: 4,
              age: 3,
              image: "https://static.wikia.nocookie.net/ageofempires/images/4/4e/CappedRamDE.png",
              upgrades: [{type: "ram", name: "Aríete Capado", atk: 5, parm: 4, image: "https://static.wikia.nocookie.net/ageofempires/images/b/b9/Capped_ram_aoe2DE.png"}]
            },
  "siegeram": {
              name: "Aríete de Cerco",
              description: "Melhora o Aríete, ATQ+5 AD+4",
              building: "siegeworkshop",
              time: 4,
              age: 3,
              req: "cappedram",
              image: "https://static.wikia.nocookie.net/ageofempires/images/7/70/Siege-ram-research.jpg",
              upgrades: [{type: "ram", name: "Aríete de Cerco", atk: 5, parm: 4, image: "https://static.wikia.nocookie.net/ageofempires/images/4/4f/Siege_ram_aoe2DE.png"}]
            },
  "thumbring": {
              name: "Anel no Dedão",
              description: "Aumenta o ATQ de unidades do tipo Arqueiro e da carta Escaramuçador em 1",
              building: "archeryrange",
              time: 3,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/f/f7/ThumbRingDE.png",
              upgrades: [{type: "archery", atk: 1}]
            },
  "bloodlines": {
              name: "Linhagem",
              description: "Aumenta o PV de unidades do tipo Montado em 4",
              building: "stable",
              time: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/5/56/BloodlinesDE.png",
              upgrades: [{type: "mounted", pv: 4}]
            },
  "husbandry": {
              name: "Hipismo",
              description: "Unidades montadas possuem uma ação extra caso a primeira ação seja uma movimentação",
              building: "stable",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/e/ec/HusbandryDE.png"
            },
  "arson": {
              name: "Arsonismo",
              description: "Unidades do tipo Infantaria causam +1 de dano contra construções",
              building: "barracks",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/3/3e/ArsonDE.png",
              upgrades: [{type: "infantry", bonusdamage: [{type: "building", quant: 1}]}]
            },
  "parthiantactics": {
              name: "Táticas Partas",
              description: "Unidades do tipo Arqueiro que também são do tipo Montado recebem AD+1 e 1 de dano adicional contra a carta Lanceiro",
              building: "archeryrange",
              time: 2,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/5/59/ParthianTacticsDE.png",
              upgrades: [{type: "cavalryarcher", parm: 1, bonusdamage: [{type: "spearman", quant: 1}]}]
            },
  "chemistry": {
              name: "Química",
              description: "Aumenta o dano das unidades do Campo de Arquería em 1",
              building: "university",
              time: 3,
              age: 3,
              image: "https://static.wikia.nocookie.net/ageofempires/images/0/02/ChemistryDE.png",
              upgrades: [{type: "archery", atk: 1}]
            },
  "treadmillcrane": {
              name: "Guindaste de Esteira",
              description: "Diminui o tempo para gerar construções em 1",
              building: "university",
              time: 4,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/b/bf/TreadmillCraneDE.png"
            },
  "loom": {
              name: "Tear",
              description: "Melhora os Aldeões, PV+3 AD+1",
              building: "university",
              time: 4,
              age: 2,
              image: "https://static.wikia.nocookie.net/ageofempires/images/a/a8/LoomDE.png",
              upgrades: [{type: "villager", pv: 3, parm: 1}]
            },
  "fletching": {
              name: "Penas",
              description: "Melhora unidades do tipo Arqueiro e a carta Escaramuçador, ATQ+1",
              building: "blacksmith",
              time: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/7/7b/FletchingDE.png",
              upgrades: [{type: "archery", atk: 1}]
            },
  "forging": {
              name: "Forja",
              description: "Melhora unidades do tipo Infantaria e Cavalaria, ATQ+1",
              building: "blacksmith",
              time: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/e/ef/Forging_aoe2de.png",
              upgrades: [{type: "infantry", atk: 1}]
            },
  "paddedarcherarmor": {
              name: "Armadura Acolchoada",
              description: "Melhora unidades do tipo Arqueiro e a carta Escaramuçador, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/e/ee/PaddedArcherArmorDE.png",
              upgrades: [{type: "archery", marm: 1, parm: 1}]
            },
  "scalemailarmor": {
              name: "Armadura de Malha",
              description: "Melhora unidades do tipo Infantaria, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/a/a0/ScaleMailArmorDE.png",
              upgrades: [{type: "infantry", marm: 1, parm: 1}]
            },
  "scalebardingarmor": {
              name: "Armadura de Escamas",
              description: "Melhora unidades do tipo Cavalaria, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 1,
              image: "https://static.wikia.nocookie.net/ageofempires/images/f/ff/ScaleBardingArmorDE.png",
              upgrades: [{type: "cavalry", marm: 1, parm: 1}]
            },
  "bodkinarrow": {
              name: "Flecha de Aço",
              description: "Melhora unidades do tipo Arqueiro e a carta Escaramuçador, ATQ+1",
              building: "blacksmith",
              time: 3,
              age: 2,
              req: "fletching",
              image: "https://static.wikia.nocookie.net/ageofempires/images/e/e1/BodkinArrowDE.png",
              upgrades: [{type: "archery", atk: 1}]
            },
  "ironcasting": {
              name: "Fundição de Ferro",
              description: "Melhora unidades do tipo Infantaria e Cavalaria, ATQ+1",
              building: "blacksmith",
              time: 3,
              age: 2,
              req: "forging",
              image: "https://static.wikia.nocookie.net/ageofempires/images/f/f7/IronCastingDE.png",
              upgrades: [{type: "infantry", atk: 1}]
            },
  "leatherarcherarmor": {
              name: "Armadura de Couro",
              description: "Melhora unidades do tipo Arqueiro e a carta Escaramuçador, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 2,
              req: "paddedarcherarmor",
              image: "https://static.wikia.nocookie.net/ageofempires/images/d/db/LeatherArcherArmorDE.png",
              upgrades: [{type: "archery", marm: 1, parm: 1}]
            },
  "chainmailarmor": {
              name: "Armadura de Cota de Malha",
              description: "Melhora unidades do tipo Infantaria, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 2,
              req: "scalemailarmor",
              image: "https://static.wikia.nocookie.net/ageofempires/images/c/ce/ChainMailArmorDE.png",
              upgrades: [{type: "infantry", marm: 1, parm: 1}]
            },
  "chainbardingarmor": {
              name: "Armadura de Barda em Cadeia",
              description: "Melhora unidades do tipo Cavalaria, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 2,
              req: "scalebardingarmor",
              image: "https://static.wikia.nocookie.net/ageofempires/images/1/1e/ChainBardingDE.png",
              upgrades: [{type: "cavalry", marm: 1, parm: 1}]
            },
  "bracer": {
              name: "Braceletes",
              description: "Melhora unidades do tipo Arqueiro e a carta Escaramuçador, ATQ+1",
              building: "blacksmith",
              time: 3,
              age: 3,
              req: "bodkinarrow",
              image: "https://static.wikia.nocookie.net/ageofempires/images/f/fa/BracerDE.png",
              upgrades: [{type: "archery", atk: 1}]
            },
  "blastfurnace": {
              name: "Forno Alto",
              description: "Melhora unidades do tipo Infantaria e Cavalaria, ATQ+1",
              building: "blacksmith",
              time: 3,
              age: 3,
              req: "ironcasting",
              image: "https://static.wikia.nocookie.net/ageofempires/images/6/6b/BlastFurnaceDE.png",
              upgrades: [{type: "infantry", atk: 1}]
            },
  "ringarcherarmor": {
              name: "Armadura Anelar",
              description: "Melhora unidades do tipo Arqueiro e a carta Escaramuçador, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 3,
              req: "leatherarcherarmor",
              image: "https://static.wikia.nocookie.net/ageofempires/images/9/9e/RingArcherArmorDE.png",
              upgrades: [{type: "archery", marm: 1, parm: 1}]
            },
  "platemailarmor": {
              name: "Armadura de Placa Menor",
              description: "Melhora unidades do tipo Infantaria, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 3,
              req: "chainmailarmor",
              image: "https://static.wikia.nocookie.net/ageofempires/images/6/64/PlateMailArmorDE.png",
              upgrades: [{type: "infantry", marm: 1, parm: 1}]
            },
  "platebardingarmor": {
              name: "Armadura de Placa Maior",
              description: "Melhora unidades do tipo Cavalaria, AC+1 AD+1",
              building: "blacksmith",
              time: 3,
              age: 3,
              req: "chainbardingarmor",
              image: "https://static.wikia.nocookie.net/ageofempires/images/b/b2/PlateBardingArmorDE.png",
              upgrades: [{type: "cavalry", marm: 1, parm: 1}]
            },
}

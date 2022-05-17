function copyObject(object, extraValues = {})
{
  return Object.assign(extraValues, object);
}

function resetUnit(unit)
{
  Object.assign(unit, unitCards[unit.dataname]);
  applyUpgrades(unit);
  return unit;
}

function applyUpgrades(unit)
{
  for (var upgname of playerupgrades[unit.team])
  {
    var upg = upgradeCards[upgname];
    if(!("upgrades" in upg))
      continue;

    for (var upgrades of upg.upgrades) {
      if(unit.dataname == upgrades.type || unit.types.includes(upgrades.type))
      {
        for (var field in upgrades)
        {
          if(field != "type")
          {
            if(typeof upgrades[field] == 'number')
            {
              if(!(field in unit))
                unit[field] = upgrades[field];
              else
                unit[field] += upgrades[field];
            }
            else if(Array.isArray(upgrades[field]))
            {
              if(!(field in unit))
                unit[field] = upgrades[field];
              else
                unit[field].push(...upgrades[field]);
            }
            else
            {
              unit[field] = upgrades[field];
            }
          }
        }
      }
    }
  }
}

function resetUnitAtPos(x, y)
{
  return resetUnit(gameboard[x][y]);
}

function placeBuilding(buildingName, team, x, y)
{
  var b = copyObject(buildingCards[buildingName], {"counter": 0, "team": team, "x": x, "y": y});
  b.health = b.pv;
  if("unitgeneration" in b)
  {
    b.generating = b.unitgeneration[0];
  }
  gameboard[x][y] = b;
  return b;
}

function researchUpgrade(team, upgradeName)
{
  if(playerHaveUpgrade(team, upgradeName))
    return;

  playerupgrades[team].push(upgradeName);
}

function destroyHandCard(team, index)
{
  playerhand[team].splice(index, 1);
}

function placeUnit(unitName, team, x, y)
{
  var u = copyObject(unitCards[unitName], {"team": team, "action": unitName == "villager" ? UNITACTION_STANDATTACK : UNITACTION_ADVANCEATTACK, "x": x, "y": y});
  applyUpgrades(u);
  u.health = u.pv;
  gameboard[x][y] = u;
  return u;
}

function placeUnitAroundBuilding(unitName, building)
{
  if(building.team != 0)
  {
    outer:
    for(var i = Math.max(building.x-1, 0);i <= Math.min(building.x+1, boardWidth-1);i++)
    {
      for(var j = 0;j < boardHeight;j++)
      {
        if(gameboard[i][j] == undefined)
        {
          placeUnit(unitName, building.team, i, j);
          break outer;
        }
      }
    }
  }
  else
  {
    outer:
    for(var i = Math.min(building.x+1, boardWidth-1);i >= Math.max(building.x-1, 0);i--)
    {
      for(var j = 0;j < 5;j++)
      {
        if(gameboard[i][j] == undefined)
        {
          placeUnit(unitName, building.team, i, j);
          break outer;
        }
      }
    }
  }
}

function moveUnitToRow(unit, newRow)
{
  if(newRow < 0 || newRow >= boardWidth)
    return;

  for(var i = 0;i < boardHeight;i++)
  {
    if(gameboard[newRow][i] == undefined)
    {
      gameboard[newRow][i] = unit;
      gameboard[unit.x][unit.y] = undefined;
      unit.x = newRow;
      unit.y = i;
      break;
    }
  }
}

function playerHaveUpgrade(team, upgradeName)
{
  return playerupgrades[team].includes(upgradeName);
}

function moveUnitForward(unit)
{
  if(unit.team == 0)
  {
    moveUnitToRow(unit, unit.x+1);
  }
  else
  {
    moveUnitToRow(unit, unit.x-1);
  }
}

function moveUnitBackwards(unit)
{
  if(unit.team == 0)
  {
    moveUnitToRow(unit, unit.x-1);
  }
  else
  {
    moveUnitToRow(unit, unit.x+1);
  }
}

function resetRerolls()
{
  var list = document.querySelectorAll("button[rerollbutton]");
  for (var x of list) {
    x.removeAttribute("disabled");
  }
}

function blockRerolls()
{
  var list = document.querySelectorAll("button[rerollbutton]");
  for (var x of list) {
    x.setAttribute("disabled", "true");
  }
}

function getAllActiveBuildings()
{
  var ret = [];
  for(var i = 0;i < gameboard.length;i++)
  {
    for(var j = 0;j < gameboard[i].length;j++)
    {
      if(gameboard[i][j] != undefined && gameboard[i][j].type == "building")
      {
        ret.push(gameboard[i][j]);
      }
    }
  }
  return ret;
}

function getAllActiveUnits()
{
  var ret = [];
  for(var i = 0;i < gameboard.length;i++)
  {
    for(var j = 0;j < gameboard[i].length;j++)
    {
      if(gameboard[i][j] != undefined && gameboard[i][j].type == "unit")
      {
        ret.push(gameboard[i][j]);
      }
    }
  }
  return ret;
}

function damageUnit(unit, quant)
{
  unit.health -= quant;
  if(unit.health <= 0)
  {
    gameboard[unit.x][unit.y] = undefined;
  }
}

function getUnitDamage(attacker, victim)
{
  var def = 0;
  if(victim.type == "unit")
  {
    def = victim.marm;
    if("rng" in attacker)
      def = victim.parm;
  }
  else
  {
    def = 0;
    if("rng" in attacker)
      def = 10;
  }

  var damage = attacker.atk;
  damage += getBonusDamage(attacker, victim);
  damage = Math.max(1, damage-def);
  return damage;
}

function getBonusDamage(attacker, victim)
{
  if(!("bonusdamage" in attacker))
    return 0;
  var damage = 0;
  for (var dmg of attacker.bonusdamage) {
    for (var typeindex in victim.types)
    {
      var enttype = victim.types[typeindex];
      if(dmg.type == enttype)
      {
        damage += dmg.quant;
      }
    }
  }
  return damage;
}

function setBuildingGeneratingUnit(building, generatingUnit)
{
  building.generating = generatingUnit;
}

function getUnitTarget(unit)
{
  var range = 1;
  if("rng" in unit)
    range = unit.rng;

  var validTargets = [];
  if(unit.team == 0)
  {
    outer:
    for(var i = Math.max(unit.x-range, 0);i <= Math.min(unit.x+range, boardWidth-1);i++)
    {
      for(var j = 0;j < boardHeight;j++)
      {
        if(gameboard[i][j] != undefined && gameboard[i][j].team != unit.team && isValidTarget(unit, gameboard[i][j]))
        {
          validTargets.push(gameboard[i][j]);
        }
      }
    }
  }
  else
  {
    outer:
    for(var i = Math.min(unit.x+range, boardWidth-1);i >= Math.max(unit.x-range, 0);i--)
    {
      for(var j = 0;j < boardHeight;j++)
      {
        if(gameboard[i][j] != undefined && gameboard[i][j].team != unit.team && isValidTarget(unit, gameboard[i][j]))
        {
          validTargets.push(gameboard[i][j]);
        }
      }
    }
  }
  validTargets.sort((a, b) => {
    var damageA = getUnitDamage(unit, a);
    var damageB = getUnitDamage(unit, b);
    var h = damageA - damageB;
    if(a.type == "building")
    if(a.type == "building")
      h -= 50;
    if(b.type == "building")
      h += 50;
    /*if(damageA >= a.health)
      h += 0.5;
    if(damageB >= b.health)
      h -= 0.5;*/

    return h;
  });

  if(validTargets.length < 1)
    return undefined;
  else
    return validTargets[0];
}

function isValidTarget(attacker, victim)
{
  if(attacker.dataname == "ram" && victim.type != "building")
    return false;

  if(attacker.dataname == "trebuchet" && victim.type != "building" && !victim.types.includes("siege"))
    return false;

  return true;
}

function generateValidCard(player)
{
  var array = allcardsarray.filter((x) => x.type != "upgrade" || (!playerHaveUpgrade(player, x.dataname) && !playerHaveCard(player, x.dataname)));
  var card = array[getRandomInt(0, array.length)];
  return card;
}

function deleteUnit(x, y)
{
  gameboard[x][y] = null;
  if(selectedTileX != -1)
  {
    document.getElementById('checkingcard').innerHTML = "";
    setCheckingCard(null);
  }
  updateBoard();
}

function playerHaveCard(player, cardName)
{
  for (var card in playerhand[player])
  {
    var c = playerhand[player][card];
    if(c != undefined && c.dataname == cardName)
      return true;
  }
  return false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

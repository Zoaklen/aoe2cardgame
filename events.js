function onNewTurn()
{
  usingCard = -1;
  var buildings = getAllActiveBuildings();
  var units = getAllActiveUnits();
  var tcCount = [0, 0];
  for (var building of buildings) {
    onBuildingUpdate(building);
    if(building.dataname == "towncenter")
      tcCount[building.team]++;
  }

  for (var unit of units) {
    onUnitUpdate(unit);
  }

  updateBoard();

  for(var t = 0;t < 2;t++)
  {
    for(var i = playerhand[t].length;i < basecards + tcCount[t];i++)
    {
      playerhand[t].push(generateValidCard(t));
    }
  }
  updateHand();
  resetRerolls();
}

function onBuildingUpdate(building)
{
  if(building.health < 0)
  {
    gameboard[building.x][building.y] = undefined;
    return;
  }
  building.counter++;
  if("generating" in building)
  {
    if(building.counter >= building.generating.time)
    {
      placeUnitAroundBuilding(building.generating.name, building);
      building.counter = 0;
    }
  }

  if("atk" in building)
  {
    var target = getUnitTarget(building);
    if(target != undefined)
    {
      var damage = getUnitDamage(building, target);
      damageUnit(target, damage);
    }
  }
}

function onUnitUpdate(unit)
{
  if(unit.health < 0)
  {
    gameboard[unit.x][unit.y] = undefined;
    return;
  }
  if(unit.action == UNITACTION_ADVANCEATTACK)
  {
    var target = getUnitTarget(unit);
    if(target == undefined)
      moveUnitForward(unit);
    else
    {
      var damage = getUnitDamage(unit, target);
      damageUnit(target, damage);
    }
  }
  else if(unit.action == UNITACTION_STANDATTACK)
  {
    var target = getUnitTarget(unit);
    if(target != undefined)
    {
      var damage = getUnitDamage(unit, target);
      damageUnit(target, damage);
    }
  }
  else if(unit.action == UNITACTION_FALLBACK)
  {
    moveUnitBackwards(unit);
  }
}

function tryUseCard(card, x, y)
{
  var tile = gameboard[x][y];
  console.log(card, x, y, tile);
  if(card.type == "unit")
  {
    if(tile == undefined)
      return;

    if(tile.dataname == card.facility)
    {
      placeUnitAroundBuilding(card.dataname, tile);
      destroyHandCard(0, usingCard);
    }
  }
  else if(card.type == "building")
  {
    if(tile != undefined)
      return;

    
    console.log(card, x, y, tile);
    placeBuilding(card.dataname, 0, x, y);
    destroyHandCard(0, usingCard);
  }
  else if(card.type == "upgrade")
  {
    if(tile == undefined)
      return;

    if("req" in card && !playerHaveUpgrade(0, card.req))
      return;

    if(!(card.name in playerupgrades[0]) && tile.dataname == card.building)
    {
      researchUpgrade(0, card.dataname);
      destroyHandCard(0, usingCard);
    }
  }
  usingCard = -1;
  updateHand();
  updateBoard();
}

function startgame()
{
  // Initialize data
  gameboard = Array(boardWidth).fill().map(()=>Array(boardHeight).fill());
  playerupgrades = [[], []];
  playerhand[0] = [];
  playerhand[1] = [];
  allcardsarray = [];
  for (var card in unitCards) {
    unitCards[card].type = "unit";
    unitCards[card].dataname = card;
    allcardsarray.push(unitCards[card]);
  }
  for (var card in buildingCards) {
    buildingCards[card].type = "building";
    buildingCards[card].dataname = card;
    allcardsarray.push(buildingCards[card]);
  }
  for (var card in upgradeCards) {
    upgradeCards[card].type = "upgrade";
    upgradeCards[card].dataname = card;
    allcardsarray.push(upgradeCards[card]);
  }

  // Initialize board
  setupBoard();
  placeBuilding("towncenter", 0, 0, 0);
  placeUnit("villager", 0, 1, 0).action = UNITACTION_STANDATTACK;
  placeBuilding("barracks", 0, 2, 0);
  placeBuilding("towncenter", 1, boardWidth-1, 0);
  placeUnit("villager", 1, boardWidth-2, 0).action = UNITACTION_STANDATTACK;
  placeBuilding("barracks", 1, boardWidth-3, 0);

  updateBoard();

  // Initialize hand
  for(var i = 0;i < basecards;i++)
  {
    playerhand[0].push(generateValidCard(0));
    playerhand[1].push(generateValidCard(1));
  }
  updateHand();
}

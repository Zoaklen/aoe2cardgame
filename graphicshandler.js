function updateBoard()
{
  var el;
  for(var i = 0;i < gameboard.length;i++)
  {
    for(var j = 0;j < gameboard[i].length;j++)
    {
      var entity = gameboard[i][j];
      el = document.querySelector("div[data-x='"+i+"'][data-y='"+j+"']");
      if(entity != undefined)
      {
        el.innerHTML = "";
        el.style.backgroundImage = "url("+entity.image+")";
        el.style.backgroundColor = entity.team == 0 ? "blue" : "red";
        var nameSpan = document.createElement("span");
        nameSpan.innerHTML = entity.name;
        nameSpan.classList.add("name");
        var healthSpan = document.createElement("span");
        healthSpan.innerHTML = entity.health + "/" + entity.pv;
        healthSpan.classList.add("health");

        el.appendChild(nameSpan);
        el.appendChild(healthSpan);
      }
      else
      {
        el.style.backgroundImage = "";
        el.style.backgroundColor = "";
        el.innerHTML = "";
      }
    }
  }
}

function updateHand()
{
  var hand = document.getElementById('myhand');
  hand.innerHTML = "";
  for (var i in playerhand[0]) {
    var card = playerhand[0][i];
    var div = createCardDiv(card);

    var rerollButton = document.createElement("button");
    rerollButton.type = "button";
    rerollButton.setAttribute("rerollbutton", i);
    rerollButton.innerHTML = "Descartar";
    rerollButton.setAttribute("onclick", "rerollCard("+i+")");

    var useButton = document.createElement("button");
    useButton.type = "button";
    useButton.setAttribute("usebutton", i);
    useButton.innerHTML = "Usar";
    useButton.setAttribute("onclick", "useCard("+i+")");

    div.appendChild(rerollButton);
    div.appendChild(useButton);
    hand.appendChild(div);
  }
}

function setCheckingCard(obj)
{
  var c = document.getElementById('checkingcard');
  if(obj != undefined)
  {
    selectedTileX = obj.x;
    selectedTileY = obj.y;
    c.innerHTML = "";
    var div = createCardDiv(obj);
    c.appendChild(div);
    c.classList.add("active");

    if("generating" in obj)
    {
      var select = document.createElement("select");
      select.setAttribute("onchange", "updateSelectedBuildingGeneratingUnit(this.selectedIndex)");
      var agegroups = [];
      for(var i = 0;i < ageNames.length;i++)
      {
        var optgroup = document.createElement("optgroup");
        optgroup.setAttribute("label", ageNames[i]);
        agegroups.push(optgroup);
        select.appendChild(optgroup);
      }
      for (var unit of obj.unitgeneration) {
        var opt = document.createElement("option");
        opt.value = unit.name;
        opt.innerHTML = unitCards[unit.name].name + " ("+unit.time+" turnos)";
        agegroups[unit.age].appendChild(opt);
        if(unit == obj.generating)
        {
          opt.setAttribute("selected", "true");
        }
      }
      div.appendChild(select);
    }
  }
  else
  {
    selectedTileX = -1;
    selectedTileY = -1;
    c.classList.remove("active");
  }
}

function updateSelectedBuildingGeneratingUnit(index)
{
  var tile = gameboard[selectedTileX][selectedTileY];
  if(tile == undefined)
    return;

  tile.generating = tile.unitgeneration[index];
}

function setupBoard()
{
  var container = document.getElementById('boardcontainer');
  for(var i = 0;i < gameboard[0].length;i++)
  {
    var row = document.createElement("div");
    row.classList.add("boardrow");
    for(var j = 0;j < gameboard.length;j++)
    {
      var box = document.createElement("div");
      box.classList.add("tilebox");
      box.setAttribute("data-x", j);
      box.setAttribute("data-y", i);
      box.setAttribute("onclick", "onTileClick("+j+", "+i+")");
      row.appendChild(box);
    }
    container.appendChild(row);
  }
}

function createCardDiv(obj)
{
  var div = document.createElement("div");
  div.classList.add("cardcontainer");

  var header = document.createElement("div");
  header.classList.add("cardheader");
  div.appendChild(header);

  var headerText = document.createElement("span");
  headerText.classList.add("cardheadertext");
  headerText.innerHTML = obj.name;
  header.appendChild(headerText);

  var image = document.createElement("img");
  image.src = obj.image;
  image.classList.add("cardimage");
  div.appendChild(image);

  var description = document.createElement("div");
  description.innerHTML = obj.description;
  description.classList.add("carddescription");
  div.appendChild(description);

  var footer = document.createElement("div");
  footer.classList.add("cardfooter");
  div.appendChild(footer);

  var footerText = document.createElement("span");
  footerText.classList.add("cardfootertext");
  footer.appendChild(footerText);

  var text = "";
  if(obj.type != "upgrade")
  {
    var atk = 0;
    if("atk" in obj)
    {
      atk = obj.atk;
    }
    var marm = 0;
    if("marm" in obj)
    {
      marm = obj.marm;
    }
    var parm = 0;
    if("parm" in obj)
    {
      parm = obj.parm;
    }
    text = "PV: " + obj.pv + " ATK: " + atk;
    if("rng" in obj)
      text += " RNG: " + obj.rng;

    if(obj.type == "building")
      text += " T: " + obj.creation;
    else
      text += " A: " + marm + "/" + parm;
  }
  else
  {
    text = "I: " + ageNames[obj.age] + " T: " + obj.time;
    if("req" in obj)
    {
      text += " Req: " + upgradeCards[obj.req].name;
    }
  }
  footerText.innerHTML = text;

  div.classList.add(obj.type);
  return div;
}

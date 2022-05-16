usingCard = -1;
selectedTileX = -1;
selectedTileY = -1;

function onTileClick(x, y)
{
  var tile = gameboard[x][y];
  if(usingCard == -1)
  {
    setCheckingCard(tile);
  }
  else
  {
    tryUseCard(playerhand[0][usingCard], x, y);
  }
}

function useCard(index)
{
  if(usingCard != index)
  {
    var elo = document.querySelector("button[usebutton='"+usingCard+"']");
    if(usingCard != -1)
    {
      elo.innerHTML = "Usar";
    }
    usingCard = index;
    var el = document.querySelector("button[usebutton='"+index+"']");
    el.innerHTML = "Voltar";
  }
  else
  {
    usingCard = -1;
    var el = document.querySelector("button[usebutton='"+index+"']");
    el.innerHTML = "Usar";
  }
}

function rerollCard(index)
{
  playerhand[0][index] = generateValidCard(0);
  updateHand();
  blockRerolls();
}

function toggleHand()
{
  var el = document.getElementById('myhand');
  if(el.classList.contains("hiddenhand"))
  {
    el.classList.remove("hiddenhand");
  }
  else
  {
    el.classList.add("hiddenhand");
  }
}

let fighters = {};

fetch("fighters.json")
  .then(res => res.json())
  .then(data => {
    fighters = data;
    renderFighterCards();
    populateSelectMenus();
  });

function renderFighterCards() {
  const grid = document.getElementById("fighters-grid");
  grid.innerHTML = "";
  Object.entries(fighters).forEach(([id, fighter]) => {
    const card = document.createElement("div");
    card.className = "fighter-card";
    card.innerHTML = `
      <img src="\${fighter.image}" alt="\${fighter.name}" />
      <h3>\${fighter.name}</h3>
      <p>Categoria: \${fighter.stats.Categoria}</p>
      <p>Vittorie: \${fighter.stats.Vittorie}</p>
      <p>Sconfitte: \${fighter.stats.Sconfitte}</p>
      <p>KO: \${fighter.stats.KO}</p>
      <div class="fav-star" onclick="toggleFavorite('\${id}', this)">★</div>
    `;
    grid.appendChild(card);
  });
}

function populateSelectMenus() {
  const select1 = document.getElementById("fighter1-select");
  const select2 = document.getElementById("fighter2-select");
  Object.entries(fighters).forEach(([id, fighter]) => {
    const option1 = document.createElement("option");
    option1.value = id;
    option1.textContent = fighter.name;
    const option2 = option1.cloneNode(true);
    select1.appendChild(option1);
    select2.appendChild(option2);
  });

  select1.onchange = compareFighters;
  select2.onchange = compareFighters;
}

function compareFighters() {
  const id1 = document.getElementById("fighter1-select").value;
  const id2 = document.getElementById("fighter2-select").value;
  const out = document.getElementById("comparison-result");

  if (id1 && id2 && id1 !== id2) {
    const f1 = fighters[id1];
    const f2 = fighters[id2];
    const total = f1.stats.Vittorie + f2.stats.Vittorie || 1;
    const p1 = ((f1.stats.Vittorie / total) * 100).toFixed(1);
    const p2 = ((f2.stats.Vittorie / total) * 100).toFixed(1);

    out.innerHTML = `
      <h2>Confronto</h2>
      <p>\${f1.name}: \${p1}%</p>
      <p>\${f2.name}: \${p2}%</p>
    `;
  } else {
    out.innerHTML = "";
  }
}

function toggleFavorite(id, el) {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favs.includes(id)) {
    const i = favs.indexOf(id);
    favs.splice(i, 1);
    el.classList.remove("favorited");
  } else {
    favs.push(id);
    el.classList.add("favorited");
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
}

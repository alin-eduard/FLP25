let data;
let currentFolder = null;
let currentGroup = null;

// Lista de culori posibile
const colors = [
  "#F1E1A6", "#F1C1A6", "#E29B97", "#D38B7A", "#A2B9D3", 
  "#A6C8D9", "#A8D0C0", "#F1C6D6", "#A6D3E3", "#F1D6B5", 
  "#B7D78B", "#D1D8D7", "#E1E8A5", "#F1D3E4", "#A7E8E9", 
  "#B8E3E1", "#F1E1C8", "#E1E1E1", "#B3A9D9", "#F1D8D6"
];

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    renderFolders();
  });

function renderFolders() {
  currentFolder = null;
  currentGroup = null;
  document.getElementById("header").innerHTML = "<h1>Flashcards</h1>";
  const container = document.getElementById("content");
  container.className = "grid";
  container.innerHTML = "";

  Object.keys(data.folders).forEach(folderName => {
    const folderDiv = document.createElement("div");
    folderDiv.className = "folder";
    folderDiv.textContent = folderName;
    folderDiv.onclick = () => renderGroups(folderName);
    container.appendChild(folderDiv);
  });
}

function renderGroups(folderName) {
  currentFolder = folderName;
  currentGroup = null;
  const groups = data.folders[folderName].groups;
  document.getElementById("header").innerHTML = `
    <button id="back-button">⬅️ Înapoi</button>
    <h1>${folderName}</h1>
  `;
  document.getElementById("back-button").onclick = renderFolders;

  const container = document.getElementById("content");
  container.className = "grid";
  container.innerHTML = "";

  Object.keys(groups).forEach(groupName => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "group";
    groupDiv.textContent = groupName;
    groupDiv.onclick = () => renderCards(groupName);
    container.appendChild(groupDiv);
  });
}

function renderCards(groupName) {
  currentGroup = groupName;
  const cards = data.folders[currentFolder].groups[groupName];
  document.getElementById("header").innerHTML = `
    <button id="back-button">⬅️ Înapoi</button>
    <h1>${groupName}</h1>
  `;
  document.getElementById("back-button").onclick = () => renderGroups(currentFolder);

  const container = document.getElementById("content");
  container.className = "grid";
  container.innerHTML = "";

  cards.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    // Alege o culoare random din lista
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    cardDiv.style.setProperty("--card-color", randomColor);

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    insertTextWithBr(front, card.front);  // Adăugăm textul și înlocuim "/#" cu <br>

    const back = document.createElement("div");
    back.className = "card-back";
    insertTextWithBr(back, card.back);  // Adăugăm textul și înlocuim "/#" cu <br>
    back.style.backgroundColor = randomColor; // Setăm culoarea aleasă aleatoriu

    inner.appendChild(front);
    inner.appendChild(back);
    cardDiv.appendChild(inner);
    container.appendChild(cardDiv);

    // ✅ Flip la click
    cardDiv.addEventListener("click", () => {
      cardDiv.classList.toggle("flipped");
    });
  });
}

// Funcția care inserează textul și înlocuiește "/#" cu <br> și păstrează tag-urile HTML
function insertTextWithBr(element, text) {
  const formattedText = text.replace('<br>', '<div class="line"></div>');  // Înlocuim "/#" cu <br>
  
  const div = document.createElement('div');
  div.innerHTML = formattedText;  // Setăm HTML-ul în element

  // Adăugăm toate elementele procesate în elementul țintă
  element.appendChild(div);
}

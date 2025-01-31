document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          let folders = data.folders;
          let currentGroup = null;
          let currentCards = [];

          const folderItemsContainer = document.getElementById('folder-items');
          const groupItemsContainer = document.getElementById('group-items');
          const cardItemsContainer = document.getElementById('card-items');
          const titleContainer = document.getElementById('page-title');  // Titlul paginii (folderul/grupul)

          // Adăugăm titlul pe prima pagină (pagina de foldere)
          titleContainer.textContent = 'Selectați un folder';

          function createFolderButtons() {
              folderItemsContainer.innerHTML = '';
              folders.forEach(folder => {
                  const button = document.createElement('button');
                  button.textContent = folder.name;
                  button.onclick = () => showGroups(folder);
                  folderItemsContainer.appendChild(button);
              });
          }

          function showGroups(folder) {
              currentGroup = null;
              currentCards = [];
              groupItemsContainer.innerHTML = '';
              cardItemsContainer.innerHTML = ''; // Golim cardurile la schimbarea grupului

              titleContainer.textContent = folder.name;  // Setăm titlul folderului

              folder.groups.forEach(group => {
                  const button = document.createElement('button');
                  button.textContent = group.name;
                  button.onclick = () => showCards(group);
                  groupItemsContainer.appendChild(button);
              });

              // Ascundem folderele
              folderItemsContainer.style.display = 'none';
              groupItemsContainer.style.display = 'block';
          }

          function showCards(group) {
              currentGroup = group;
              currentCards = group.cards;
              cardItemsContainer.innerHTML = '';
              
              titleContainer.textContent = group.name;  // Setăm titlul grupului

              group.cards.forEach(card => {
                  const cardElement = document.createElement('div');
                  cardElement.classList.add('card');
                  cardElement.innerHTML = `
                      <div class="card-inner">
                          <div class="card-front">
                              <h2>${card.front}</h2>
                          </div>
                          <div class="card-back">
                              <p>${card.back}</p>
                          </div>
                      </div>
                  `;
                  cardElement.onclick = () => flipCard(cardElement);
                  cardItemsContainer.appendChild(cardElement);
              });

              // Ascundem grupurile
              groupItemsContainer.style.display = 'none';
              cardItemsContainer.style.display = 'block';
          }

          // Flip card on click
          function flipCard(card) {
              card.classList.toggle('flipped');
          }

          // Navigare înapoi la foldere
          window.backToFolders = function () {
              currentGroup = null;
              currentCards = [];

              // Afișăm din nou folderele
              folderItemsContainer.style.display = 'block';
              groupItemsContainer.style.display = 'none';
              cardItemsContainer.style.display = 'none';
              titleContainer.textContent = 'Selectați un folder'; // Setăm titlul paginii principale
          };

          // Navigare înapoi la grupuri
          window.backToGroups = function () {
              currentGroup = null;
              currentCards = [];

              // Afișăm din nou grupurile
              groupItemsContainer.style.display = 'block';
              cardItemsContainer.style.display = 'none';
              titleContainer.textContent = currentGroup ? currentGroup.name : ''; // Setăm titlul grupului
          };

          createFolderButtons();
      });
});

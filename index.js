document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            let folders = data.folders;
            let currentFolderIndex = null;
            let currentGroupIndex = null;
            let currentCards = [];

            const folderItemsContainer = document.getElementById('folder-items');
            const groupItemsContainer = document.getElementById('group-items');
            const cardItemsContainer = document.getElementById('card-items');
            const titleContainer = document.getElementById('page-title');

            // Setăm titlul pe prima pagină (pagina de foldere)
            titleContainer.textContent = 'Selectați un folder';

            function createFolderButtons() {
                folderItemsContainer.innerHTML = '';
                folders.forEach((folder, index) => {
                    const button = document.createElement('button');
                    button.textContent = folder.name;
                    button.onclick = () => showGroups(folder, index);
                    folderItemsContainer.appendChild(button);
                });
            }

            function showGroups(folder, folderIndex) {
                currentFolderIndex = folderIndex;
                currentGroupIndex = null;
                currentCards = [];
                groupItemsContainer.innerHTML = '';
                cardItemsContainer.innerHTML = ''; // Golim cardurile la schimbarea grupului

                titleContainer.textContent = folder.name;  // Setăm titlul folderului

                folder.groups.forEach((group, index) => {
                    const button = document.createElement('button');
                    button.textContent = group.name;
                    button.onclick = () => showCards(group, folderIndex, index);
                    groupItemsContainer.appendChild(button);
                });

                // Ascundem folderele
                folderItemsContainer.style.display = 'none';
                groupItemsContainer.style.display = 'block';

                // Actualizăm URL-ul și istoricul cu pushState
                history.pushState({ page: 'groups', folderIndex: folderIndex }, folder.name, `?folder=${folderIndex}`);
            }

            function showCards(group, folderIndex, groupIndex) {
                currentGroupIndex = groupIndex;
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

                // Actualizăm URL-ul și istoricul cu pushState
                history.pushState({ page: 'cards', folderIndex: folderIndex, groupIndex: groupIndex }, group.name, `?folder=${folderIndex}&group=${groupIndex}`);
            }

            // Flip card on click
            function flipCard(card) {
                card.classList.toggle('flipped');
            }

            // Navigare înapoi la foldere
            window.backToFolders = function () {
                currentGroupIndex = null;
                currentCards = [];

                // Afișăm din nou folderele
                folderItemsContainer.style.display = 'block';
                groupItemsContainer.style.display = 'none';
                cardItemsContainer.style.display = 'none';
                titleContainer.textContent = 'Selectați un folder'; // Setăm titlul paginii principale

                // Actualizăm URL-ul și istoricul
                history.pushState({ page: 'folders' }, 'Foldere', `?`);
            };

            // Navigare înapoi la grupuri
            window.backToGroups = function () {
                currentGroupIndex = null;
                currentCards = [];

                // Afișăm din nou grupurile
                groupItemsContainer.style.display = 'block';
                cardItemsContainer.style.display = 'none';
                titleContainer.textContent = folders[currentFolderIndex].groups[currentGroupIndex].name; // Setăm titlul grupului

                // Actualizăm URL-ul și istoricul
                history.pushState({ page: 'groups', folderIndex: currentFolderIndex }, folders[currentFolderIndex].name, `?folder=${currentFolderIndex}`);
            };

            // Încarcă datele inițiale din URL
            function loadFromURL() {
                const params = new URLSearchParams(window.location.search);
                const folderIndex = params.get('folder');
                const groupIndex = params.get('group');

                if (folderIndex === null) {
                    // Dacă nu avem folderIndex în URL, înseamnă că suntem pe pagina de foldere
                    folderItemsContainer.style.display = 'block';
                    groupItemsContainer.style.display = 'none';
                    cardItemsContainer.style.display = 'none';
                    titleContainer.textContent = 'Selectați un folder';
                    createFolderButtons();

                    // Adăugăm starea inițială în istoricul browserului (pagina de foldere)
                    history.replaceState({ page: 'folders' }, 'Foldere', `?`);
                } else if (groupIndex === null) {
                    // Dacă avem doar folderIndex, înseamnă că suntem pe pagina de grupuri
                    showGroups(folders[folderIndex], folderIndex);
                } else {
                    // Dacă avem folderIndex și groupIndex, înseamnă că suntem pe pagina de carduri
                    showCards(folders[folderIndex].groups[groupIndex], folderIndex, groupIndex);
                }
            }

            // Încarcă datele la început
            loadFromURL();

            // Event listener pentru schimbarea istoriei browserului
            window.addEventListener('popstate', function(event) {
                if (event.state) {
                    if (event.state.page === 'folders') {
                        folderItemsContainer.style.display = 'block';
                        groupItemsContainer.style.display = 'none';
                        cardItemsContainer.style.display = 'none';
                        titleContainer.textContent = 'Selectați un folder';
                        createFolderButtons();
                    } else if (event.state.page === 'groups') {
                        showGroups(folders[event.state.folderIndex], event.state.folderIndex);
                    } else if (event.state.page === 'cards') {
                        showCards(folders[event.state.folderIndex].groups[event.state.groupIndex], event.state.folderIndex, event.state.groupIndex);
                    }
                }
            });
        });
});

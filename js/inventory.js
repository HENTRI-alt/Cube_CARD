// Система инвентаря
let currentFilter = 'all';

// Отображение инвентаря
function renderInventory() {
    const gameState = loadGame();
    const inventoryGrid = document.getElementById('inventory-grid');
    
    if (!inventoryGrid) return;
    
    inventoryGrid.innerHTML = '';
    
    const filteredItems = gameState.inventory.filter(item => {
        if (currentFilter === 'all') return true;
        return item.rarity === currentFilter;
    });
    
    if (filteredItems.length === 0) {
        inventoryGrid.innerHTML = '<p class="empty-inventory">Инвентарь пуст</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `inventory-item ${item.rarity}`;
        itemElement.innerHTML = `
            <div class="card-image">${item.name}</div>
            <div class="card-count">×${item.count}</div>
            <div class="card-value">💰 ${item.value}</div>
            <button class="sell-btn" onclick="sellCard(${item.id})">
                Продать (${Math.floor(item.value * 0.5)})
            </button>
        `;
        
        inventoryGrid.appendChild(itemElement);
    });
}

// Продажа карты
function sellCard(cardId) {
    const gameState = loadGame();
    const cardIndex = gameState.inventory.findIndex(item => item.id === cardId);
    
    if (cardIndex === -1) return;
    
    const card = gameState.inventory[cardIndex];
    const sellValue = Math.floor(card.value * 0.5);
    
    if (card.count > 1) {
        card.count -= 1;
    } else {
        gameState.inventory.splice(cardIndex, 1);
    }
    
    gameState.coins += sellValue;
    
    if (saveGame(gameState)) {
        updateCoinDisplay();
        renderInventory();
        showModal(`Продано: ${card.name} за ${sellValue} монет!`);
    }
}

// Фильтрация инвентаря
function setupInventoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            currentFilter = button.dataset.filter;
            renderInventory();
        });
    });
}

// Получение общей стоимости инвентаря
function getInventoryValue() {
    const gameState = loadGame();
    return gameState.inventory.reduce((total, item) => {
        return total + (item.value * item.count);
    }, 0);
}
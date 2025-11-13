// Система инвентаря карт
console.log("Inventory.js loaded!");

let currentFilter = 'all';

// Отображение инвентаря
window.renderInventory = function() {
    const gameState = loadGame();
    const inventoryGrid = document.getElementById('inventory-grid');
    
    if (!inventoryGrid) {
        console.log("Inventory grid not found");
        return;
    }
    
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
            <div class="card-image">${item.emoji}</div>
            <div class="card-name">${item.name}</div>
            <div class="card-count">×${item.count}</div>
            <div class="card-value">💰 ${item.value}</div>
            <button class="sell-btn" onclick="sellCard(${item.id})">
                Продать (${Math.floor(item.value * 0.5)})
            </button>
        `;
        
        inventoryGrid.appendChild(itemElement);
    });
    
    console.log("Inventory rendered with", filteredItems.length, "items");
}

// Продажа карты
window.sellCard = function(cardId) {
    const gameState = loadGame();
    const cardIndex = gameState.inventory.findIndex(item => item.id === cardId);
    
    if (cardIndex === -1) {
        console.log("Card not found for selling");
        return;
    }
    
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
        console.log("Card sold:", card.name);
    }
}

// Установка фильтра
window.setFilter = function(filter) {
    currentFilter = filter;
    
    // Обновляем активные кнопки
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderInventory();
    console.log("Filter set to:", filter);
}

// Фильтрация инвентаря
window.setupInventoryFilters = function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setFilter(filter);
        });
    });
    
    console.log("Inventory filters setup");
}

// Получение общей стоимости инвентаря
window.getInventoryValue = function() {
    const gameState = loadGame();
    return gameState.inventory.reduce((total, item) => {
        return total + (item.value * item.count);
    }, 0);
}
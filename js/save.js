// Система сохранения
const SAVE_KEY = 'cardSimulatorSave';

// Стандартное состояние игры
const defaultGameState = {
    coins: 1000,
    inventory: [],
    stats: {
        packsOpened: 0,
        cardsFound: 0,
        moneySpent: 0,
        rareCardsFound: 0,
        epicCardsFound: 0,
        legendaryCardsFound: 0
    },
    achievements: [],
    settings: {
        sound: true,
        music: true
    }
};

// Загрузка игры
function loadGame() {
    try {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (saveData) {
            return JSON.parse(saveData);
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
    
    // Если нет сохранения, создаем новое
    const newGame = JSON.parse(JSON.stringify(defaultGameState));
    saveGame(newGame);
    return newGame;
}

// Сохранение игры
function saveGame(gameState) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}

// Добавление карты в инвентарь
function addCardToInventory(card) {
    const gameState = loadGame();
    
    // Ищем карту в инвентаре
    const existingCard = gameState.inventory.find(item => item.id === card.id);
    
    if (existingCard) {
        existingCard.count += 1;
    } else {
        gameState.inventory.push({
            ...card,
            count: 1,
            obtained: new Date().toISOString()
        });
    }
    
    // Обновляем статистику
    gameState.stats.cardsFound += 1;
    if (card.rarity === 'rare') gameState.stats.rareCardsFound += 1;
    if (card.rarity === 'epic') gameState.stats.epicCardsFound += 1;
    if (card.rarity === 'legendary') gameState.stats.legendaryCardsFound += 1;
    
    saveGame(gameState);
    return gameState;
}

// Обновление монет
function updateCoins(amount) {
    const gameState = loadGame();
    gameState.coins += amount;
    
    if (amount < 0) {
        gameState.stats.moneySpent += Math.abs(amount);
    }
    
    saveGame(gameState);
    return gameState.coins;
}

// Получение текущего баланса
function getCoins() {
    const gameState = loadGame();
    return gameState.coins;
}

// Сброс игры
function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    return loadGame();
}
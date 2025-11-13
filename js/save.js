// Система сохранения
console.log("Save.js loaded!");

const SAVE_KEY = 'cardSimulatorSave';

// Стандартное состояние игры
const defaultGameState = {
    coins: 1000,
    inventory: [],
    unopenedPacks: [], // Добавляем пустой массив паков
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
            const gameState = JSON.parse(saveData);
            
            // Гарантируем что unopenedPacks существует
            if (!gameState.unopenedPacks) {
                gameState.unopenedPacks = [];
            }
            
            console.log("Game loaded:", gameState);
            return gameState;
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
        // Гарантируем что unopenedPacks существует перед сохранением
        if (!gameState.unopenedPacks) {
            gameState.unopenedPacks = [];
        }
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        console.log("Game saved with packs:", gameState.unopenedPacks);
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}

// Добавление карты в инвентарь
function addCardToInventory(card) {
    const gameState = loadGame();
    
    // Гарантируем что inventory существует
    if (!gameState.inventory) {
        gameState.inventory = [];
    }
    
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
    if (!gameState.stats) gameState.stats = defaultGameState.stats;
    gameState.stats.cardsFound += 1;
    if (card.rarity === 'rare') gameState.stats.rareCardsFound += 1;
    if (card.rarity === 'epic') gameState.stats.epicCardsFound += 1;
    if (card.rarity === 'legendary') gameState.stats.legendaryCardsFound += 1;
    
    saveGame(gameState);
    return gameState;
}

// Добавляем пак в инвентарь
function addPackToInventory(packType) {
    const gameState = loadGame();
    
    // Гарантируем что unopenedPacks существует
    if (!gameState.unopenedPacks) {
        gameState.unopenedPacks = [];
    }
    
    const pack = {
        id: Date.now(), // уникальный ID
        type: packType,
        cardsRemaining: 5, // 5 карт в паке
        cost: packType === 'premium' ? 500 : 100,
        createdAt: new Date().toISOString()
    };
    
    gameState.unopenedPacks.push(pack);
    saveGame(gameState);
    console.log("Pack added to inventory:", pack);
    return gameState;
}

// Открываем одну карту из пака
function openCardFromPack(packId) {
    const gameState = loadGame();
    
    // Гарантируем что unopenedPacks существует
    if (!gameState.unopenedPacks) {
        gameState.unopenedPacks = [];
        return null;
    }
    
    const pack = gameState.unopenedPacks.find(p => p.id === packId);
    
    if (!pack || pack.cardsRemaining <= 0) {
        console.log("Pack not found or empty");
        return null;
    }
    
    // Получаем карту
    const card = getRandomCard(pack.type);
    
    // Добавляем карту в инвентарь
    addCardToInventory(card);
    
    // Уменьшаем количество карт в паке
    pack.cardsRemaining -= 1;
    
    // Если пак пустой, удаляем его
    if (pack.cardsRemaining <= 0) {
        gameState.unopenedPacks = gameState.unopenedPacks.filter(p => p.id !== packId);
        console.log("Pack completed and removed");
    }
    
    saveGame(gameState);
    console.log("Card opened from pack:", card);
    return card;
}

// Получаем непокрытые паки
function getUnopenedPacks() {
    const gameState = loadGame();
    
    // Гарантируем что unopenedPacks существует
    if (!gameState.unopenedPacks) {
        gameState.unopenedPacks = [];
        saveGame(gameState);
    }
    
    return gameState.unopenedPacks || [];
}

// Обновление монет
function updateCoins(amount) {
    const gameState = loadGame();
    gameState.coins += amount;
    
    if (amount < 0) {
        if (!gameState.stats) gameState.stats = defaultGameState.stats;
        gameState.stats.moneySpent += Math.abs(amount);
    }
    
    saveGame(gameState);
    console.log("Coins updated:", gameState.coins);
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
    console.log("Game reset");
    return loadGame();
}

// Исправляем существующее сохранение
function fixExistingSave() {
    const gameState = loadGame();
    let needsFix = false;
    
    if (!gameState.unopenedPacks) {
        gameState.unopenedPacks = [];
        needsFix = true;
    }
    
    if (!gameState.inventory) {
        gameState.inventory = [];
        needsFix = true;
    }
    
    if (!gameState.stats) {
        gameState.stats = defaultGameState.stats;
        needsFix = true;
    }
    
    if (needsFix) {
        saveGame(gameState);
        console.log("Save file fixed");
    }
    
    return gameState;
}

// Объявляем функции глобально
window.loadGame = loadGame;
window.saveGame = saveGame;
window.addCardToInventory = addCardToInventory;
window.addPackToInventory = addPackToInventory;
window.openCardFromPack = openCardFromPack;
window.getUnopenedPacks = getUnopenedPacks;
window.updateCoins = updateCoins;
window.getCoins = getCoins;
window.resetGame = resetGame;
window.fixExistingSave = fixExistingSave;

// Исправляем существующее сохранение при загрузке
fixExistingSave();
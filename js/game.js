// Основная игровая логика
console.log("Game.js loaded!");

// Текущая карта для открытия
window.currentCard = null;

// Покупка пака
// Покупка пака
window.buyPack = function(packType, cost) {
    console.log("Buy pack called:", packType, cost);
    const currentCoins = getCoins();
    
    // Проверка баланса
    if (currentCoins < cost) {
        showModal('❌ Недостаточно монет!');
        console.log("Not enough coins");
        return;
    }
    
    // Списываем монеты
    updateCoins(-cost);
    updateCoinDisplay();
    
    // Добавляем пак в инвентарь (а не открываем сразу)
    addPackToInventory(packType);
    
    // Обновляем статистику
    const gameState = loadGame();
    gameState.stats.packsOpened += 1;
    saveGame(gameState);
    
    // Обновляем отображение паков
    updatePacksDisplay();
    
    // Показываем уведомление
    let message = `📦 Базовый пак добавлен в инвентарь!`;
    if (packType === 'premium') {
        message = `💎 Премиум пак добавлен в инвентарь!`;
    }
    showModal(message);
    
    console.log("Pack purchased successfully:", packType);
    
    // Проверяем что пак добавился
    setTimeout(() => {
        const packs = getUnopenedPacks();
        console.log("Current packs after purchase:", packs);
    }, 100);
}

// Инициализация игры
function initGame() {
    console.log("=== GAME INITIALIZATION ===");
    
    // Загружаем сохранение
    const gameState = loadGame();
    console.log("Game state loaded:", gameState);
    
    // Инициализируем UI
    initUI();
    
    // Обновляем отображение паков
    updatePacksDisplay();
    
    console.log("=== GAME READY ===");
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    setTimeout(initGame, 100);
});

// Отладка и утилиты
window.debug = {
    // Сброс игры
    resetGame: function() {
        if (confirm('Точно сбросить весь прогресс?')) {
            resetGame();
            location.reload();
        }
    },
    
    // Добавить монеты
    addCoins: function(amount = 1000) {
        updateCoins(amount);
        updateCoinDisplay();
        showModal(`🪙 Добавлено ${amount} монет!`);
    },
    
    // Получить состояние игры
    getState: function() {
        return loadGame();
    },
    
    // Добавить тестовые паки
    addTestPacks: function() {
        addPackToInventory('basic');
        addPackToInventory('premium');
        updatePacksDisplay();
        showModal('📦 Тестовые паки добавлены!');
    },
    
    // Показать всю статистику
    showStats: function() {
        const state = loadGame();
        console.log("=== GAME STATS ===");
        console.log("Монеты:", state.coins);
        console.log("Карты в инвентаре:", state.inventory.length);
        console.log("Паки:", state.unopenedPacks.length);
        console.log("Открыто паков:", state.stats.packsOpened);
        console.log("Найдено карт:", state.stats.cardsFound);
        console.log("===================");
        
        let statsMessage = `
🎮 Статистика игры:
🪙 Монеты: ${state.coins}
🎴 Карты: ${state.inventory.length}
📦 Паки: ${state.unopenedPacks.length}
📊 Открыто паков: ${state.stats.packsOpened}
        `.trim();
        
        showModal(statsMessage, 5000);
    }
};

// Глобальные хелперы
window.getGameState = loadGame;
window.refreshUI = function() {
    updateCoinDisplay();
    updatePacksDisplay();
    console.log("UI refreshed");
};
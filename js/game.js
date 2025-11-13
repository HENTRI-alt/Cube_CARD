// Основная игровая логика

// Текущая карта для открытия
window.currentCard = null;

// Объявляем функции глобально
window.buyPack = function(packType, cost) {
    const currentCoins = getCoins();
    
    // Проверка баланса
    if (currentCoins < cost) {
        showModal('Недостаточно монет!');
        return;
    }
    
    // Списываем монеты
    const newCoins = updateCoins(-cost);
    updateCoinDisplay();
    
    // Получаем случайную карту
    const card = getRandomCard(packType);
    window.currentCard = card;
    
    // Добавляем в инвентарь
    addCardToInventory(card);
    
    // Обновляем статистику
    const gameState = loadGame();
    gameState.stats.packsOpened += 1;
    saveGame(gameState);
    
    // Переходим на экран открытия
    showScreen('opening-screen');
    
    // Сбрасываем анимацию карты
    const cardElement = document.getElementById('card-preview');
    if (cardElement) {
        cardElement.classList.add('hidden');
        cardElement.classList.remove('flipped');
    }
    
    showModal(`Пак куплен за ${cost} монет!`);
}

// Инициализация игры
function initGame() {
    // Загружаем сохранение
    loadGame();
    
    // Инициализируем UI
    initUI();
    
    // Показываем приветствие
    setTimeout(() => {
        showModal('Добро пожаловать в Карточный Симулятор!');
    }, 1000);
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Отладка (можно удалить в продакшене)
window.debug = {
    resetGame: () => {
        resetGame();
        location.reload();
    },
    addCoins: (amount) => {
        updateCoins(amount);
        updateCoinDisplay();
    },
    getState: () => loadGame()
};
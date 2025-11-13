// Основная игровая логика
console.log("Game.js loaded!");

// Текущая карта для открытия
window.currentCard = null;

// Покупка пака
window.buyPack = function(packType, cost) {
    console.log("Buy pack called:", packType, cost);
    const currentCoins = getCoins();
    
    // Проверка баланса
    if (currentCoins < cost) {
        showModal('Недостаточно монет!');
        return;
    }
    
    // Списываем монеты
    updateCoins(-cost);
    updateCoinDisplay();
    
    // Получаем случайную карту
    const card = getRandomCard(packType);
    window.currentCard = card;
    console.log("Got card:", card);
    
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
    console.log("Initializing game...");
    
    // Загружаем сохранение
    loadGame();
    
    // Инициализируем UI
    initUI();
    
    // Тестируем кнопки
    testButtons();
    
    // Показываем приветствие
    setTimeout(() => {
        showModal('Добро пожаловать в Карточный Симулятор!');
    }, 1000);
}

// Тестирование кнопок
function testButtons() {
    console.log("Testing buttons...");
    
    const buyButtons = document.querySelectorAll('.buy-pack');
    console.log("Found buy buttons:", buyButtons.length);
    
    const inventoryBtn = document.getElementById('inventory-btn');
    console.log("Inventory button:", inventoryBtn);
    
    // Принудительно перепривязываем обработчики
    buyButtons.forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const packElement = e.target.closest('.pack');
            const packType = packElement.classList.contains('premium-pack') ? 'premium' : 'basic';
            const cost = parseInt(packElement.dataset.cost);
            console.log("Button clicked directly!", packType, cost);
            buyPack(packType, cost);
        };
    });
    
    if (inventoryBtn) {
        inventoryBtn.onclick = function() {
            console.log("Inventory button clicked directly!");
            showScreen('inventory-screen');
            renderInventory();
        };
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded!");
    initGame();
});

// Глобальные функции для отладки
window.debugGame = initGame;
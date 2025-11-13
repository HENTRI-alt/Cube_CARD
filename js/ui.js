// Управление интерфейсом

// Переключение экранов
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Обновление отображения монет
function updateCoinDisplay() {
    const coinsElement = document.getElementById('coins');
    if (coinsElement) {
        coinsElement.textContent = getCoins();
    }
}

// Показ модального окна
function showModal(message, duration = 3000) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    
    if (modal && modalText) {
        modalText.textContent = message;
        modal.classList.remove('hidden');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, duration);
    }
}

// Анимация открытия карты
function animateCardOpening(card) {
    const cardElement = document.getElementById('card-preview');
    const cardImage = document.getElementById('card-image');
    const cardName = document.getElementById('card-name');
    const cardRarity = document.getElementById('card-rarity');
    
    if (!cardElement) return;
    
    // Сбрасываем анимацию
    cardElement.classList.remove('flipped', 'shake', 'glow');
    cardElement.classList.remove('common', 'rare', 'epic', 'legendary');
    
    // Устанавливаем данные карты
    cardImage.src = card.image;
    cardImage.alt = card.name;
    cardName.textContent = card.name;
    cardRarity.textContent = card.rarity.toUpperCase();
    cardRarity.style.color = getRarityColor(card.rarity);
    
    // Добавляем класс редкости
    cardElement.classList.add(card.rarity);
    
    // Показываем карту
    cardElement.classList.remove('hidden');
    
    // Запускаем анимации
    setTimeout(() => {
        cardElement.classList.add('shake');
        
        setTimeout(() => {
            cardElement.classList.add('flipped');
            
            // Если карта редкая или выше - добавляем свечение
            if (card.rarity !== 'common') {
                setTimeout(() => {
                    cardElement.classList.add('glow');
                }, 300);
            }
            
            // Показываем сообщение
            let message = `Вы получили: ${card.name}!`;
            if (card.rarity === 'legendary') {
                message = `🎉 ЛЕГЕНДАРНО! ${card.name}! 🎉`;
            } else if (card.rarity === 'epic') {
                message = `✨ ЭПИЧЕСКАЯ КАРТА! ${card.name}!`;
            } else if (card.rarity === 'rare') {
                message = `⭐ РЕДКАЯ КАРТА! ${card.name}`;
            }
            
            showModal(message);
            
        }, 1000);
    }, 100);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    document.getElementById('inventory-btn')?.addEventListener('click', () => {
        showScreen('inventory-screen');
        renderInventory();
    });
    
    document.getElementById('back-from-inventory')?.addEventListener('click', () => {
        showScreen('main-screen');
    });
    
    document.getElementById('back-to-main')?.addEventListener('click', () => {
        showScreen('main-screen');
    });
    
    // Покупка паков
    document.querySelectorAll('.buy-pack').forEach(button => {
        button.addEventListener('click', (e) => {
            const packElement = e.target.closest('.pack');
            const packType = packElement.classList.contains('premium-pack') ? 'premium' : 'basic';
            const cost = parseInt(packElement.dataset.cost);
            
            buyPack(packType, cost);
        });
    });
    
    // Открытие карты
    document.getElementById('reveal-card')?.addEventListener('click', () => {
        const currentCard = window.currentCard;
        if (currentCard) {
            animateCardOpening(currentCard);
        }
    });
    
    // Закрытие модального окна
    document.querySelector('.close')?.addEventListener('click', () => {
        document.getElementById('modal').classList.add('hidden');
    });
}

// Инициализация UI
function initUI() {
    updateCoinDisplay();
    setupEventListeners();
    setupInventoryFilters();
    
    // Показываем главный экран
    showScreen('main-screen');
}
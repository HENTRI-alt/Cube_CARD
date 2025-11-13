// Управление интерфейсом
console.log("UI.js loaded!");

// Переключение экранов
window.showScreen = function(screenId) {
    console.log("Showing screen:", screenId);
    
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.add('fade-in');
        
        // Убираем анимацию после завершения
        setTimeout(() => {
            targetScreen.classList.remove('fade-in');
        }, 300);
    }
    
    // При переходе на главный экран сбрасываем текущий пак
    if (screenId === 'main-screen') {
        window.currentPack = null;
        updateNextCardButton();
    }
}

// Обновление отображения монет
window.updateCoinDisplay = function() {
    const coinsElement = document.getElementById('coins');
    if (coinsElement) {
        coinsElement.textContent = getCoins();
        coinsElement.classList.add('pulse');
        
        setTimeout(() => {
            coinsElement.classList.remove('pulse');
        }, 500);
    }
}

// Показ модального окна
window.showModal = function(message, duration = 3000) {
    console.log("Show modal:", message);
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    
    if (modal && modalText) {
        modalText.textContent = message;
        modal.classList.remove('hidden');
        modal.classList.add('fade-in');
        
        if (duration > 0) {
            setTimeout(() => {
                closeModal();
            }, duration);
        }
    }
}

// Закрытие модального окна
window.closeModal = function() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Анимация открытия карты
window.animateCardOpening = function(card) {
    console.log("Animating card opening:", card);
    const cardElement = document.getElementById('card-preview');
    const cardImage = document.getElementById('card-image');
    const cardName = document.getElementById('card-name');
    const cardRarity = document.getElementById('card-rarity');
    
    if (!cardElement) {
        console.log("Card element not found");
        return;
    }
    
    // Сбрасываем анимацию
    cardElement.classList.remove('flipped', 'shake', 'glow', 'bounce');
    cardElement.classList.remove('common', 'rare', 'epic', 'legendary');
    
    // Устанавливаем данные карты
    cardImage.textContent = card.emoji;
    cardImage.className = 'card-image';
    cardName.textContent = card.name;
    cardRarity.textContent = card.rarity.toUpperCase();
    cardRarity.style.color = getRarityColor(card.rarity);
    
    // Добавляем класс редкости
    cardElement.classList.add(card.rarity);
    
    // Показываем карту
    cardElement.classList.remove('hidden');
    cardElement.classList.add('slide-in');
    
    console.log("Starting card animation sequence");
    
    // Запускаем анимации
    setTimeout(() => {
        cardElement.classList.add('shake');
        console.log("Shake animation started");
        
        setTimeout(() => {
            cardElement.classList.add('flipped');
            console.log("Card flipped");
            
            // Если карта редкая или выше - добавляем свечение
            if (card.rarity !== 'common') {
                setTimeout(() => {
                    cardElement.classList.add('glow');
                    console.log("Glow animation started for", card.rarity);
                }, 300);
            }
            
            // Легендарные карты получают дополнительную анимацию
            if (card.rarity === 'legendary') {
                cardElement.classList.add('bounce');
            }
            
            // Показываем сообщение
            let message = `🎉 Вы получили: ${card.name}!`;
            if (card.rarity === 'legendary') {
                message = `🏆 ЛЕГЕНДАРНО! ${card.name}! 🏆`;
            } else if (card.rarity === 'epic') {
                message = `✨ ЭПИЧЕСКАЯ КАРТА! ${card.name}!`;
            } else if (card.rarity === 'rare') {
                message = `⭐ РЕДКАЯ КАРТА! ${card.name}`;
            }
            
            showModal(message, 4000);
            console.log("Modal shown:", message);
            
            // Обновляем кнопку следующей карты после анимации
            setTimeout(() => {
                updateNextCardButton();
            }, 1000);
            
        }, 1000);
    }, 100);
}

// Открытие карты
window.revealCard = function() {
    const currentCard = window.currentCard;
    if (currentCard) {
        animateCardOpening(currentCard);
    } else {
        showModal('❌ Нет карты для открытия!');
        console.log("No card to reveal");
    }
}

// Настройка обработчиков событий
window.setupEventListeners = function() {
    console.log("Setting up event listeners...");
    
    // Закрытие модального окна по клику вне его
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие модального окна по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    console.log("Event listeners setup completed");
}

// Инициализация UI
window.initUI = function() {
    console.log("Initializing UI...");
    updateCoinDisplay();
    setupEventListeners();
    updatePacksDisplay();
    
    // Показываем главный экран
    showScreen('main-screen');
    
    console.log("UI initialization completed");
}
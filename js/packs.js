// Система паков
console.log("Packs.js loaded!");

// Текущий открываемый пак
window.currentPack = null;

// Отображение паков в инвентаре
window.renderPacks = function() {
    console.log("renderPacks called");
    const packsGrid = document.getElementById('packs-grid');
    const unopenedPacks = getUnopenedPacks();
    
    console.log("Unopened packs:", unopenedPacks);
    console.log("Packs grid element:", packsGrid);
    
    if (!packsGrid) {
        console.log("Packs grid not found");
        return;
    }
    
    packsGrid.innerHTML = '';
    
    if (unopenedPacks.length === 0) {
        packsGrid.innerHTML = '<p class="empty-inventory">📭 У вас нет паков</p>';
        console.log("No packs to display");
        return;
    }
    
    console.log("Displaying", unopenedPacks.length, "packs");
    
    unopenedPacks.forEach(pack => {
        console.log("Creating pack element:", pack);
        const packElement = document.createElement('div');
        packElement.className = `pack-item ${pack.type}`;
        packElement.innerHTML = `
            <div class="pack-item-icon">${pack.type === 'premium' ? '💎' : '📦'}</div>
            <h3>${pack.type === 'premium' ? 'Премиум пак' : 'Базовый пак'}</h3>
            <div class="pack-item-info">
                <div class="cards-remaining">🎴 Карт: ${pack.cardsRemaining}/5</div>
                <div class="pack-cost">💰 Стоимость: ${pack.cost}</div>
            </div>
            <button class="open-pack-btn" onclick="openPack(${pack.id})">
                Открыть карту
            </button>
        `;
        
        packsGrid.appendChild(packElement);
    });
}

// Открытие карты из пака
window.openPack = function(packId) {
    console.log("Opening pack:", packId);
    
    // Сохраняем текущий пак
    const unopenedPacks = getUnopenedPacks();
    window.currentPack = unopenedPacks.find(p => p.id === packId);
    
    if (!window.currentPack) {
        showModal('❌ Пак не найден!');
        console.log("Pack not found");
        return;
    }
    
    const card = openCardFromPack(packId);
    
    if (card) {
        // Переходим на экран открытия
        showScreen('opening-screen');
        window.currentCard = card;
        
        // Сбрасываем анимацию карты
        const cardElement = document.getElementById('card-preview');
        if (cardElement) {
            cardElement.classList.add('hidden');
            cardElement.classList.remove('flipped');
        }
        
        // Показываем/скрываем кнопку следующей карты
        updateNextCardButton();
        
        console.log("Card opened from pack:", card);
    } else {
        showModal('❌ Пак пустой или не найден!');
        console.log("Failed to open pack");
    }
}

// Открытие следующей карты из текущего пака
window.openNextCard = function() {
    if (!window.currentPack) {
        showModal('❌ Нет активного пака!');
        return;
    }
    
    console.log("Opening next card from pack:", window.currentPack.id);
    const card = openCardFromPack(window.currentPack.id);
    
    if (card) {
        window.currentCard = card;
        
        // Сбрасываем анимацию карты
        const cardElement = document.getElementById('card-preview');
        if (cardElement) {
            cardElement.classList.add('hidden');
            cardElement.classList.remove('flipped');
        }
        
        // Обновляем отображение паков
        renderPacks();
        
        // Показываем/скрываем кнопку следующей карты
        updateNextCardButton();
        
        console.log("Next card opened:", card);
    } else {
        showModal('🎉 Все карты из пака открыты!');
        window.currentPack = null;
        updateNextCardButton();
    }
}

// Обновление кнопки следующей карты
window.updateNextCardButton = function() {
    const nextCardBtn = document.getElementById('next-card-btn');
    const openCardBtn = document.getElementById('reveal-card');
    
    if (!window.currentPack) {
        if (nextCardBtn) nextCardBtn.classList.add('hidden');
        if (openCardBtn) openCardBtn.textContent = 'Открыть карту';
        return;
    }
    
    // Проверяем остались ли карты в паке
    const unopenedPacks = getUnopenedPacks();
    const currentPack = unopenedPacks.find(p => p.id === window.currentPack.id);
    
    if (currentPack && currentPack.cardsRemaining > 0) {
        if (nextCardBtn) {
            nextCardBtn.classList.remove('hidden');
            nextCardBtn.textContent = `Следующая карта (${currentPack.cardsRemaining} осталось)`;
        }
        if (openCardBtn) openCardBtn.textContent = 'Открыть карту';
    } else {
        if (nextCardBtn) nextCardBtn.classList.add('hidden');
        if (openCardBtn) openCardBtn.textContent = 'Открыть карту';
        window.currentPack = null;
    }
}

// Обновление отображения паков на главном экране
window.updatePacksDisplay = function() {
    const unopenedPacks = getUnopenedPacks();
    const packsCount = unopenedPacks.length;
    
    console.log("Updating packs display:", packsCount, "packs");
    
    // Обновляем кнопку паков
    const packsBtn = document.getElementById('packs-btn');
    if (packsBtn) {
        if (packsCount > 0) {
            packsBtn.innerHTML = `📦 Мои паки <span style="background: red; border-radius: 50%; padding: 2px 6px; font-size: 0.8em; margin-left: 5px;">${packsCount}</span>`;
            packsBtn.classList.add('has-packs');
        } else {
            packsBtn.innerHTML = `📦 Мои паки`;
            packsBtn.classList.remove('has-packs');
        }
    }
}

// Принудительное обновление интерфейса
window.forceUpdatePacks = function() {
    console.log("Force updating packs...");
    updatePacksDisplay();
    renderPacks();
}

// Добавляем стиль для кнопки с паками
const style = document.createElement('style');
style.textContent = `
    .nav-btn.has-packs {
        background: linear-gradient(135deg, #4CAF50, #45a049) !important;
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);

console.log("Packs system initialized");
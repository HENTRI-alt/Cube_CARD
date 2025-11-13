// Система паков
console.log("Packs.js loaded!");

// Отображение паков в инвентаре
window.renderPacks = function() {
    const packsGrid = document.getElementById('packs-grid');
    const unopenedPacks = getUnopenedPacks();
    
    if (!packsGrid) {
        console.log("Packs grid not found");
        return;
    }
    
    packsGrid.innerHTML = '';
    
    if (unopenedPacks.length === 0) {
        packsGrid.innerHTML = '<p class="empty-inventory">📭 У вас нет паков</p>';
        return;
    }
    
    unopenedPacks.forEach(pack => {
        const packElement = document.createElement('div');
        packElement.className = `pack-item ${pack.type}`;
        packElement.innerHTML = `
            <div class="pack-item-icon">${pack.type === 'premium' ? '💎' : '📦'}</div>
            <h3>${pack.type === 'premium' ? 'Премиум пак' : 'Базовый пак'}</h3>
            <div class="pack-item-info">
                <div class="cards-remaining">🎴 Карт: ${pack.cardsRemaining}/5</div>
                <div class="pack-cost">💰 ${pack.cost}</div>
            </div>
            <button class="open-pack-btn" onclick="openPack(${pack.id})">
                Открыть карту
            </button>
        `;
        
        packsGrid.appendChild(packElement);
    });
    
    console.log("Packs rendered:", unopenedPacks.length);
}

// Открытие карты из пака
window.openPack = function(packId) {
    console.log("Opening pack:", packId);
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
        
        // Обновляем отображение паков
        renderPacks();
        
        console.log("Card opened from pack:", card);
    } else {
        showModal('❌ Пак пустой или не найден!');
        console.log("Failed to open pack");
    }
}

// Обновление отображения паков на главном экране
window.updatePacksDisplay = function() {
    const unopenedPacks = getUnopenedPacks();
    const packsCount = unopenedPacks.length;
    
    // Обновляем кнопку паков
    const packsBtn = document.getElementById('packs-btn');
    if (packsBtn) {
        if (packsCount > 0) {
            packsBtn.textContent = `📦 Паки (${packsCount})`;
            packsBtn.classList.add('has-packs');
        } else {
            packsBtn.textContent = `📦 Мои паки`;
            packsBtn.classList.remove('has-packs');
        }
    }
    
    console.log("Packs display updated:", packsCount);
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
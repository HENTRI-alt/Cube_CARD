// Система настроек
console.log("Settings.js loaded!");

// Показать настройки
window.showSettings = function() {
    console.log("Showing settings");
    const settingsModal = document.getElementById('settings-modal');
    const soundToggle = document.getElementById('sound-toggle');
    const musicToggle = document.getElementById('music-toggle');
    
    if (settingsModal && soundToggle && musicToggle) {
        // Загружаем текущие настройки
        const gameState = loadGame();
        
        // Устанавливаем переключатели
        soundToggle.checked = gameState.settings.sound;
        musicToggle.checked = gameState.settings.music;
        
        // Обновляем статистику
        updateSettingsStats();
        
        // Показываем модальное окно
        settingsModal.classList.remove('hidden');
        settingsModal.classList.add('fade-in');
    }
}

// Закрыть настройки
window.closeSettings = function() {
    console.log("Closing settings");
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        settingsModal.classList.add('hidden');
    }
}

// Обновить статистику в настройках
window.updateSettingsStats = function() {
    const gameState = loadGame();
    const totalCards = document.getElementById('total-cards');
    const totalPacks = document.getElementById('total-packs');
    
    if (totalCards) {
        totalCards.textContent = gameState.inventory.length;
    }
    
    if (totalPacks) {
        totalPacks.textContent = gameState.stats.packsOpened;
    }
}

// Сброс прогресса
window.resetProgress = function() {
    console.log("Reset progress requested");
    const confirmModal = document.getElementById('confirm-reset-modal');
    if (confirmModal) {
        confirmModal.classList.remove('hidden');
        confirmModal.classList.add('fade-in');
    }
}

// Подтверждение сброса
window.confirmReset = function() {
    console.log("Resetting progress...");
    
    // Сбрасываем игру
    resetGame();
    
    // Закрываем модальные окна
    closeSettings();
    const confirmModal = document.getElementById('confirm-reset-modal');
    if (confirmModal) {
        confirmModal.classList.add('hidden');
    }
    
    // Показываем сообщение
    showModal('✅ Прогресс сброшен! Игра перезагружается...');
    
    // Перезагружаем страницу
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// Отмена сброса
window.cancelReset = function() {
    console.log("Reset cancelled");
    const confirmModal = document.getElementById('confirm-reset-modal');
    if (confirmModal) {
        confirmModal.classList.add('hidden');
    }
}

// Сохранение настроек звука
window.saveSoundSettings = function() {
    const soundToggle = document.getElementById('sound-toggle');
    const musicToggle = document.getElementById('music-toggle');
    
    if (soundToggle && musicToggle) {
        const gameState = loadGame();
        gameState.settings.sound = soundToggle.checked;
        gameState.settings.music = musicToggle.checked;
        saveGame(gameState);
        console.log("Sound settings saved:", gameState.settings);
    }
}

// Инициализация настроек
window.initSettings = function() {
    console.log("Initializing settings...");
    
    // Назначаем обработчики для переключателей
    const soundToggle = document.getElementById('sound-toggle');
    const musicToggle = document.getElementById('music-toggle');
    
    if (soundToggle) {
        soundToggle.addEventListener('change', saveSoundSettings);
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('change', saveSoundSettings);
    }
    
    // Закрытие по клику вне окна
    document.addEventListener('click', function(event) {
        const settingsModal = document.getElementById('settings-modal');
        const confirmModal = document.getElementById('confirm-reset-modal');
        
        if (event.target === settingsModal) {
            closeSettings();
        }
        
        if (event.target === confirmModal) {
            cancelReset();
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeSettings();
            cancelReset();
        }
    });
    
    console.log("Settings initialized");
}
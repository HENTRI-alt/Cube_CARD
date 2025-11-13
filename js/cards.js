// Система карт
console.log("Cards.js loaded!");

const cards = {
    common: [
        { 
            id: 1, 
            name: "Обычный ромб", 
            emoji: "💎",
            rarity: "common", 
            value: 10,
            description: "Базовый кристалл"
        },
        { 
            id: 2, 
            name: "Каменный блок", 
            emoji: "🪨",
            rarity: "common", 
            value: 8,
            description: "Прочный материал"
        },
        { 
            id: 3, 
            name: "Деревяшка", 
            emoji: "🪵",
            rarity: "common", 
            value: 6,
            description: "Обычное дерево"
        },
        { 
            id: 4, 
            name: "Стекляшка", 
            emoji: "🔮",
            rarity: "common", 
            value: 7,
            description: "Прозрачный осколок"
        }
    ],
    rare: [
        { 
            id: 101, 
            name: "Золотой ромб", 
            emoji: "💠",
            rarity: "rare", 
            value: 100,
            description: "Блестящий кристалл"
        },
        { 
            id: 102, 
            name: "Серебряный шар", 
            emoji: "⚪",
            rarity: "rare", 
            value: 80,
            description: "Магическая сфера"
        },
        { 
            id: 103, 
            name: "Медный слиток", 
            emoji: "🟠",
            rarity: "rare", 
            value: 70,
            description: "Теплый металл"
        }
    ],
    epic: [
        { 
            id: 201, 
            name: "Эпический кристалл", 
            emoji: "✨",
            rarity: "epic", 
            value: 500,
            description: "Мощный артефакт"
        },
        { 
            id: 202, 
            name: "Пламенный шар", 
            emoji: "🔥",
            rarity: "epic", 
            value: 450,
            description: "Горячая энергия"
        },
        { 
            id: 203, 
            name: "Ледяная сфера", 
            emoji: "❄️",
            rarity: "epic", 
            value: 480,
            description: "Морозное ядро"
        }
    ],
    legendary: [
        { 
            id: 301, 
            name: "Легендарная звезда", 
            emoji: "⭐",
            rarity: "legendary", 
            value: 2000,
            description: "Космическая сила"
        },
        { 
            id: 302, 
            name: "Драконий камень", 
            emoji: "🐉",
            rarity: "legendary", 
            value: 1800,
            description: "Древняя мощь"
        },
        { 
            id: 303, 
            name: "Феникс перо", 
            emoji: "🦚",
            rarity: "legendary", 
            value: 2200,
            description: "Вечное возрождение"
        }
    ]
};

// Вероятности для паков
const packProbabilities = {
    basic: {
        common: 70,
        rare: 25,
        epic: 4,
        legendary: 1
    },
    premium: {
        common: 0,
        rare: 50,
        epic: 30,
        legendary: 19,
        mythical: 1
    }
};

// Получение случайной карты
function getRandomCard(packType) {
    const probabilities = packProbabilities[packType];
    const rand = Math.random() * 100;
    
    let cumulative = 0;
    for (const rarity in probabilities) {
        cumulative += probabilities[rarity];
        if (rand <= cumulative) {
            const cardsInRarity = cards[rarity];
            if (cardsInRarity && cardsInRarity.length > 0) {
                const randomIndex = Math.floor(Math.random() * cardsInRarity.length);
                return { ...cardsInRarity[randomIndex] };
            }
        }
    }
    
    // Fallback - обычная карта
    const commonCards = cards.common;
    return { ...commonCards[Math.floor(Math.random() * commonCards.length)] };
}

// Получение цвета для редкости
function getRarityColor(rarity) {
    const colors = {
        common: '#b0b0b0',
        rare: '#0070dd',
        epic: '#a335ee',
        legendary: '#ff8000',
        mythical: '#e60000'
    };
    return colors[rarity] || colors.common;
}

// Получение emoji для редкости
function getRarityEmoji(rarity) {
    const emojis = {
        common: '⚪',
        rare: '🔵',
        epic: '🟣',
        legendary: '🟠'
    };
    return emojis[rarity] || '⚪';
}

// Объявляем функции глобально
window.getRandomCard = getRandomCard;
window.getRarityColor = getRarityColor;
window.getRarityEmoji = getRarityEmoji;
window.cardsData = cards;
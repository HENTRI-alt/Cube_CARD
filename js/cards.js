// Система карт
const cards = {
    common: [
        { 
            id: 1, 
            name: "Обычный ромб", 
            image: "assets/cards/common/diamond.png", 
            rarity: "common", 
            value: 10,
            description: "Базовый кристалл"
        },
        { 
            id: 2, 
            name: "Каменный блок", 
            image: "assets/cards/common/stone.png", 
            rarity: "common", 
            value: 8,
            description: "Прочный материал"
        }
    ],
    rare: [
        { 
            id: 101, 
            name: "Золотой ромб", 
            image: "assets/cards/rare/gold_diamond.png", 
            rarity: "rare", 
            value: 100,
            description: "Блестящий кристалл"
        },
        { 
            id: 102, 
            name: "Серебряный шар", 
            image: "assets/cards/rare/silver_orb.png", 
            rarity: "rare", 
            value: 80,
            description: "Магическая сфера"
        }
    ],
    epic: [
        { 
            id: 201, 
            name: "Эпический кристалл", 
            image: "assets/cards/epic/epic_crystal.png", 
            rarity: "epic", 
            value: 500,
            description: "Мощный артефакт"
        },
        { 
            id: 202, 
            name: "Пламенный шар", 
            image: "assets/cards/epic/fire_orb.png", 
            rarity: "epic", 
            value: 450,
            description: "Горячая энергия"
        }
    ],
    legendary: [
        { 
            id: 301, 
            name: "Легендарная звезда", 
            image: "assets/cards/legendary/legend_star.png", 
            rarity: "legendary", 
            value: 2000,
            description: "Космическая сила"
        },
        { 
            id: 302, 
            name: "Драконий камень", 
            image: "assets/cards/legendary/dragon_stone.png", 
            rarity: "legendary", 
            value: 1800,
            description: "Древняя мощь"
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
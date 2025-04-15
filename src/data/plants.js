// Initial plant database for Winston, Oregon (Zones 8b/9a)
export const plantsData = [
  {
    id: 'spinach',
    name: 'Spinach',
    type: 'Vegetable',
    variety: 'Bloomsdale',
    hardinessZone: ['3', '4', '5', '6', '7', '8', '9', '10'],
    sunRequirement: 'Partial Sun',
    plantingMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    harvestMonths: [3, 4, 5, 6, 10, 11, 12],
    daysToMaturity: 45,
    spacing: 6, // inches
    depth: 0.5, // inches
    wateringNeeds: 'medium',
    nutritionalInfo: 'High in iron, vitamins A, C, and K, folate, and magnesium.',
    companionPlants: ['strawberry', 'pea', 'cabbage', 'cauliflower', 'eggplant'],
    avoidPlants: ['potato'],
    isPerennial: false,
    pestInfo: 'Watch for aphids, leaf miners, and slugs. Spinach is susceptible to downy mildew in humid conditions.',
    howToGuide: 'Plant seeds 1/2 inch deep, 2 inches apart, in rows 12-18 inches apart. Thin to 6 inches apart when seedlings have 2 true leaves. Keep soil consistently moist. Harvest outer leaves as needed or cut the whole plant at the base.',
    greenhouseSuitable: true
  },
  {
    id: 'kale',
    name: 'Kale',
    type: 'Vegetable',
    variety: 'Lacinato (Dinosaur)',
    hardinessZone: ['3', '4', '5', '6', '7', '8', '9', '10'],
    sunRequirement: 'Full Sun to Partial Shade',
    plantingMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    harvestMonths: [3, 4, 5, 6, 10, 11, 12],
    daysToMaturity: 60,
    spacing: 18, // inches
    depth: 0.5, // inches
    wateringNeeds: 'medium',
    nutritionalInfo: 'Extremely high in vitamins K, A, and C. Good source of manganese, copper, calcium, and potassium.',
    companionPlants: ['beet', 'celery', 'cucumber', 'onion', 'potato', 'spinach'],
    avoidPlants: ['strawberry', 'tomato'],
    isPerennial: false,
    pestInfo: 'Susceptible to cabbage worms, aphids, and flea beetles. Row covers can help protect young plants.',
    howToGuide: 'Plant seeds 1/4 to 1/2 inch deep, 3 inches apart, in rows 18-24 inches apart. Thin to 18 inches apart. Harvest outer leaves as needed, leaving the center to continue growing.',
    greenhouseSuitable: true
  },
  {
    id: 'tomato',
    name: 'Tomato',
    type: 'Vegetable',
    variety: 'Cherokee Purple',
    hardinessZone: ['3', '4', '5', '6', '7', '8', '9', '10', '11'],
    sunRequirement: 'Full Sun',
    plantingMonths: [3, 4, 5],
    harvestMonths: [7, 8, 9, 10],
    daysToMaturity: 80,
    spacing: 24, // inches
    depth: 0.25, // inches for seeds, deeper for transplants
    wateringNeeds: 'high',
    nutritionalInfo: 'Rich in vitamins C and K, potassium, and the antioxidant lycopene.',
    companionPlants: ['basil', 'carrot', 'onion', 'marigold'],
    avoidPlants: ['potato', 'cabbage', 'fennel'],
    isPerennial: false,
    pestInfo: 'Watch for tomato hornworms, aphids, and whiteflies. Susceptible to blight, especially in wet conditions.',
    howToGuide: 'Start seeds indoors 6-8 weeks before last frost. Transplant after danger of frost has passed. Plant deeply, burying 2/3 of the stem. Provide support with stakes or cages. Water consistently at the base to prevent disease.',
    greenhouseSuitable: true
  },
  {
    id: 'carrot',
    name: 'Carrot',
    type: 'Vegetable',
    variety: 'Nantes',
    hardinessZone: ['3', '4', '5', '6', '7', '8', '9', '10'],
    sunRequirement: 'Full Sun to Partial Shade',
    plantingMonths: [3, 4, 5, 8, 9],
    harvestMonths: [5, 6, 7, 10, 11, 12],
    daysToMaturity: 70,
    spacing: 3, // inches
    depth: 0.25, // inches
    wateringNeeds: 'medium',
    nutritionalInfo: 'Excellent source of beta-carotene (vitamin A), fiber, vitamin K, and potassium.',
    companionPlants: ['bean', 'lettuce', 'onion', 'pea', 'rosemary', 'sage', 'tomato'],
    avoidPlants: ['dill', 'fennel'],
    isPerennial: false,
    pestInfo: 'Carrot rust flies can be a problem. Carrot weevils and nematodes may also affect growth.',
    howToGuide: 'Sow seeds directly in loose, well-draining soil free of rocks. Mix seeds with sand for more even distribution. Keep soil consistently moist until germination. Thin to 3 inches apart when seedlings are 2 inches tall.',
    greenhouseSuitable: true
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    type: 'Fruit',
    variety: 'Seascape (Everbearing)',
    hardinessZone: ['4', '5', '6', '7', '8', '9'],
    sunRequirement: 'Full Sun',
    plantingMonths: [1, 2, 3, 4, 9, 10],
    harvestMonths: [5, 6, 7, 8, 9],
    daysToMaturity: 120, // from planting to first harvest
    spacing: 12, // inches
    depth: 0, // crown at soil level
    wateringNeeds: 'medium',
    nutritionalInfo: 'High in vitamin C, manganese, folate, and potassium. Contains antioxidants and flavonoids.',
    companionPlants: ['bean', 'borage', 'lettuce', 'spinach', 'thyme'],
    avoidPlants: ['cabbage', 'broccoli', 'fennel'],
    isPerennial: true,
    pestInfo: 'Slugs and birds are common pests. May be susceptible to powdery mildew and leaf spot.',
    howToGuide: 'Plant with crown at soil level, not too deep or shallow. Space 12-18 inches apart. Remove runners to encourage larger berries or allow some to root for more plants. Mulch around plants to keep berries clean and prevent weeds.',
    greenhouseSuitable: true
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    type: 'Fruit',
    variety: 'Sunshine Blue (Low-chill)',
    hardinessZone: ['5', '6', '7', '8', '9', '10'],
    sunRequirement: 'Full Sun',
    plantingMonths: [1, 2, 3, 10, 11, 12],
    harvestMonths: [6, 7, 8],
    daysToMaturity: 730, // about 2 years to full production
    spacing: 36, // inches
    depth: 0, // same as container depth
    wateringNeeds: 'medium',
    nutritionalInfo: 'Extremely high in antioxidants, particularly anthocyanins. Good source of vitamins C and K, manganese, and fiber.',
    companionPlants: ['strawberry', 'thyme', 'basil'],
    avoidPlants: ['tomato', 'eggplant'],
    isPerennial: true,
    pestInfo: 'Birds are the main pest. May be affected by mummy berry disease in wet conditions.',
    howToGuide: 'Plant in acidic soil (pH 4.5-5.5). Add peat moss or sulfur to lower pH if needed. Plant at same depth as nursery container. Water deeply but infrequently. Mulch with pine needles or acidic compost.',
    greenhouseSuitable: true
  },
  {
    id: 'basil',
    name: 'Basil',
    type: 'Herb',
    variety: 'Genovese',
    hardinessZone: ['4', '5', '6', '7', '8', '9', '10', '11'],
    sunRequirement: 'Full Sun',
    plantingMonths: [4, 5, 6],
    harvestMonths: [6, 7, 8, 9, 10],
    daysToMaturity: 30,
    spacing: 12, // inches
    depth: 0.25, // inches
    wateringNeeds: 'medium',
    nutritionalInfo: 'Contains vitamin K, manganese, copper, vitamin A, and various antioxidants.',
    companionPlants: ['tomato', 'pepper', 'oregano', 'marigold'],
    avoidPlants: ['rue'],
    isPerennial: false,
    pestInfo: 'Japanese beetles and aphids can be problems. Susceptible to downy mildew in humid conditions.',
    howToGuide: 'Start seeds indoors 6 weeks before last frost or direct sow after danger of frost. Pinch off flower buds to encourage leaf production. Harvest regularly by pinching stems just above a pair of leaves to encourage bushier growth.',
    greenhouseSuitable: true
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    type: 'Herb',
    variety: 'Arp (Cold Hardy)',
    hardinessZone: ['6', '7', '8', '9', '10', '11'],
    sunRequirement: 'Full Sun',
    plantingMonths: [4, 5, 9, 10],
    harvestMonths: [5, 6, 7, 8, 9, 10, 11, 12],
    daysToMaturity: 90,
    spacing: 24, // inches
    depth: 0, // same as container depth
    wateringNeeds: 'low',
    nutritionalInfo: 'Contains iron, calcium, and vitamin B6. Rich in antioxidants and anti-inflammatory compounds.',
    companionPlants: ['bean', 'broccoli', 'cabbage', 'carrot', 'sage'],
    avoidPlants: ['cucumber'],
    isPerennial: true,
    pestInfo: 'Generally pest-resistant. May occasionally be affected by powdery mildew or spider mites in poor conditions.',
    howToGuide: 'Plant in well-draining soil. Prefers slightly alkaline conditions. Do not overwater; allow soil to dry between waterings. Prune after flowering to maintain shape. In colder zones, grow in containers and bring indoors for winter.',
    greenhouseSuitable: true
  },
  {
    id: 'meyer-lemon',
    name: 'Meyer Lemon',
    type: 'Fruit',
    variety: 'Improved Meyer',
    hardinessZone: ['8', '9', '10', '11'],
    sunRequirement: 'Full Sun',
    plantingMonths: [3, 4, 5, 9, 10],
    harvestMonths: [11, 12, 1, 2, 3],
    daysToMaturity: 365, // about 1 year from flowering to harvest
    spacing: 36, // inches (container diameter)
    depth: 0, // same as container depth
    wateringNeeds: 'medium',
    nutritionalInfo: 'High in vitamin C, flavonoids, and limonoids. Contains potassium and folate.',
    companionPlants: ['marigold', 'nasturtium', 'basil'],
    avoidPlants: [],
    isPerennial: true,
    pestInfo: 'Watch for scale insects, spider mites, and aphids. May be susceptible to citrus leaf miner.',
    howToGuide: 'Grow in containers for Winston climate. Use well-draining citrus soil mix. Water when top inch of soil is dry. Fertilize with citrus-specific fertilizer during growing season. Bring indoors when temperatures drop below 50°F. Place in sunniest location possible indoors.',
    greenhouseSuitable: true
  },
  {
    id: 'pea',
    name: 'Pea',
    type: 'Vegetable',
    variety: 'Sugar Snap',
    hardinessZone: ['3', '4', '5', '6', '7', '8', '9', '10', '11'],
    sunRequirement: 'Full Sun to Partial Shade',
    plantingMonths: [2, 3, 4, 9, 10],
    harvestMonths: [4, 5, 6, 11, 12],
    daysToMaturity: 60,
    spacing: 3, // inches
    depth: 1, // inches
    wateringNeeds: 'medium',
    nutritionalInfo: 'Good source of protein, fiber, vitamins C and K, manganese, and folate.',
    companionPlants: ['carrot', 'cucumber', 'radish', 'spinach'],
    avoidPlants: ['garlic', 'onion'],
    isPerennial: false,
    pestInfo: 'Aphids can be a problem. Powdery mildew may occur in humid conditions.',
    howToGuide: 'Direct sow as soon as soil can be worked in spring. Provide support for climbing varieties. Plant in succession every 2-3 weeks for continuous harvest. Harvest snap peas when pods are plump but still tender.',
    greenhouseSuitable: true
  }
];

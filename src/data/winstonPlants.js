// Winston, Oregon Plant Recommendations (USDA Zones 8b/9a)
// Based on comprehensive gardening guide for the Umpqua Valley region

export const winstonPlants = {
  vegetables: {
    tomatoes: {
      slicing: [
        { name: 'Early Girl', traits: 'Reliable performer, early harvest' },
        { name: 'Celebrity', traits: 'Reliable performer, disease resistant' },
        { name: 'Big Beef', traits: 'Reliable performer, good flavor' },
        { name: 'Siletz', traits: 'Early season, determinate, bred for PNW' }
      ],
      cherry: [
        { name: 'Oregon Cherry', traits: 'Bred for PNW climate' },
        { name: 'Gold Nugget', traits: 'Yellow, resistant to cracking' },
        { name: 'Sweet Million', traits: 'Prolific producer' },
        { name: 'Sun Gold', traits: 'Orange, exceptionally sweet flavor' }
      ],
      paste: [
        { name: 'Oroma', traits: 'Reliable producer' },
        { name: 'Saucy', traits: 'Productive, disease resistant' },
        { name: 'Viva Italia', traits: 'Productive, flavorful' },
        { name: 'Super Marzano', traits: 'Large paste tomato' }
      ],
      heirloom: [
        { name: 'Brandywine', traits: 'Excellent flavor, Johnny\'s strain recommended' }
      ],
      plantingDates: {
        indoorStart: 'February (8 weeks before last frost)',
        transplant: 'May (after danger of frost)',
        daysToMaturity: '55-90 days from transplant'
      },
      notes: 'Start seeds indoors 8 weeks before transplanting. Thrive in Winston\'s summer heat, potentially performing even better in a greenhouse.'
    },
    
    peppers: {
      sweet: [
        { name: 'Parks Early Thickset', traits: 'Early producer' },
        { name: 'Camelot', traits: 'Standard bell' },
        { name: 'Yankee Bell', traits: 'Standard bell' },
        { name: 'Golden Bell', traits: 'Yellow bell' },
        { name: 'Ariane', traits: 'Orange bell' },
        { name: 'Lilac Bell', traits: 'Purple bell' },
        { name: 'Sweet Banana', traits: 'Elongated, mild' },
        { name: 'Gypsy', traits: 'Sweet specialty type' },
        { name: 'Giant Marconi', traits: 'Long Italian roasting type' }
      ],
      hot: [
        { name: 'Tam Jalapeño', traits: 'Milder jalapeño' },
        { name: 'Early Jalapeño', traits: 'Standard jalapeño' },
        { name: 'Serrano', traits: 'Hotter than jalapeño' },
        { name: 'Cayenne Long Slim', traits: 'Good for drying' }
      ],
      plantingDates: {
        indoorStart: 'Late January-February (10 weeks before transplant)',
        transplant: 'May-June (after soil has warmed)',
        daysToMaturity: '60-90 days from transplant'
      },
      notes: 'Require significant heat for optimal production. Start seeds indoors 10 weeks before transplanting.'
    },
    
    leafyGreens: {
      lettuce: {
        heading: [
          { name: 'Summertime', traits: 'Heat resistant' },
          { name: 'Ithaca', traits: 'Crisp head type' }
        ],
        redLeaf: [
          { name: 'Red Sails', traits: 'Slow-bolt, tip-burn resistant' },
          { name: 'New Red Fire', traits: 'Heat tolerant' }
        ],
        greenLeaf: [
          { name: 'Salad Bowl', traits: 'Slow-bolting' },
          { name: 'Grand Rapids', traits: 'Frilly leaves' }
        ],
        romaine: [
          { name: 'Paris Island', traits: 'Classic romaine' },
          { name: 'Little Gem', traits: 'Small heads, sweet' },
          { name: 'Winter Density', traits: 'Bolt resistant' }
        ],
        butterhead: [
          { name: 'Buttercrunch', traits: 'Heat tolerant' },
          { name: 'Esmeralda', traits: 'Tender leaves' }
        ],
        plantingDates: {
          indoorStart: 'February-March (5 weeks before transplant)',
          directSow: 'March-April, August',
          daysToMaturity: '45-80 days'
        }
      },
      chard: [
        { name: 'Fordhook Giant', traits: 'White stems, productive' },
        { name: 'Rhubarb', traits: 'Red stems' },
        { name: 'Bright Lights', traits: 'Multiple colors, ornamental' },
        { name: 'Bright Yellow', traits: 'Yellow stems' }
      ],
      kale: [
        { name: 'Dwarf Blue Curled Scotch', traits: 'Compact, curly' },
        { name: 'Winterbor', traits: 'Very hardy, overwinters well' },
        { name: 'Winter Red', traits: 'Purple-red, cold hardy' },
        { name: 'Nero di Toscana', traits: 'Lacinato/Dinosaur, flat leaves' }
      ],
      spinach: {
        spring: [
          { name: 'Bloomsdale Long Standing', traits: 'Savoyed leaves' },
          { name: 'Melody', traits: 'Smooth leaves' },
          { name: 'Olympia', traits: 'Smooth leaves, bolt resistant' }
        ],
        fall: [
          { name: 'Oriental Giant', traits: 'Large leaves' },
          { name: 'Rushmore', traits: 'Disease resistant' }
        ],
        plantingDates: {
          directSow: 'April (spring), September (fall)',
          daysToMaturity: '40-50 days'
        }
      },
      notes: 'For lettuce, look for slow-bolt and tip-burn resistant varieties, especially for spring and early summer harvests when temperatures rise.'
    },
    
    rootVegetables: {
      carrots: [
        { name: 'Scarlet Nantes', traits: 'Sweet, cylindrical' },
        { name: 'Royal Chantenay', traits: 'Short, good for heavy soils' },
        { name: 'Danvers', traits: 'Productive, storage' },
        { name: 'Bolero', traits: 'Disease resistant' },
        { name: 'Sugarsnax 54', traits: 'Sweet, high carotene' }
      ],
      beets: [
        { name: 'Ruby Queen', traits: 'Round, early' },
        { name: 'Red Ace', traits: 'Reliable, uniform' },
        { name: 'Detroit Dark Red', traits: 'Classic, deep red' },
        { name: 'Cylindra', traits: 'Cylindrical shape' },
        { name: 'Golden', traits: 'Yellow, mild flavor' }
      ],
      radishes: [
        { name: 'Cherry Belle', traits: 'Round, fast-growing' },
        { name: 'Champion', traits: 'Round, large' },
        { name: 'French Breakfast', traits: 'Elongated, mild' }
      ],
      plantingDates: {
        carrots: 'Direct sow March to mid-July',
        beets: 'Direct sow March to June',
        radishes: 'Direct sow frequently from March to September'
      },
      notes: 'Carrots require ample, regular water. Beets require boron, which may be deficient in local soils; use a fertilizer with micronutrients or amend specifically. Soil pH above 6.0 is preferred for beets.'
    },
    
    beans: {
      bush: [
        { name: 'Oregon Trail', traits: 'Local variety' },
        { name: 'Provider', traits: 'Early, reliable' },
        { name: 'Jade', traits: 'Slender pods' },
        { name: 'Oregon 54', traits: 'Local variety' }
      ],
      pole: [
        { name: 'Blue Lake', traits: 'Classic, productive' },
        { name: 'Kentucky Wonder', traits: 'Heirloom, productive' },
        { name: 'Romano', traits: 'Italian flat pod' },
        { name: 'Cascade Giant', traits: 'Long pods' }
      ],
      plantingDates: {
        directSow: 'May-June (when soil above 60°F)',
        daysToMaturity: '50-70 days'
      },
      notes: 'Bush beans tend to produce a concentrated crop. Pole beans are more productive over a longer period but require trellising.'
    },
    
    brassicas: {
      broccoli: [
        { name: 'Premium Crop', traits: 'Large heads' },
        { name: 'Packman', traits: 'Early' },
        { name: 'Arcadia', traits: 'Heat tolerant' },
        { name: 'Emerald Pride', traits: 'Side shoots' },
        { name: 'Belstar', traits: 'All-season, compact' }
      ],
      cabbage: {
        early: [
          { name: 'Dynamo', traits: 'Small heads' },
          { name: 'Parel', traits: 'Early season' }
        ],
        mainSeason: [
          { name: 'Golden Acre', traits: 'Round heads' },
          { name: 'Bravo', traits: 'Disease resistant' }
        ],
        lateStorage: [
          { name: 'Danish Ballhead', traits: 'Storage type' },
          { name: 'Storage Hybrid #4', traits: 'Long storage' }
        ],
        red: [
          { name: 'Ruby Perfection', traits: 'Uniform, medium-sized' }
        ],
        savoy: [
          { name: 'Melissa', traits: 'Crinkled leaves' }
        ]
      },
      cauliflower: {
        white: [
          { name: 'Snow Crown', traits: 'Early, dependable' },
          { name: 'Candid Charm', traits: 'Main season' },
          { name: 'Amazing', traits: 'Self-blanching' }
        ],
        purple: [
          { name: 'Violet Queen', traits: 'Purple heads' },
          { name: 'Graffiti', traits: 'Vibrant purple' }
        ],
        green: [
          { name: 'Alverda', traits: 'Green heads' }
        ]
      },
      plantingDates: {
        indoorStart: 'February-March, June-July',
        transplant: 'March-April, August',
        directSow: 'March-April, July-August',
        daysToMaturity: '60-120 days'
      },
      notes: 'Generally prefer cooler weather and benefit from being transplanted. Monitor closely for pests like aphids, cabbage worms, and root maggots. Suitable for spring, fall, and overwintering harvests.'
    },
    
    onionsGarlic: {
      onions: {
        yellow: [
          { name: 'Copra', traits: 'Storage type' },
          { name: 'Candy', traits: 'Sweet, mild' }
        ],
        red: [
          { name: 'Redwing', traits: 'Storage type' },
          { name: 'Mars', traits: 'Medium-sized' }
        ],
        white: [
          { name: 'White Sweet Spanish', traits: 'Large, mild' }
        ],
        overwintering: [
          { name: 'Walla Walla Sweet', traits: 'Sweet, overwinter for early harvest' }
        ]
      },
      garlic: {
        notes: 'Plant cloves in fall (September-February) for harvest the following summer'
      },
      plantingDates: {
        onions: 'Plant March-May',
        garlic: 'Plant September-February'
      },
      notes: 'Best started from seed or sets to avoid disease.'
    },
    
    squash: {
      summer: {
        yellow: [
          { name: 'Early Prolific Straightneck', traits: 'Early producer' },
          { name: 'Multipik', traits: 'Extended harvest' }
        ],
        zucchini: [
          { name: 'Ambassador', traits: 'Dark green' },
          { name: 'Raven', traits: 'Dark green, compact' },
          { name: 'Gold Rush', traits: 'Yellow zucchini' }
        ],
        scallop: [
          { name: 'Sunburst', traits: 'Yellow patty pan' }
        ]
      },
      winter: {
        maxima: [
          { name: 'Golden Delicious', traits: 'Orange flesh' },
          { name: 'Spaghetti', traits: 'Stringy flesh' },
          { name: 'Blue Hubbard', traits: 'Large, blue-gray' },
          { name: 'Sweet Meat', traits: 'Oregon heirloom, excellent keeper' }
        ],
        kabocha: [
          { name: 'Sweet Mama', traits: 'Sweet, dry flesh' },
          { name: 'Buttercup Burgess Strain', traits: 'Dark green' }
        ],
        delicata: [
          { name: 'Sugar Loaf', traits: 'Sweet, edible skin' }
        ],
        acorn: [
          { name: 'Table Ace', traits: 'Early' },
          { name: 'Table Queen', traits: 'Classic acorn' }
        ],
        butternut: [
          { name: 'Early Butternut', traits: 'Reliable, early' }
        ]
      },
      plantingDates: {
        summer: 'Plant May-June',
        winter: 'Plant in May'
      },
      notes: 'Warm-season crops planted after frost danger. Butternut types (C. moschata) often show better resistance to squash vine borer.'
    }
  },
  
  fruits: {
    apples: {
      varieties: [
        { name: 'Lodi', traits: 'Early, somewhat self-compatible' },
        { name: 'Gravenstein', traits: 'Classic flavor, needs pollinizer' },
        { name: 'Gala', traits: 'Heat-tolerant, needs pollinizer' },
        { name: 'Jonagold', traits: 'Sweet-tart, needs pollinizer' },
        { name: 'Liberty', traits: 'Disease-resistant, especially to scab' },
        { name: 'Fuji', traits: 'Sweet, good keeper' },
        { name: 'Golden Delicious', traits: 'Multi-purpose, good pollinizer' },
        { name: 'Granny Smith', traits: 'Tart, late season' }
      ],
      rootstocks: {
        dwarf: ['M-9', 'M-26', 'Bud 9'],
        semiDwarf: ['MM-106', 'MM-111', 'M-7']
      },
      pollination: 'Most apple varieties require cross-pollination from a different, compatible apple variety blooming at the same time. Some are self-compatible (e.g., Lodi, Chehalis, Akane) but often benefit from a pollinizer.'
    },
    
    pears: {
      european: [
        { name: 'Bartlett', traits: 'Classic pear, needs pollinizer' },
        { name: 'Anjou', traits: 'Winter pear, needs pollinizer' },
        { name: 'Bosc', traits: 'Russeted, performs well in Southern Oregon' },
        { name: 'Comice', traits: 'Sweet, performs well in Southern Oregon' }
      ],
      asian: [
        { name: 'Kosui', traits: 'Sweet, russet skin' },
        { name: 'Shinseiki', traits: 'Yellow, early ripening' },
        { name: 'Chojuro', traits: 'Russet skin, sweet' }
      ],
      rootstocks: {
        standard: 'Standard rootstocks',
        semiDwarf: 'Quince rootstock (suitable for Western Oregon)'
      },
      pollination: 'Most European pears require cross-pollination by another European pear variety. Asian pears benefit from planting multiple varieties for best pollination.'
    },
    
    cherries: {
      sweet: {
        selfFertile: [
          { name: 'Lapins', traits: 'Large, crack resistant' },
          { name: 'Stella', traits: 'Large, dark red' },
          { name: 'Compact Stella', traits: 'Smaller tree' },
          { name: 'Sweetheart', traits: 'Late season' }
        ],
        needsPollinizer: [
          { name: 'Van', traits: 'Productive, good pollinizer' },
          { name: 'Bing', traits: 'Classic, large' },
          { name: 'Royal Ann', traits: 'Yellow with red blush' },
          { name: 'Lambert', traits: 'Dark red' }
        ],
        pollinationNote: 'Bing, Lambert, and Royal Ann do not pollinize each other'
      },
      sour: [
        { name: 'Montmorency', traits: 'Standard tart cherry' },
        { name: 'North Star', traits: 'Dwarf tree' }
      ],
      rootstocks: {
        standard: 'Mazzard F-12-1 (may help with bacterial canker)',
        dwarf: 'Gisela rootstocks'
      },
      pollination: 'Sour cherries are self-fertile. Many sweet cherries require a pollinizer, but self-fruitful varieties like Lapins, Stella, and Sweetheart are excellent choices for home gardens needing only one tree.'
    },
    
    plums: {
      european: [
        { name: 'Stanley', traits: 'Self-fertile, prone to brown rot' },
        { name: 'Italian', traits: 'Prune type' },
        { name: 'Brooks', traits: 'Prune type' }
      ],
      japanese: [
        { name: 'Shiro', traits: 'Yellow, early' },
        { name: 'Burbank', traits: 'Red, sweet' },
        { name: 'Red Heart', traits: 'Large fruit' }
      ],
      pollination: 'European types are generally reliable. Stanley is self-fertile but prone to brown rot; others may need a pollinizer like Stanley. Japanese plums require specific pollinizers.'
    }
  },
  
  herbs: {
    perennial: [
      { name: 'Chives', traits: 'Plant clumps, March-May' },
      { name: 'Oregano', traits: 'Drought-tolerant' },
      { name: 'Rosemary', traits: 'Drought-tolerant' },
      { name: 'Sage', traits: 'Culinary sage' },
      { name: 'Thyme', traits: 'Various types, drought-tolerant' }
    ],
    annualBiennial: [
      { name: 'Basil', traits: 'Plant after frost, heat lover' },
      { name: 'Cilantro', traits: 'Cool season, bolts quickly in heat, succession plant' },
      { name: 'Dill', traits: 'Cool season' },
      { name: 'Parsley', traits: 'Biennial, plant spring' }
    ]
  },
  
  berries: {
    strawberries: {
      juneBearing: [
        { name: 'Sweet Sunrise', traits: 'Early, excellent flavor/processing' },
        { name: 'Hood', traits: 'Early, excellent flavor, poor durability' },
        { name: 'Tillamook', traits: 'Midseason, firm, high yield' },
        { name: 'Totem', traits: 'Midseason, standard processing' },
        { name: 'Marys Peak', traits: 'Mid-late, excellent flavor/quality' }
      ],
      dayNeutral: [
        { name: 'Albion', traits: 'Standard, large, firm' },
        { name: 'Seascape', traits: 'Good quality, large' },
        { name: 'Tristar', traits: 'Small, excellent flavor' },
        { name: 'Tribute', traits: 'Medium size, good flavor' }
      ],
      notes: 'Spotted Wing Drosophila (SWD) is a major pest; consider netting'
    },
    
    blueberries: [
      { name: 'Duke', traits: 'Early season' },
      { name: 'Bluecrop', traits: 'Midseason' },
      { name: 'Chandler', traits: 'Large fruit, mid-late' }
    ],
    blueberryNotes: 'Require acidic soil (pH 4.0-5.5), often necessitating amendments like sulfur or planting in beds amended with peat moss/acidic compost. Need full sun and good drainage. Bird protection (netting) is often required.',
    
    raspberries: {
      summerBearing: [
        { name: 'Cascade Delight', traits: 'Large, firm, excellent flavor, root rot tolerant' },
        { name: 'Meeker', traits: 'Standard processing, high yield' },
        { name: 'Willamette', traits: 'Vigorous, good flavor' }
      ],
      everbearing: [
        { name: 'Heritage', traits: 'Standard fall crop' },
        { name: 'Caroline', traits: 'Large, flavorful' },
        { name: 'Joan J', traits: 'Thornless, early fall' },
        { name: 'Anne', traits: 'Yellow, fall' }
      ],
      notes: 'Choose cultivars appropriate for Zone 8 hardiness. Some varieties are very susceptible to root rot, requiring excellent drainage.'
    }
  },
  
  nativePlants: {
    trees: [
      { name: 'Oregon White Oak (Quercus garryana)', traits: 'Drought-tolerant, supports wildlife' },
      { name: 'Pacific Madrone (Arbutus menziesii)', traits: 'Striking red bark, evergreen' },
      { name: 'Vine Maple (Acer circinatum)', traits: 'Beautiful fall color, shade tolerant' },
      { name: 'Oregon Ash (Fraxinus latifolia)', traits: 'Good for wet areas, deciduous' }
    ],
    shrubs: [
      { name: 'Oregon Grape (Mahonia aquifolium)', traits: 'State flower, evergreen, edible berries' },
      { name: 'Red-flowering Currant (Ribes sanguineum)', traits: 'Spring blooms, attracts hummingbirds' },
      { name: 'Salal (Gaultheria shallon)', traits: 'Evergreen, edible berries, shade tolerant' },
      { name: 'Nootka Rose (Rosa nutkana)', traits: 'Pink flowers, drought-tolerant, wildlife value' },
      { name: 'Western Serviceberry (Amelanchier alnifolia)', traits: 'White flowers, edible berries' }
    ],
    perennials: [
      { name: 'Common Camas (Camassia quamash)', traits: 'Blue flowers, spring blooming' },
      { name: 'Oregon Sunshine (Eriophyllum lanatum)', traits: 'Yellow flowers, drought-tolerant' },
      { name: 'Western Columbine (Aquilegia formosa)', traits: 'Red and yellow flowers, attracts hummingbirds' },
      { name: 'Douglas Aster (Symphyotrichum subspicatum)', traits: 'Purple flowers, late summer bloom' },
      { name: 'Yarrow (Achillea millefolium)', traits: 'White flowers, drought-tolerant, medicinal' }
    ],
    benefits: [
      'Adapted to local climate and soil conditions',
      'Support local wildlife and pollinators',
      'Generally require less water once established',
      'Contribute to local ecosystem health'
    ]
  },
  
  droughtTolerant: {
    vegetables: [
      { name: 'Armenian Cucumber', traits: 'Heat-loving, less water than other cucumbers' },
      { name: 'Tepary Beans', traits: 'Ancient desert bean, extremely drought-tolerant' },
      { name: 'Amaranth', traits: 'Edible leaves and grain, heat-loving' },
      { name: 'New Zealand Spinach', traits: 'Summer green, heat-tolerant spinach alternative' },
      { name: 'Tomatoes (dry-farming varieties)', traits: 'Can be dry-farmed after establishment' }
    ],
    fruits: [
      { name: 'Fig', traits: 'Mediterranean native, drought-adapted once established' },
      { name: 'Pomegranate', traits: 'Arid climate fruit, ornamental and productive' },
      { name: 'Jujube', traits: 'Chinese date, extremely drought-tolerant' },
      { name: 'Pineapple Guava (Feijoa)', traits: 'Evergreen, ornamental, edible fruits' }
    ],
    herbs: [
      { name: 'Lavender', traits: 'Mediterranean herb, minimal water needs' },
      { name: 'Rosemary', traits: 'Aromatic, woody, very drought-tolerant' },
      { name: 'Sage', traits: 'Culinary and ornamental, drought-adapted' },
      { name: 'Thyme', traits: 'Low-growing, aromatic, minimal water' },
      { name: 'Oregano', traits: 'Spreads easily, very drought-tolerant' }
    ],
    wateringTips: [
      'Water deeply but infrequently to encourage deep root growth',
      'Apply mulch 3-4 inches thick to retain soil moisture',
      'Water in early morning to reduce evaporation',
      'Consider ollas (buried clay pots) for efficient irrigation'
    ]
  },
  
  beginnerFriendly: {
    cantFailVegetables: [
      { name: 'Cherry Tomatoes (Sun Gold)', traits: 'Prolific producer, disease resistant' },
      { name: 'Zucchini', traits: 'Fast-growing, abundant harvest' },
      { name: 'Snap Peas (Oregon Sugar Pod II)', traits: 'Local variety, early producer' },
      { name: 'Radishes (Cherry Belle)', traits: 'Ready in 3-4 weeks, fast results' },
      { name: 'Lettuce (Salad Bowl)', traits: 'Cut-and-come-again harvesting' },
      { name: 'Kale (Lacinato)', traits: 'Cold hardy, long season' },
      { name: 'Bush Beans (Provider)', traits: 'Reliable, productive' },
      { name: 'Green Onions', traits: 'Quick growing, continuous harvest' }
    ],
    easyFruits: [
      { name: 'Blueberries (Bluecrop)', traits: 'Reliable, pest resistant' },
      { name: 'Raspberries (Caroline)', traits: 'Fall bearing, produces first year' },
      { name: 'Strawberries (Seascape)', traits: 'Day-neutral, extended harvest' },
      { name: 'Apple (Liberty)', traits: 'Disease resistant, reliable' }
    ],
    simplestHerbs: [
      { name: 'Mint', traits: 'Vigorous, container recommended' },
      { name: 'Chives', traits: 'Perennial, pest resistant' },
      { name: 'Basil', traits: 'Summer annual, loves heat' },
      { name: 'Parsley', traits: 'Biennial, cold tolerant' }
    ],
    beginnerTips: [
      'Start small with a few containers or a 4x8 raised bed',
      'Use good quality potting soil or compost-enriched garden soil',
      'Choose disease-resistant varieties',
      'Check plants every 1-2 days during summer',
      'Harvest vegetables frequently to encourage production'
    ]
  },
  
  seasonExtenders: {
    coldFrames: {
      crops: ['Lettuce', 'Spinach', 'Arugula', 'Kale', 'Asian Greens', 'Carrots', 'Radishes'],
      construction: 'Simple wooden frame with glass or clear plastic top, oriented to south',
      management: 'Vent during sunny days, close at night, monitor temperatures'
    },
    rowCovers: {
      lightweight: {
        protection: '2-4°F of frost protection',
        crops: ['Lettuce', 'Spinach', 'Spring vegetables', 'Tender seedlings']
      },
      heavyweight: {
        protection: '6-8°F of frost protection',
        crops: ['Broccoli', 'Cabbage', 'Kale', 'Overwintering vegetables']
      },
      hoops: 'PVC pipe, concrete reinforcing wire, or flexible rods create support for covers'
    },
    winterCrops: [
      { name: 'Mache (Corn Salad)', traits: 'Very cold hardy, grows during winter' },
      { name: 'Kale (Winterbor)', traits: 'Improves flavor after frost' },
      { name: 'Leeks (Bandit)', traits: 'Winter hardy, long harvest period' },
      { name: 'Brussels Sprouts (Dagan)', traits: 'Best flavor after frost' },
      { name: 'Winter Radishes (Watermelon Radish)', traits: 'Storage type, cold hardy' }
    ]
  },
  
  plantingCalendar: {
    indoorStarts: {
      january: {
        late: ['Onions', 'Leeks', 'Peppers', 'Eggplant']
      },
      february: ['Tomatoes', 'Broccoli', 'Cabbage', 'Cauliflower', 'Lettuce', 'Basil'],
      march: ['Cantaloupe', 'Watermelon', 'Squash (Summer/Winter)']
    },
    directSow: {
      march: {
        soilTemp: '40-50°F',
        crops: ['Peas', 'Lettuce', 'Radishes', 'Spinach', 'Carrots', 'Beets', 'Turnips', 'Kale']
      },
      april: {
        soilTemp: '50-60°F',
        crops: ['Chard', 'Potatoes', 'more Carrots/Beets/Lettuce']
      },
      may: {
        soilTemp: '60°F',
        crops: ['Beans', 'Corn', 'Cucumbers', 'Summer/Winter Squash']
      }
    },
    transplantTiming: {
      coolSeason: {
        timing: 'late March through April',
        crops: ['Broccoli', 'Cabbage', 'Cauliflower', 'Lettuce', 'Chard', 'Kale'],
        conditions: 'once soil is workable and hard frosts are unlikely'
      },
      warmSeason: {
        timing: 'early-to-mid May',
        crops: ['Tomatoes', 'Peppers', 'Eggplant', 'Squash', 'Melons'],
        conditions: 'after all danger of frost has passed and soil has warmed'
      }
    },
    harvestWindows: {
      spring: {
        months: 'May-June',
        crops: ['Radishes', 'Spinach', 'Lettuce', 'Peas', 'early Beets/Carrots', 'overwintered Kale/Garlic']
      },
      summer: {
        months: 'July-Sept',
        crops: ['Beans', 'Corn', 'Tomatoes', 'Peppers', 'Eggplant', 'Cucumbers', 'Summer Squash', 'Melons', 'early Potatoes', 'Onions', 'main season Beets/Carrots']
      },
      fall: {
        months: 'Oct-Nov',
        crops: ['Late Beans', 'Broccoli', 'Cabbage', 'Cauliflower', 'Winter Squash', 'Pumpkins', 'Potatoes', 'late Carrots/Beets', 'Kale', 'Chard', 'fall Lettuce/Spinach']
      },
      winter: {
        months: 'Dec-Apr',
        crops: ['Overwintered Kale', 'Brussels Sprouts', 'Leeks', 'winter Cabbage', 'Corn Salad', 'overwintered Spinach/Lettuce (with protection/greenhouse)', 'Garlic (harvest following summer)']
      }
    }
  },
  
  soilManagement: {
    typicalSoil: {
      acidity: 'Naturally acidic (pH 4.8 to 6.2)',
      texture: 'Clay and silty clay loams are common',
      organicMatter: 'Regular additions necessary as organic matter decomposes over time'
    },
    amendments: {
      liming: {
        purpose: 'Raise pH to 6.0-7.0 for most vegetables',
        application: 'For new gardens without a soil test, a general starting application is 10 lbs of lime per 100 square feet'
      },
      organicMatter: {
        application: 'Apply a 2- to 3-inch layer of compost, well-rotted manure, leaf mold, or similar materials each year',
        benefits: 'Improves soil structure, drainage, and aeration'
      },
      fertilizers: {
        nitrogen: 'Mobile in soil and usually required annually',
        phosphorusPotassium: 'Less mobile and may build up over time; apply only if tests show deficiency'
      }
    },
    testing: {
      recommendedFrequency: 'For established gardens, testing every 3-5 years',
      localResource: 'Douglas County Master Gardener™ Program offers soil testing for home gardeners'
    }
  },
  
  pestsDiseases: {
    commonPests: [
      {
        name: 'Aphids',
        affected: 'Many plants (beans, brassicas, tomatoes, peppers, roses)',
        control: 'Strong water spray, insecticidal soap, neem oil, beneficial insects'
      },
      {
        name: 'Codling Moth',
        affected: 'Apples, pears',
        control: 'Pheromone traps, bagging fruit, kaolin clay, proper timing of controls'
      },
      {
        name: 'Spotted Wing Drosophila',
        affected: 'Berries, cherries',
        control: 'Exclusion netting, frequent harvesting, sanitation'
      },
      {
        name: 'Cabbage Worms',
        affected: 'Brassicas (broccoli, cabbage, kale)',
        control: 'Row covers, Bt sprays, handpicking'
      },
      {
        name: 'Slugs/Snails',
        affected: 'Seedlings, leafy greens',
        control: 'Handpicking, traps, iron phosphate baits'
      }
    ],
    commonDiseases: [
      {
        name: 'Powdery Mildew',
        affected: 'Squash, cucumber, peas, apples, roses',
        control: 'Good air circulation, sulfur, potassium bicarbonate, neem oil'
      },
      {
        name: 'Apple/Pear Scab',
        affected: 'Apples, pears',
        control: 'Resistant varieties, proper pruning, sanitation, timely sprays'
      },
      {
        name: 'Brown Rot',
        affected: 'Stone fruits (cherries, plums, peaches)',
        control: 'Sanitation, proper pruning, timely sulfur sprays'
      },
      {
        name: 'Root Rots',
        affected: 'Many plants, especially berries',
        control: 'Improve drainage, avoid overwatering, resistant varieties'
      },
      {
        name: 'Blossom End Rot',
        affected: 'Tomatoes, peppers, squash',
        control: 'Consistent watering, adequate calcium, proper pH'
      }
    ],
    ipmStrategies: {
      prevention: [
        'Build healthy soil with organic matter',
        'Select resistant varieties',
        'Practice crop rotation',
        'Maintain proper spacing and pruning',
        'Water at the base of plants',
        'Use mulch to suppress weeds and moderate soil moisture'
      ],
      monitoring: [
        'Scout garden regularly',
        'Use traps to monitor pest presence',
        'Accurately identify problems before treatment'
      ],
      leastToxicControls: [
        'Insecticidal soaps for soft-bodied insects',
        'Horticultural oils for smothering insects',
        'Bacillus thuringiensis (Bt) for caterpillars',
        'Neem oil for multiple pests',
        'Iron phosphate for slugs/snails'
      ]
    }
  },
  
  gardeningTechniques: {
    seedStarting: {
      media: 'Use sterile, fine-textured seed-starting mix',
      lighting: 'Supplemental lighting using fluorescent shop lights or LED grow lights positioned just a few inches above the seedlings for 14-16 hours per day',
      temperature: 'Cool-season crops germinate at lower temperatures, warm-season crops require 70-85°F'
    },
    hardeningOff: {
      process: 'Gradually acclimate seedlings to outdoor conditions over 7-14 days',
      steps: [
        'Start by placing seedlings outdoors in a sheltered location for 1-2 hours',
        'Gradually increase outdoor time each day',
        'Slowly introduce to more direct sunlight and breezes',
        'Reduce watering slightly during final days'
      ]
    },
    watering: {
      strategy: 'Water deeply and less frequently, rather than shallowly every day',
      amount: 'Aim to moisten the soil profile 8-10 inches deep with each watering',
      frequency: 'Typically 1-1.5 inches of water per week, potentially applied in one or two deep waterings',
      timing: 'Water early in the morning when temperatures are cooler',
      methods: 'Drip irrigation and soaker hoses are most efficient'
    },
    mulching: {
      application: 'Apply a 2-4 inch layer of organic mulch (straw, shredded leaves, bark chips, compost)',
      benefits: [
        'Reduces moisture evaporation',
        'Suppresses weeds',
        'Moderates soil temperature',
        'Prevents soil crusting',
        'Reduces erosion'
      ]
    }
  },
  
  greenhouseManagement: {
    summerVentilation: {
      passive: 'Roof vents, side vents, roll-up sides, cross-ventilation with doors at opposite ends',
      active: 'Exhaust fans sized for complete air exchange per minute, thermostat-controlled',
      shading: 'Shade cloth (30-50% light reduction) or whitewash coating'
    },
    winterProtection: {
      unheated: 'Well-sealed greenhouse can often stay above freezing, aim for above 39°F',
      heating: [
        'Electric heaters - simple, clean, easy to control',
        'Propane/natural gas heaters - more cost-effective but require proper ventilation',
        'Thermal mass (water barrels) to moderate temperature swings',
        'Insulation and sealing to minimize heat loss'
      ]
    },
    seasonExtension: {
      springSummer: 'Start seeds 6-10 weeks earlier than direct sowing outdoors',
      fallWinter: 'Protect warm-season crops from early frosts; grow cool-season crops through winter'
    }
  }
};

// Data points for app integration (temperature thresholds, watering guidelines, etc.)
export const winstonGardeningData = {
  climate: {
    zone: '8b/9a',
    type: 'Warm-summer Mediterranean',
    lastFrostAvg: 'mid-to-late April',
    firstFrostAvg: 'early November',
    summerPattern: 'Warm and dry with little rainfall'
  },
  
  soilParameters: {
    optimalPH: {
      vegetables: { min: 6.0, max: 7.5 },
      blueberries: { min: 4.0, max: 5.5 }
    },
    typicalLocalPH: { min: 4.8, max: 6.2 },
    limeApplication: {
      newGarden: '10 lbs per 100 sq ft'
    }
  },
  
  wateringGuidelines: {
    establishedPlants: {
      depth: '8-10 inches',
      weeklyAmount: '1.0-1.5 inches',
      frequency: '1-2 times per week',
      preferredTime: 'Early morning'
    },
    seedlingsTransplants: {
      frequency: 'Daily or every other day',
      amount: 'Light, consistent moisture'
    }
  },
  
  temperatureThresholds: {
    soilTempsForPlanting: {
      coolSeason: { min: 40, optimal: 50 },
      warmSeason: { min: 60, optimal: 70 }
    },
    frostProtection: {
      tenderPlants: { damageThreshold: 40 },
      hardyBlossoms: { damageThreshold: 32 },
      greenhouse: { minTarget: 39 }
    },
    greenhouse: {
      summerMaxTarget: 85,
      winterMinUnheated: 39,
      winterMinCoolCrops: 45,
      winterMinWarmCrops: 55
    }
  },
  
  fertilizationRates: {
    // Per 100 sq ft
    annualNitrogen: '0.3 lbs actual N',
    balancedPrePlant: '1.5-2.0 lbs of 15-15-15',
    sidedressNitrogen: '1.0 lb of 21-0-0',
    organicMatter: '0.5-1 inch layer annually'
  }
};
/**
 * Winston, Oregon Climate and Growing Zone Data
 * 
 * This file contains specific climate information for Winston, Oregon (USDA Zones 8b/9a)
 * to provide locally-relevant gardening guidance.
 */

export const winstonClimateData = {
  location: "Winston, Oregon",
  usdaZone: "8b/9a",
  climateType: "Warm-summer Mediterranean climate",
  avgFirstFrostDate: "Mid-November", // Approximate
  avgLastFrostDate: "Mid-April", // Approximate
  growingSeasonLength: "~200 days",
  
  climateCharacteristics: [
    "Mild year-round temperatures",
    "Wet winters (November-March)",
    "Notably dry summers (June-September)",
    "Long growing season allowing multiple planting successions",
    "Potential for year-round harvests with careful planning",
    "Pronounced summer drought requiring diligent irrigation",
    "Generally mild winters with occasional frost",
    "Significant microclimates even within short distances"
  ],
  
  monthlyData: [
    { month: "January", avgHigh: 50, avgLow: 34, precipitation: 5.5, notes: "Dormant season, plan garden, prepare soil when workable" },
    { month: "February", avgHigh: 54, avgLow: 36, precipitation: 4.8, notes: "Start seeds indoors (tomatoes, peppers, onions), prune fruit trees" },
    { month: "March", avgHigh: 58, avgLow: 38, precipitation: 4.2, notes: "Direct sow cool-season crops, plant potatoes, transplant onions" },
    { month: "April", avgHigh: 63, avgLow: 40, precipitation: 3.0, notes: "Last frost typically mid-month, plant cool-season crops" },
    { month: "May", avgHigh: 70, avgLow: 45, precipitation: 2.0, notes: "Plant warm-season crops, succession plant greens" },
    { month: "June", avgHigh: 76, avgLow: 50, precipitation: 1.2, notes: "Irrigation becomes critical, mulch to conserve moisture" },
    { month: "July", avgHigh: 85, avgLow: 53, precipitation: 0.4, notes: "Peak summer heat, consistent irrigation essential" },
    { month: "August", avgHigh: 85, avgLow: 53, precipitation: 0.5, notes: "Plant fall crops, maintain irrigation, harvest peak" },
    { month: "September", avgHigh: 80, avgLow: 48, precipitation: 1.0, notes: "Plant winter crops, cover crops, harvest continues" },
    { month: "October", avgHigh: 68, avgLow: 42, precipitation: 2.5, notes: "First light frosts possible late month, harvest winter squash" },
    { month: "November", avgHigh: 55, avgLow: 38, precipitation: 5.8, notes: "First hard frost typically mid-month, plant garlic" },
    { month: "December", avgHigh: 48, avgLow: 34, precipitation: 6.0, notes: "Garden cleanup, plan for next season, compost" }
  ],
  
  soilCharacteristics: {
    typicalPH: "4.8 to 6.2 (naturally acidic)",
    recommendedPH: {
      mostVegetables: "6.0 to 7.5",
      blueberries: "4.0 to 5.5",
      potatoes: "5.5 to 6.0"
    },
    commonTexture: "Clay and silty clay loams common",
    challenges: [
      "Naturally acidic soils requiring lime for most vegetables",
      "Clay soils can be hard when dry, sticky when wet",
      "Potential drainage issues in clay soils",
      "Slow spring warming in heavy soils"
    ],
    recommendations: [
      "Test soil pH before planting",
      "Add lime based on soil test results (typically 10 lbs per 100 sq ft for new gardens)",
      "Build raised beds for improved drainage and earlier spring planting",
      "Add organic matter annually to improve soil structure",
      "Avoid working wet soil to prevent compaction"
    ]
  },
  
  wateringGuidelines: {
    summerWatering: {
      frequency: "1-2 times per week for established plants",
      amount: "1.0-1.5 inches of water per week total",
      method: "Deep watering to moisten soil 8-10 inches deep",
      timing: "Early morning preferred",
      notes: "Adjust based on soil type, weather, and plant observation"
    },
    seedlingsWatering: {
      frequency: "Daily or every other day",
      amount: "Keep soil consistently moist but not waterlogged",
      method: "Light, gentle watering",
      notes: "Gradually reduce frequency as plants establish"
    },
    conservationTips: [
      "Apply 2-4 inches of organic mulch to reduce evaporation",
      "Use drip irrigation or soaker hoses for efficiency",
      "Group plants with similar water needs together",
      "Consider drought-tolerant varieties for summer planting"
    ]
  }
};

export default winstonClimateData;

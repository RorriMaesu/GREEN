import { GoogleGenAI } from "@google/genai";

// GeminiService.js
// This service handles interactions with Gemini API for weather data and garden recommendations

/**
 * GeminiService provides methods to interact with Google's Gemini API
 * for fetching weather data and generating intelligent gardening recommendations
 * based on local weather patterns for Winston, Oregon
 */
export default class GeminiService {
  /**
   * Create a new GeminiService instance
   * @param {string} apiKey - The Gemini API key from user settings
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = null;
    this.model = null;
    this._initialized = false;
  }

  /**
   * Initialize the Gemini client with the provided API key
   * @returns {boolean} Success status of initialization
   */
  async initialize() {
    try {
      // Basic validation of API key format
      if (!this.apiKey || this.apiKey.length < 10) {
        throw new Error('Invalid API key format');
      }
      
      try {
        // Initialize with the new GoogleGenAI constructor
        this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
        
        // Get the Gemini 2.5 Pro Preview model
        this.model = this.genAI.models.getGenerativeModel({
          model: "gemini-2.5-pro-preview-03-25"
        });
        
        // Test the model with a simple prompt to verify the API key works
        const response = await this.model.generateContent("Hello, are you working?");
        
        // If we get here, initialization was successful
        this._initialized = true;
        console.log("Gemini AI initialized successfully");
        return true;
      } catch (innerError) {
        console.error('Failed to initialize Gemini API client:', innerError);
        // Fall back to simulated data
        return this._initializeFallback();
      }
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      return this._initializeFallback();
    }
  }
  
  /**
   * Initialize a fallback service when Gemini API isn't available
   * @returns {boolean} Always returns false to indicate real API isn't available
   * @private
   */
  _initializeFallback() {
    console.warn('Using fallback simulation instead of Gemini API');
    this._initialized = false;
    return false;
  }

  /**
   * Check if the service is initialized with a valid API key
   * @returns {boolean} Initialization status
   */
  isInitialized() {
    return this._initialized;
  }

  /**
   * Fetch current weather data for Winston, Oregon
   * @returns {Promise<Object>} Weather data object
   */
  async getCurrentWeather() {
    try {
      if (!this.isInitialized()) {
        throw new Error('Gemini service not initialized');
      }

      // First try to get real weather data using Gemini
      try {
        const prompt = `
          I need current weather data for Winston, Oregon. 
          Return only a JSON object with the following structure:
          {
            "temperature": {
              "current": number, // Current temperature in Fahrenheit
              "high": number,    // Today's high temperature in Fahrenheit
              "low": number,     // Today's low temperature in Fahrenheit
              "avgHigh": number, // Average high for this time of year
              "avgLow": number   // Average low for this time of year
            },
            "conditions": string, // Weather condition description (e.g., "Sunny", "Rainy")
            "precipitation": {
              "chance": number,  // Chance of precipitation as percentage (0-100)
              "amount": number,  // Amount in inches (0 if no precipitation)
              "unit": "inches"
            },
            "forecast": [
              // 3-day forecast array
              {
                "day": 1,
                "high": number,
                "low": number,
                "condition": string,
                "precipChance": number
              },
              // ... more days
            ],
            "recentTrends": string // Description of recent weather patterns
          }
          
          Use today's date (${new Date().toLocaleDateString()}) and the fact that Winston, Oregon is in USDA growing zone 8b/9a.
          Make realistic estimates based on the season if exact data isn't available.
        `;

        const result = await this.model.generateContent({
          contents: prompt
        });
        
        // Updated for new API response format
        const text = result.response.text();
        
        // Try to parse the JSON response
        try {
          const weatherData = JSON.parse(text);
          weatherData.fetchedAt = new Date().toISOString();
          weatherData.source = 'Gemini AI';
          return weatherData;
        } catch (parseError) {
          console.warn('Failed to parse Gemini weather response as JSON:', parseError);
          // Fall back to simulated data if parsing fails
          throw new Error('JSON parsing failed');
        }
      } catch (genAiError) {
        console.warn('Error getting weather from Gemini, using simulated data:', genAiError);
        // Fall back to simulated data
      }
      
      // Fallback to simulated data (keeping the original implementation)
      const month = new Date().getMonth();
      
      // Simulated weather data for Winston, OR
      const simulatedWeatherData = {
        temperature: this._getSeasonalTemperature(month),
        conditions: this._getSeasonalConditions(month),
        precipitation: this._getRandomPrecipitation(month),
        forecast: this._getRandomForecast(month),
        recentTrends: this._getRandomTrends(month),
        fetchedAt: new Date().toISOString(),
        source: 'Simulated data (fallback when Gemini API fails)'
      };

      return simulatedWeatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  /**
   * Get personalized gardening recommendations based on current weather and seasonal patterns
   * @param {Object} weatherData - The current weather data
   * @returns {Promise<Object>} Gardening recommendations
   */
  async getGardeningRecommendations(weatherData) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Gemini service not initialized');
      }

      // Try to get AI-generated recommendations using Gemini
      try {
        const month = new Date().getMonth();
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonth = monthNames[month];
        
        const prompt = `
          As a gardening expert for Winston, Oregon (USDA growing zone 8b/9a), provide comprehensive gardening recommendations 
          for ${currentMonth} based on this current weather data:
          
          Current Temperature: ${weatherData.temperature.current}°F
          High/Low: ${weatherData.temperature.high}°F / ${weatherData.temperature.low}°F
          Conditions: ${weatherData.conditions}
          Precipitation Chance: ${weatherData.precipitation.chance}%
          Precipitation Amount: ${weatherData.precipitation.amount} inches
          
          Return only a JSON object with the following structure:
          {
            "urgent": [
              {
                "type": string, // Examples: "frost", "heat", "rain", "maintenance"
                "severity": string, // "high", "medium", or "low"
                "message": string // The specific recommendation
              }
            ],
            "watering": {
              "frequency": string,
              "amount": string,
              "timing": string,
              "note": string
            },
            "planting": {
              "indoor": string[], // What to plant indoors now
              "outdoor": string[], // What to plant outdoors now
              "avoid": string[], // What to avoid planting now
              "adjustments": string[] // Weather-based planting adjustments
            },
            "maintenance": {
              "regularTasks": string[], // Regular seasonal tasks
              "weatherBasedTasks": string[] // Additional tasks based on current weather
            },
            "weatherAlert": [
              {
                "type": string, // "frost", "heat", "rain", "wind", "none"
                "severity": string, // "high", "medium", or "low" 
                "message": string // Alert message
              }
            ]
          }
          
          Use the current conditions to provide specific, actionable advice.
        `;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Try to parse the JSON response
        try {
          const recommendations = JSON.parse(text);
          recommendations.generatedAt = new Date().toISOString();
          recommendations.source = 'Gemini AI';
          return recommendations;
        } catch (parseError) {
          console.warn('Failed to parse Gemini recommendations as JSON:', parseError);
          // Fall back to simulated recommendations
          throw new Error('JSON parsing failed');
        }
      } catch (genAiError) {
        console.warn('Error getting recommendations from Gemini, using simulated data:', genAiError);
        // Fall back to simulated recommendations
      }
      
      // Fallback to simulated recommendations (keeping the original implementation)
      const month = new Date().getMonth();
      
      // Simulated recommendations
      const simulatedRecommendations = {
        urgent: this._getUrgentRecommendations(weatherData),
        watering: this._getWateringRecommendations(weatherData),
        planting: this._getPlantingRecommendations(month, weatherData),
        maintenance: this._getMaintenanceRecommendations(month, weatherData),
        weatherAlert: this._getWeatherAlerts(weatherData),
        generatedAt: new Date().toISOString(),
        source: 'Simulated recommendations (fallback when Gemini API fails)'
      };

      return simulatedRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Get a personalized response from the Gemini chatbot about gardening
   * @param {string} userMessage - The user's question or message
   * @param {Object} gardenContext - Information about the user's garden
   * @returns {Promise<string>} The chatbot response
   */
  async chatWithGardener(userMessage, gardenContext) {
    try {
      if (!this.isInitialized()) {
        throw new Error('Gemini service not initialized');
      }

      // Get current date and season information
      const now = new Date();
      const month = now.getMonth();
      const date = now.getDate();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonth = monthNames[month];
      
      // Determine current season
      let currentSeason = '';
      if (month >= 2 && month <= 4) currentSeason = 'Spring';
      else if (month >= 5 && month <= 7) currentSeason = 'Summer';
      else if (month >= 8 && month <= 10) currentSeason = 'Fall';
      else currentSeason = 'Winter';

      // Get weather data if possible
      let weatherInfo = '';
      try {
        const weather = await this.getCurrentWeather();
        weatherInfo = `
          Current Weather:
          Temperature: ${weather.temperature.current}°F (High: ${weather.temperature.high}°F / Low: ${weather.temperature.low}°F)
          Conditions: ${weather.conditions}
          Precipitation: ${weather.precipitation.chance}% chance
        `;
      } catch (error) {
        console.warn('Unable to fetch weather for chat context:', error);
        weatherInfo = `Current Season: ${currentSeason} in Winston, Oregon`;
      }
      
      // Prepare garden plants info for context
      let plantsInfo = "No plants added yet.";
      if (gardenContext?.plantings && gardenContext.plantings.length > 0) {
        plantsInfo = gardenContext.plantings.map(p => 
          `- ${p.plantName} (planted: ${new Date(p.plantedDate).toLocaleDateString()}, location: ${p.areaName}, status: ${p.status})`
        ).join('\n');
      }
      
      // Prepare garden areas info
      let areasInfo = "No garden areas set up yet.";
      if (gardenContext?.areas && gardenContext.areas.length > 0) {
        areasInfo = gardenContext.areas.map(a => 
          `- ${a.name}: ${a.type}, ${a.sunExposure || 'mixed'} sun exposure, ${a.soilType || 'regular'} soil`
        ).join('\n');
      }
      
      // Seasonal gardening tips specific to Winston, Oregon
      const seasonalTips = {
        'Spring': 'Spring in Winston (March-May): Last frost typically mid-April. Good time for cool-season crops and starting warm-season seeds indoors.',
        'Summer': 'Summer in Winston (June-August): Hot and dry. Focus on irrigation, mulching, and heat-tolerant varieties.',
        'Fall': 'Fall in Winston (September-November): First frost typically early November. Good for cool-season crops and preparing for winter.',
        'Winter': 'Winter in Winston (December-February): Mild winters allow some year-round growing. Cover crops and planning are key activities.'
      };

      // Build full prompt with context and user's question
      const fullPrompt = `
        You are GardenAI, a helpful gardening assistant specialized for Winston, Oregon (USDA growing zone 8b/9a).
        Today is ${currentMonth} ${date}, ${now.getFullYear()}, and we are in ${currentSeason}.
        
        ${seasonalTips[currentSeason]}
        
        ${weatherInfo}
        
        USER'S GARDEN INFORMATION:
        Climate Zone: ${gardenContext?.climateZone || "8b/9a (Winston, Oregon)"}
        
        Garden Areas:
        ${areasInfo}
        
        Plants Currently Growing:
        ${plantsInfo}
        
        When giving advice:
        1. Prioritize information specific to the current season (${currentSeason}) and month (${currentMonth})
        2. Tailor recommendations to the user's specific plants, garden areas, and growing conditions
        3. Reference their garden setup when relevant (e.g., "In your greenhouse areas..." or "For your tomatoes...")
        4. Provide science-based advice that's practical and actionable
        5. Focus on organic and sustainable practices when possible
        6. Consider Winston's climate patterns: mild winters, dry summers, and 200+ day growing season
        
        If the user asks about adding new plants, suggest varieties that would do well in their specific garden areas.
        If they ask about problems, provide diagnosis and organic solutions when possible.
        Keep responses concise (under 250 words) unless the user asks for detailed information.
        
        USER QUESTION: ${userMessage}
      `;

      // Use the model directly instead of chat API
      const result = await this.model.generateContent(fullPrompt);
      const response = result.text();
      
      return response;
    } catch (error) {
      console.error('Error in chat conversation:', error);
      return "I'm sorry, I encountered an error while processing your question. Please try again later or check your Gemini API key.";
    }
  }

  // Helper methods to generate simulated data based on season
  // (keeping all the original helper methods for fallback)
  
  _getSeasonalTemperature(month) {
    // Winston OR average temperatures by month (approximate)
    const avgHighs = [48, 53, 58, 63, 70, 77, 85, 85, 79, 67, 54, 47];
    const avgLows = [34, 36, 38, 41, 46, 51, 54, 54, 49, 43, 39, 34];
    
    // Generate a realistic temperature range
    const currentHigh = avgHighs[month] + Math.floor(Math.random() * 10) - 5; // +/- 5 degrees variation
    const currentLow = avgLows[month] + Math.floor(Math.random() * 8) - 4; // +/- 4 degrees variation
    const current = Math.floor((currentHigh + currentLow) / 2 + Math.random() * 5); // Current between high and low
    
    return {
      current: current,
      high: currentHigh,
      low: currentLow,
      avgHigh: avgHighs[month],
      avgLow: avgLows[month]
    };
  }
  
  _getSeasonalConditions(month) {
    // Simplified weather conditions by season
    // Higher chance of rain in winter/spring, higher chance of clear in summer
    const conditions = [
      // Winter (Dec-Feb)
      ['Cloudy', 'Rainy', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Foggy'],
      ['Cloudy', 'Rainy', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Foggy'],
      // Spring (Mar-May)
      ['Partly Cloudy', 'Light Rain', 'Scattered Showers', 'Sunny', 'Cloudy'],
      ['Partly Cloudy', 'Light Rain', 'Scattered Showers', 'Sunny', 'Cloudy'],
      ['Partly Cloudy', 'Sunny', 'Scattered Showers', 'Clear', 'Warm'],
      // Summer (Jun-Aug)
      ['Sunny', 'Clear', 'Hot', 'Warm', 'Dry'],
      ['Sunny', 'Clear', 'Hot', 'Warm', 'Dry'],
      ['Sunny', 'Clear', 'Hot', 'Warm', 'Dry'],
      // Fall (Sep-Nov)
      ['Partly Cloudy', 'Cloudy', 'Sunny', 'Light Rain', 'Foggy Morning'],
      ['Partly Cloudy', 'Cloudy', 'Light Rain', 'Foggy Morning', 'Cool'],
      ['Cloudy', 'Rainy', 'Cool', 'Partly Cloudy', 'Foggy', 'Light Frost'],
      // Back to winter
      ['Cloudy', 'Rainy', 'Cold', 'Foggy', 'Frosty']
    ];
    
    const monthConditions = conditions[month];
    return monthConditions[Math.floor(Math.random() * monthConditions.length)];
  }
  
  _getRandomPrecipitation(month) {
    // Approximate precipitation chance by month for Winston, OR
    const precipChances = [70, 65, 60, 50, 30, 15, 5, 10, 25, 50, 70, 75];
    const chance = precipChances[month] + Math.floor(Math.random() * 20) - 10; // +/- 10% variation
    
    // Amount is higher when chance is higher
    let amount = 0;
    if (Math.random() * 100 < chance) {
      if (month >= 5 && month <= 8) { // Summer months
        amount = Math.random() * 0.3; // Lighter rain in summer
      } else {
        amount = Math.random() * 0.8; // Heavier potential in winter
      }
    }
    
    return {
      chance: Math.max(0, Math.min(100, chance)), // Keep between 0-100
      amount: parseFloat(amount.toFixed(2)),
      unit: 'inches'
    };
  }
  
  _getRandomForecast(month) {
    const forecast = [];
    const baseTemp = this._getSeasonalTemperature(month);
    
    for (let i = 1; i <= 3; i++) {
      const dayVariation = Math.floor(Math.random() * 6) - 3; // +/- 3 degrees day to day
      forecast.push({
        day: i,
        high: baseTemp.high + dayVariation,
        low: baseTemp.low + dayVariation,
        condition: this._getSeasonalConditions(month),
        precipChance: Math.floor(Math.random() * 100)
      });
    }
    
    return forecast;
  }
  
  _getRandomTrends(month) {
    const trends = [
      // Winter (Dec-Feb)
      ['Consistently wet with occasional cold snaps', 'Milder than average temperatures', 'Foggy mornings with occasional frost'],
      ['Wet pattern continuing with brief dry periods', 'Slightly warmer than seasonal norms', 'Occasional overnight freezing'],
      // Spring (Mar-May)
      ['Warming trend with intermittent rain showers', 'Transitioning to spring growing conditions', 'Morning frost risk decreasing'],
      ['Variable temperatures with warming trend', 'Increasing sunshine with scattered rain', 'Good conditions for spring planting'],
      ['Steady warming with decreasing rainfall', 'Soil temperatures rising', 'Occasional late spring showers'],
      // Summer (Jun-Aug)
      ['Consistently warm and dry', 'Morning dew with afternoon heat', 'Excellent growing conditions with irrigation'],
      ['Hot days with cool nights', 'Drought conditions developing', 'Little to no rainfall expected'],
      ['Peak summer heat', 'Very dry soil conditions', 'Occasional thunderstorms possible'],
      // Fall (Sep-Nov)
      ['Gradual cooling with occasional warm days', 'Morning fog returning', 'First light rains after summer drought'],
      ['Increasing rainfall and cooling trend', 'First frost approaching', 'Soil moisture increasing'],
      ['Regular rainfall returning', 'Cold nights with moderate days', 'Winter pattern establishing'],
      // Back to winter
      ['Wet and cool conditions', 'Occasional frost and freezing', 'Regular precipitation expected']
    ];
    
    const monthTrends = trends[month];
    return monthTrends[Math.floor(Math.random() * monthTrends.length)];
  }
  
  _getUrgentRecommendations(weatherData) {
    const urgent = [];
    
    // Temperature-based recommendations
    if (weatherData.temperature.current > 85) {
      urgent.push({
        type: 'heat',
        severity: 'high',
        message: 'Protect sensitive plants from extreme heat with shade cloth and increase watering.'
      });
    } else if (weatherData.temperature.current < 40) {
      urgent.push({
        type: 'frost',
        severity: 'high',
        message: 'Protect tender plants from cold damage with row covers or bring containers inside.'
      });
    }
    
    // Precipitation-based recommendations
    if (weatherData.precipitation.chance > 70) {
      urgent.push({
        type: 'rain',
        severity: 'medium',
        message: 'Secure tall plants and ensure good drainage before heavy rain arrives.'
      });
    } else if (weatherData.precipitation.chance < 10 && weatherData.temperature.current > 75) {
      urgent.push({
        type: 'drought',
        severity: 'medium',
        message: 'Water deeply this morning to prepare for continued dry conditions.'
      });
    }
    
    // If nothing urgent, add a general maintenance task
    if (urgent.length === 0) {
      urgent.push({
        type: 'maintenance',
        severity: 'low',
        message: 'Regular garden maintenance recommended: check for pests and monitor soil moisture.'
      });
    }
    
    return urgent;
  }
  
  _getWateringRecommendations(weatherData) {
    // Base frequency on temperature and precipitation
    let frequency = 'every 2-3 days';
    
    if (weatherData.temperature.current > 85) {
      frequency = 'daily';
    } else if (weatherData.temperature.current < 65) {
      frequency = 'every 3-4 days';
    }
    
    if (weatherData.precipitation.chance > 70) {
      frequency = 'skip watering today, reassess tomorrow';
    }
    
    // Determine amount based on conditions
    let amount = 'moderate (about 1 inch)';
    
    if (weatherData.conditions.includes('Hot') || weatherData.conditions.includes('Dry')) {
      amount = 'generous (1-2 inches)';
    } else if (weatherData.conditions.includes('Cool') || weatherData.conditions.includes('Rainy')) {
      amount = 'light (0.5 inch)';
    }
    
    // Best time based on conditions
    let timing = 'early morning';
    
    if (weatherData.temperature.current > 90) {
      timing = 'very early morning (before 7am)';
    } else if (weatherData.conditions.includes('Windy')) {
      timing = 'early morning or evening when wind is calmer';
    }
    
    // Special note based on conditions
    let note = 'Focus on deep, infrequent watering to encourage root growth.';
    
    if (weatherData.precipitation.chance > 60) {
      note = 'Hold off on watering if rain is in the forecast for tomorrow.';
    } else if (weatherData.temperature.high > 85) {
      note = 'Consider using drip irrigation or soaker hoses to reduce water loss to evaporation.';
    } else if (weatherData.conditions.includes('Humid')) {
      note = 'Water at the base of plants to reduce fungal disease risk in humid conditions.';
    }
    
    return { frequency, amount, timing, note };
  }
  
  _getPlantingRecommendations(month, weatherData) {
    // Seasonal planting suggestions for Winston, OR
    const indoor = [
      // Winter (Dec-Feb)
      ['Onions', 'Leeks', 'Microgreens', 'Herbs for windowsill'],
      ['Onions', 'Leeks', 'Early tomatoes', 'Peppers', 'Eggplant'],
      // Spring (Mar-May)
      ['Tomatoes', 'Peppers', 'Basil', 'Eggplant', 'Melons'],
      ['Heat-loving herbs', 'Warm-season flowers', 'Last succession of tomatoes'],
      ['Indoor herbs', 'Microgreens'],
      // Summer (Jun-Aug)
      ['Microgreens', 'Indoor herbs', 'Fall broccoli and cauliflower'],
      ['Brussels sprouts', 'Fall cabbage', 'Winter kale'],
      ['Fall lettuces', 'Spinach', 'Cool-season crops for fall'],
      // Fall (Sep-Nov)
      ['Microgreens', 'Indoor herbs', 'Salad greens under lights'],
      ['Microgreens', 'Herbs for windowsill', 'Lettuce under lights'],
      ['Microgreens', 'Indoor herbs', 'Sprouts'],
      // Back to winter
      ['Microgreens', 'Herbs for windowsill']
    ][month];
    
    const outdoor = [
      // Winter (Dec-Feb)
      ['Garlic (if ground not frozen)', 'Bare root fruit trees', 'Bare root berry bushes'],
      ['Peas (late month)', 'Spinach (under cover)', 'Broad beans'],
      // Spring (Mar-May)
      ['Peas', 'Spinach', 'Radishes', 'Lettuce', 'Kale', 'Carrots'],
      ['Beets', 'Carrots', 'Lettuce', 'Potatoes', 'Radishes', 'Turnips', 'Strawberries'],
      ['Beans', 'Corn', 'Cucumbers', 'Squash', 'Tomatoes (after last frost)', 'Peppers'],
      // Summer (Jun-Aug)
      ['Beans', 'Corn', 'Cucumber', 'Summer squash', 'Basil'],
      ['Fall peas', 'Kale', 'Lettuce', 'Fall spinach', 'Beets', 'Carrots'],
      ['Beets', 'Carrots', 'Lettuce', 'Peas', 'Radishes', 'Spinach', 'Kale'],
      // Fall (Sep-Nov)
      ['Lettuce', 'Spinach', 'Radishes', 'Garlic', 'Cover crops'],
      ['Garlic', 'Shallots', 'Fava beans', 'Cover crops'],
      ['Garlic', 'Trees and shrubs', 'Cover crops'],
      // Back to winter
      ['Dormant fruit trees', 'Cover crops if not too wet']
    ][month];
    
    const avoid = [
      // Winter (Dec-Feb)
      ['Warm-season crops', 'Frost-sensitive plants', 'Poorly drained areas'],
      ['Warm-season crops', 'Tomatoes', 'Peppers outdoors', 'Squash'],
      // Spring (Mar-May)
      ['Heat-loving plants before soil warms', 'Melons', 'Sweet potatoes'],
      ['Heat-loving plants in cold soil', 'Tropical varieties without protection'],
      ['Fall crops', 'Cool-season crops that bolt in heat'],
      // Summer (Jun-Aug)
      ['Cool-season crops that bolt in heat', 'Lettuce in hot locations', 'Peas'],
      ['Cool-season crops without shade', 'New perennials during peak heat'],
      ['Heat-loving plants for fall harvest', 'New lawns unless irrigated well'],
      // Fall (Sep-Nov)
      ['Warm-season crops', 'Plants that can\'t mature before frost'],
      ['Frost-sensitive plants', 'Warm-season annuals', 'Late-maturing varieties'],
      ['Warm-season crops', 'Perennials too late to establish before frost'],
      // Back to winter
      ['Warm-season crops', 'Seeds in waterlogged soil', 'Frost-sensitive plants']
    ][month];
    
    // Generate weather-specific adjustments
    let adjustments = [];
    
    if (weatherData.temperature.current > 85) {
      adjustments.push('Provide afternoon shade for new plantings');
      adjustments.push('Wait until temperatures cool before planting heat-sensitive crops');
    } else if (weatherData.temperature.current < 40) {
      adjustments.push('Delay planting until temperatures warm');
      adjustments.push('Use cloches or row covers to protect new plantings');
    }
    
    if (weatherData.precipitation.chance > 70) {
      adjustments.push('Hold off on planting until soil dries out a bit');
      adjustments.push('Prepare raised beds to improve drainage');
    } else if (weatherData.conditions.includes('Dry')) {
      adjustments.push('Water thoroughly before and after planting');
      adjustments.push('Apply mulch immediately after planting');
    }
    
    // If no adjustments, add a general recommendation
    if (adjustments.length === 0) {
      adjustments.push('Current conditions are generally good for recommended plantings');
    }
    
    return { indoor, outdoor, avoid, adjustments };
  }
  
  _getMaintenanceRecommendations(month, weatherData) {
    // Regular seasonal maintenance tasks
    const regularTasks = [
      // Winter (Dec-Feb)
      ['Prune dormant fruit trees', 'Plan garden layout', 'Organize seed inventory', 'Clean tools'],
      ['Start seeds indoors', 'Prune berry bushes', 'Apply dormant spray to fruit trees', 'Prepare beds for spring'],
      // Spring (Mar-May)
      ['Apply compost to beds', 'Divide perennials', 'Set up trellises', 'Start warm-season seeds indoors'],
      ['Thin seedlings', 'Monitor for early pests', 'Apply mulch to retain moisture', 'Install drip irrigation'],
      ['Stake tall plants', 'Weed regularly', 'Begin regular feeding program', 'Thin fruit on trees'],
      // Summer (Jun-Aug)
      ['Pinch back flower heads', 'Prune spring-flowering shrubs', 'Monitor irrigation systems', 'Harvest regularly'],
      ['Summer pruning of fruit trees', 'Order fall and winter seeds', 'Maintain consistent watering', 'Deadhead flowers'],
      ['Plant fall crops', 'Begin fall cleanup', 'Divide irises and other perennials', 'Take cuttings of perennials'],
      // Fall (Sep-Nov)
      ['Harvest mature crops', 'Plant cover crops in empty beds', 'Clean up diseased plant material', 'Add compost to beds'],
      ['Mulch perennial beds', 'Plant trees and shrubs', 'Collect leaves for compost', 'Clean and store tools'],
      ['Wrap young trees for winter protection', 'Final garden cleanup', 'Mulch garlic beds', 'Protect tender perennials'],
      // Back to winter
      ['Protect sensitive plants from frost', 'Review the year\'s garden journal', 'Inventory seeds', 'Order catalogs']
    ][month];
    
    // Weather-based specific tasks
    let weatherBasedTasks = [];
    
    // Based on temperature
    if (weatherData.temperature.high > 85) {
      weatherBasedTasks.push('Water deeply in the early morning');
      weatherBasedTasks.push('Apply mulch to conserve soil moisture');
    } else if (weatherData.temperature.low < 40) {
      weatherBasedTasks.push('Protect tender plants from frost with covers');
      weatherBasedTasks.push('Hold off on fertilizing to prevent new growth that could be damaged by cold');
    }
    
    // Based on precipitation
    if (weatherData.precipitation.chance > 70) {
      weatherBasedTasks.push('Ensure good drainage in garden beds');
      weatherBasedTasks.push('Stake tall plants before rain to prevent damage');
    } else if (weatherData.precipitation.chance < 20 && month >= 5 && month <= 8) {
      weatherBasedTasks.push('Deep water trees and shrubs');
      weatherBasedTasks.push('Check mulch levels to retain soil moisture');
    }
    
    // Based on conditions
    if (weatherData.conditions.includes('Windy')) {
      weatherBasedTasks.push('Secure row covers and cloches');
      weatherBasedTasks.push('Provide wind breaks for sensitive plants');
    }
    
    // If no specific weather-based tasks, add general advice
    if (weatherBasedTasks.length === 0) {
      weatherBasedTasks.push('Focus on regular seasonal maintenance tasks');
      weatherBasedTasks.push('Monitor soil moisture and adjust watering as needed');
    }
    
    return { regularTasks, weatherBasedTasks };
  }
  
  _getWeatherAlerts(weatherData) {
    const alerts = [];
    
    // Temperature alerts
    if (weatherData.temperature.low < 32) {
      alerts.push({
        type: 'frost',
        severity: 'high',
        message: 'Frost warning: Cover sensitive plants tonight or bring containers indoors'
      });
    } else if (weatherData.temperature.high > 90) {
      alerts.push({
        type: 'heat',
        severity: 'high',
        message: 'Heat alert: Provide shade for sensitive plants and increase watering'
      });
    }
    
    // Precipitation alerts
    if (weatherData.precipitation.chance > 80 && weatherData.precipitation.amount > 0.5) {
      alerts.push({
        type: 'rain',
        severity: 'medium',
        message: 'Heavy rain expected: Ensure proper drainage and support for tall plants'
      });
    } else if (weatherData.conditions.includes('Windy')) {
      alerts.push({
        type: 'wind',
        severity: 'medium',
        message: 'Wind alert: Secure young plants, trellises, and garden structures'
      });
    }
    
    // If no alerts, add a "none" type alert
    if (alerts.length === 0) {
      alerts.push({
        type: 'none',
        severity: 'low',
        message: 'No immediate weather concerns for gardening activities'
      });
    }
    
    return alerts;
  }
}

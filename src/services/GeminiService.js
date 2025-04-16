// GeminiService.js
// This service handles interactions with Gemini API for weather data and garden recommendations
import { GoogleGenerativeAI } from "@google/genai";

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
      
      // Initialize the Google Generative AI client
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      
      // Get the Gemini Pro 2.5 model
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      // Test the model with a simple prompt to verify the API key works
      const result = await this.model.generateContent("Hello, are you working?");
      const response = await result.response;
      
      // If we get here, initialization was successful
      this._initialized = true;
      console.log("Gemini Pro 2.5 initialized successfully");
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      this._initialized = false;
      return false;
    }
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

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Try to parse the JSON response
        try {
          const weatherData = JSON.parse(text);
          weatherData.fetchedAt = new Date().toISOString();
          weatherData.source = 'Gemini Pro 2.5 AI';
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
          recommendations.source = 'Gemini Pro 2.5 AI';
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

      // Build comprehensive system prompt with all context
      const systemPrompt = `
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
      `;

      // Create a chat object to hold the conversation
      const chat = this.model.startChat({
        systemPrompt: systemPrompt,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        }
      });

      // Send the user's message and get the response
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
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
    const avgLows = [34, 36, 38, 41, 46, 51, 54, 54, 49, 43, 39];

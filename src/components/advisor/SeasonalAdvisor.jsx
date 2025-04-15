import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Chip,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Collapse,
  Tooltip
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  WaterDrop as WaterIcon,
  Nature as NatureIcon,
  LocalFlorist as PlantIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  ThermostatAuto as TemperatureIcon,
  WbSunny as SunIcon,
  Close as CloseIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import { winstonClimateData } from '../../data/winstonClimateData';
import { winstonPlants } from '../../data/winstonPlants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GeminiService from '../../services/GeminiService';

export default function SeasonalAdvisor() {
  const [currentMonth, setCurrentMonth] = useState('');
  const [monthData, setMonthData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(true);
  const { currentUser, getUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current date info
    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[now.getMonth()];
    setCurrentMonth(month);

    // Find current month's data
    const currentMonthData = winstonClimateData.monthlyData.find(
      m => m.month === month
    );
    setMonthData(currentMonthData);

    // Generate seasonal recommendations based on month
    generateRecommendations(month);

    // Try to load AI weather recommendations if API key is available
    loadWeatherData();
  }, []);

  // Function to fetch user data and check for Gemini API key
  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user data including preferences
      const userData = await getUserData();
      const geminiApiKey = userData?.preferences?.geminiApiKey;

      if (!geminiApiKey) {
        setError({
          type: 'apiKey',
          message: 'To enable AI-powered weather recommendations, please add your Gemini API key in Settings.'
        });
        setLoading(false);
        return;
      }

      // Initialize Gemini service with API key
      const geminiService = new GeminiService(geminiApiKey);
      await geminiService.initialize();

      if (!geminiService.isInitialized()) {
        setError({
          type: 'initialization',
          message: 'Unable to initialize Gemini AI service. Please check your API key.'
        });
        setLoading(false);
        return;
      }

      // Fetch weather data
      const weather = await geminiService.getCurrentWeather();
      setWeatherData(weather);

      // Generate AI gardening recommendations based on weather
      const recommendations = await geminiService.getGardeningRecommendations(weather);
      setAiRecommendations(recommendations);

      setLoading(false);
    } catch (error) {
      console.error('Error loading weather data:', error);
      setError({
        type: 'general',
        message: 'Error fetching weather data. Please try again later.'
      });
      setLoading(false);
    }
  };

  const generateRecommendations = (month) => {
    let recs = [];

    // Current month task recommendations
    switch (month) {
      case 'January':
        recs = [
          { type: 'planning', text: 'Plan your garden layout and order seeds' },
          { type: 'soilPrep', text: 'Test soil pH and add amendments as needed' },
          { type: 'planting', text: 'Start onions and leeks indoors late month' },
          { type: 'maintenance', text: 'Prune dormant fruit trees on dry days' }
        ];
        break;
      case 'February':
        recs = [
          { type: 'planting', text: 'Start tomatoes, peppers, and broccoli indoors' },
          { type: 'soilPrep', text: 'Prepare garden beds when soil is workable' },
          { type: 'maintenance', text: 'Finish pruning fruit trees before bud break' },
          { type: 'planning', text: 'Set up irrigation systems before spring planting' }
        ];
        break;
      case 'March':
        recs = [
          { type: 'planting', text: 'Direct sow peas, spinach, radishes, and carrots' },
          { type: 'planting', text: 'Plant potatoes and onion sets' },
          { type: 'maintenance', text: 'Apply dormant spray to fruit trees' },
          { type: 'soilPrep', text: 'Add compost to garden beds' }
        ];
        break;
      case 'April':
        recs = [
          { type: 'planting', text: 'Direct sow beets, lettuce, chard, and more carrots' },
          { type: 'planting', text: 'Transplant cole crops after mid-month' },
          { type: 'maintenance', text: 'Monitor for pests as weather warms' },
          { type: 'watering', text: 'Begin regular watering of newly planted areas' }
        ];
        break;
      case 'May':
        recs = [
          { type: 'planting', text: 'Plant warm-season crops after mid-month (tomatoes, peppers, squash)' },
          { type: 'planting', text: 'Direct sow beans and corn when soil is warm' },
          { type: 'maintenance', text: 'Thin seedlings to proper spacing' },
          { type: 'watering', text: 'Establish regular irrigation schedule' }
        ];
        break;
      case 'June':
        recs = [
          { type: 'watering', text: 'Increase watering as temperatures rise' },
          { type: 'maintenance', text: 'Apply mulch to conserve moisture' },
          { type: 'planting', text: 'Begin succession planting of lettuce and greens' },
          { type: 'harvesting', text: 'Harvest spring crops like peas and early greens' }
        ];
        break;
      case 'July':
        recs = [
          { type: 'watering', text: 'Water deeply 1-2 times per week in early morning' },
          { type: 'maintenance', text: 'Monitor for pests intensively' },
          { type: 'planting', text: 'Plant fall crops of broccoli and cabbage' },
          { type: 'harvesting', text: 'Harvest summer crops frequently to encourage production' }
        ];
        break;
      case 'August':
        recs = [
          { type: 'planting', text: 'Direct sow fall crops of lettuce, spinach, and radishes' },
          { type: 'watering', text: 'Maintain consistent irrigation schedule' },
          { type: 'harvesting', text: 'Harvest and preserve peak summer crops' },
          { type: 'maintenance', text: 'Remove diseased plants promptly' }
        ];
        break;
      case 'September':
        recs = [
          { type: 'planting', text: 'Plant garlic and cover crops' },
          { type: 'planting', text: 'Install cold frames for extending growing season' },
          { type: 'maintenance', text: 'Prepare for first light frosts' },
          { type: 'harvesting', text: 'Harvest winter squash and pumpkins' }
        ];
        break;
      case 'October':
        recs = [
          { type: 'harvesting', text: 'Harvest frost-sensitive crops before freezing' },
          { type: 'maintenance', text: 'Plant cover crops in empty beds' },
          { type: 'planning', text: 'Evaluate what did well and plan for next year' },
          { type: 'maintenance', text: 'Protect cold-hardy crops for continued harvest' }
        ];
        break;
      case 'November':
        recs = [
          { type: 'planting', text: 'Plant garlic cloves for next year' },
          { type: 'maintenance', text: 'Clean up garden debris' },
          { type: 'soilPrep', text: 'Add compost to garden beds' },
          { type: 'maintenance', text: 'Mulch perennials for winter protection' }
        ];
        break;
      case 'December':
        recs = [
          { type: 'planning', text: 'Review seed catalogs and plan next year\'s garden' },
          { type: 'maintenance', text: 'Check stored produce for quality' },
          { type: 'maintenance', text: 'Protect sensitive plants during cold snaps' },
          { type: 'planning', text: 'Take stock of garden supplies and equipment' }
        ];
        break;
      default:
        recs = [
          { type: 'planning', text: 'Check monthly advice for seasonal tasks' }
        ];
    }

    setRecommendations(recs);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'planting':
        return <PlantIcon color="success" />;
      case 'watering':
        return <WaterIcon color="primary" />;
      case 'maintenance':
        return <InfoIcon color="action" />;
      case 'planning':
        return <CalendarIcon color="secondary" />;
      case 'harvesting':
        return <NatureIcon sx={{ color: '#f57c00' }} />;
      case 'soilPrep':
        return <NatureIcon color="warning" />;
      default:
        return <InfoIcon />;
    }
  };

  const getPlantRecommendations = () => {
    // Determine what to plant now based on current month
    const now = new Date();
    const month = now.getMonth(); // 0-11
    
    // Default recommendations in case specific plant categories are not available
    const defaultRecommendations = [
      { name: 'Check plant database', traits: 'View all available plants' }
    ];

    try {
      if (month >= 2 && month <= 4) { // March-May
        return {
          title: "Good to Plant Now",
          items: [
            ...(winstonPlants.leafyGreens?.lettuce?.heading || []),
            ...(winstonPlants.rootVegetables?.carrots || []).slice(0, 2),
            ...(winstonPlants.rootVegetables?.radishes || []).slice(0, 1),
            ...(winstonPlants.beans?.bush || []).slice(0, 2)
          ].filter(item => item) // Filter out any undefined items
        };
      } else if (month >= 5 && month <= 7) { // June-August
        return {
          title: "Summer Heat Tolerant Options",
          items: [
            ...(winstonPlants.vegetables?.tomatoes?.cherry || []).slice(0, 2),
            ...(winstonPlants.vegetables?.squash?.summer?.zucchini || []).slice(0, 2),
            ...(winstonPlants.droughtTolerant?.vegetables || []).slice(0, 3)
          ].filter(item => item)
        };
      } else if (month >= 8 && month <= 9) { // September-October
        return {
          title: "Fall Planting Recommendations",
          items: [
            ...(winstonPlants.vegetables?.brassicas?.broccoli || []).slice(0, 2),
            ...(winstonPlants.leafyGreens?.kale || []).slice(0, 2),
            ...(winstonPlants.seasonExtenders?.winterCrops || []).slice(0, 2)
          ].filter(item => item)
        };
      } else { // Winter (Nov-Feb)
        return {
          title: "Winter Planning Recommendations",
          items: [
            ...(winstonPlants.beginnerFriendly?.cantFailVegetables || []).slice(0, 3)
          ].filter(item => item)
        };
      }
    } catch (error) {
      console.warn("Error accessing plant data:", error);
      return {
        title: "Seasonal Planting Guide",
        items: defaultRecommendations
      };
    }
  };

  // Function to render the severity icon for weather alerts
  const getAlertSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <WarningIcon sx={{ color: '#d32f2f' }} />;  // Red
      case 'medium':
        return <WarningIcon sx={{ color: '#f57c00' }} />;  // Orange
      case 'low':
        return <InfoIcon sx={{ color: '#0288d1' }} />;     // Blue
      default:
        return <InfoIcon color="action" />;
    }
  };

  if (!monthData) {
    return <Box>Loading...</Box>;
  }

  const plantRecs = getPlantRecommendations();

  return (
    <Box sx={{ mb: 4 }}>
      {error && alertOpen && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setAlertOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error.message}
          {error.type === 'apiKey' && (
            <Button 
              size="small" 
              sx={{ ml: 2 }} 
              onClick={() => navigate('/settings')}
            >
              Go to Settings
            </Button>
          )}
        </Alert>
      )}

      {/* AI-Powered Weather Recommendations */}
      {weatherData && aiRecommendations && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f9f9ff', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              <SmartToyIcon sx={{ mr: 1 }} /> AI Weather Assistant
            </Typography>
            <Tooltip title="Refresh weather data">
              <IconButton 
                onClick={loadWeatherData} 
                disabled={loading}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Chip
                  icon={<TemperatureIcon />}
                  label={`${weatherData.temperature.current}°F (${weatherData.temperature.low}°F - ${weatherData.temperature.high}°F)`}
                  color="primary"
                />
                <Chip
                  icon={<SunIcon />}
                  label={weatherData.conditions}
                  color="warning"
                />
                <Chip
                  icon={<WaterIcon />}
                  label={`${weatherData.precipitation.chance}% chance of precipitation`}
                  color="info"
                />
              </Box>

              {/* Weather Alerts */}
              {aiRecommendations.weatherAlert.length > 0 && aiRecommendations.weatherAlert[0].type !== 'none' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Weather Alerts
                  </Typography>
                  <List disablePadding>
                    {aiRecommendations.weatherAlert.map((alert, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          bgcolor: alert.severity === 'high' ? '#ffebee' : 
                                 alert.severity === 'medium' ? '#fff3e0' : '#e1f5fe',
                          mb: 1,
                          borderRadius: 1
                        }}
                      >
                        <ListItemIcon>
                          {getAlertSeverityIcon(alert.severity)}
                        </ListItemIcon>
                        <ListItemText primary={alert.message} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Urgent Recommendations */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Today's Priority Tasks
                </Typography>
                <List disablePadding>
                  {aiRecommendations.urgent.map((rec, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        bgcolor: rec.severity === 'high' ? '#ffebee' : 
                               rec.severity === 'medium' ? '#fff3e0' : '#f5f5f5',
                        mb: 1,
                        borderRadius: 1
                      }}
                    >
                      <ListItemIcon>
                        {getIconForType(rec.type)}
                      </ListItemIcon>
                      <ListItemText primary={rec.message} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Watering Recommendations */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Watering Recommendations
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><WaterIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Frequency" 
                      secondary={aiRecommendations.watering.frequency} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WaterIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Amount" 
                      secondary={aiRecommendations.watering.amount}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WaterIcon color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Best Time" 
                      secondary={aiRecommendations.watering.timing}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                    <ListItemText 
                      primary="Tip" 
                      secondary={aiRecommendations.watering.note}
                    />
                  </ListItem>
                </List>
              </Box>

              {/* Weather-Specific Planting Adjustments */}
              {aiRecommendations.planting.adjustments && 
               aiRecommendations.planting.adjustments.length > 0 && 
               aiRecommendations.planting.adjustments[0] !== 'No weather-based adjustments needed' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Weather-Based Planting Adjustments
                  </Typography>
                  <List>
                    {aiRecommendations.planting.adjustments.map((adjustment, index) => (
                      <ListItem key={index}>
                        <ListItemIcon><InfoIcon color="warning" /></ListItemIcon>
                        <ListItemText primary={adjustment} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Traditional Monthly Recommendations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Winston Garden Advisor: {currentMonth}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Chip
            icon={<CalendarIcon />}
            label={`${monthData.avgHigh}°F high / ${monthData.avgLow}°F low`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<WaterIcon />}
            label={`${monthData.precipitation}" precipitation`}
            color="info"
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body1" paragraph>
          {monthData.notes}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          This Month's Tasks
        </Typography>
        
        <List>
          {recommendations.map((rec, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {getIconForType(rec.type)}
              </ListItemIcon>
              <ListItemText primary={rec.text} />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {plantRecs.title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {plantRecs.items.map((plant, index) => (
              <Chip
                key={index}
                icon={<PlantIcon />}
                label={plant.name}
                color="success"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
          
          <Button 
            variant="outlined" 
            color="primary" 
            endIcon={<ArrowIcon />}
            onClick={() => navigate('/plants')}
            sx={{ mt: 1 }}
          >
            Browse All Plants
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
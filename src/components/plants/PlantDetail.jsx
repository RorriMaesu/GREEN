import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  Opacity as WaterIcon,
  WbSunny as SunIcon,
  Spa as HarvestIcon,
  BugReport as PestIcon,
  Restaurant as NutritionIcon,
  LocalFlorist as CompanionIcon,
  DoNotDisturb as AvoidIcon
} from '@mui/icons-material';
import { useGarden } from '../../contexts/GardenContext';
import { format, addDays } from 'date-fns';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plant-tabpanel-${index}`}
      aria-labelledby={`plant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PlantDetail() {
  const { plantingId } = useParams();
  const [planting, setPlanting] = useState(null);
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { userPlantings, plants, gardens } = useGarden();
  const navigate = useNavigate();

  useEffect(() => {
    if (userPlantings.length > 0 && plants.length > 0) {
      const foundPlanting = userPlantings.find(p => p.id === plantingId);

      if (foundPlanting) {
        setPlanting(foundPlanting);

        // Find the plant data
        const plantData = plants.find(p => p.id === foundPlanting.plantId);
        if (plantData) {
          setPlant(plantData);
        } else {
          setError('Plant information not found');
        }
      } else {
        setError('Planting not found');
      }

      setLoading(false);
    }
  }, [plantingId, userPlantings, plants]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !planting || !plant) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/garden')}
          sx={{ mb: 2 }}
        >
          Back to Garden
        </Button>
        <Alert severity="error">{error || 'Plant information not found'}</Alert>
      </Box>
    );
  }

  // Find garden and area information
  const garden = gardens.find(g => g.id === planting.gardenId);
  const area = garden?.areas.find(a => a.id === planting.areaId);

  // Safe function for date handling
  const getDateObject = (dateValue) => {
    try {
      if (dateValue && typeof dateValue.toDate === 'function') {
        return dateValue.toDate();
      } else if (dateValue) {
        return new Date(dateValue);
      }
      return new Date();
    } catch (error) {
      console.error("Error processing date:", error);
      return new Date();
    }
  };

  // Calculate expected harvest date
  const datePlanted = getDateObject(planting.datePlanted);
  const harvestDate = plant.daysToMaturity
    ? addDays(datePlanted, plant.daysToMaturity)
    : null;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/garden')}
        sx={{ mb: 3 }}
      >
        Back to Garden
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
          <Box sx={{ width: { xs: '100%', md: '66.66%' }, p: 1.5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {plant.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {plant.variety}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip label={plant.type} color="primary" />
              <Chip
                label={planting.status}
                color={planting.status === 'active' ? 'success' : 'default'}
              />
              {plant.greenhouseSuitable && (
                <Chip label="Greenhouse Suitable" variant="outlined" />
              )}
              {plant.isPerennial && (
                <Chip label="Perennial" variant="outlined" />
              )}
            </Box>

            <Typography variant="body1" gutterBottom>
              <strong>Planted:</strong> {format(datePlanted, 'MMMM d, yyyy')}
            </Typography>
            {harvestDate && (
              <Typography variant="body1" gutterBottom>
                <strong>Expected Harvest:</strong> {format(harvestDate, 'MMMM d, yyyy')}
                {plant.daysToMaturity && ` (${plant.daysToMaturity} days from planting)`}
              </Typography>
            )}
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> {area?.name || 'Unknown'} in {garden?.name || 'Unknown'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Quantity:</strong> {planting.quantity}
            </Typography>
            {planting.locationNotes && (
              <Typography variant="body1" gutterBottom>
                <strong>Notes:</strong> {planting.locationNotes}
              </Typography>
            )}
          </Box>

          <Box sx={{ width: { xs: '100%', md: '33.33%' }, p: 1.5 }}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>
                Quick Info
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SunIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sun Requirement"
                    secondary={plant.sunRequirement}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WaterIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Watering Needs"
                    secondary={
                      plant.wateringNeeds === 'high' ? 'High - Keep soil consistently moist' :
                      plant.wateringNeeds === 'medium' ? 'Medium - Allow top inch to dry between watering' :
                      'Low - Allow to dry out between watering'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <HarvestIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Spacing"
                    secondary={`${plant.spacing} inches`}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Growing Guide" icon={<InfoIcon />} iconPosition="start" />
          <Tab label="Nutrition" icon={<NutritionIcon />} iconPosition="start" />
          <Tab label="Pests & Diseases" icon={<PestIcon />} iconPosition="start" />
          <Tab label="Companion Planting" icon={<CompanionIcon />} iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            How to Grow {plant.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {plant.howToGuide || 'No growing information available for this plant.'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ width: '50%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Planting Months
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {plant.plantingMonths?.map(month => (
                  <Chip
                    key={month}
                    label={new Date(2023, month - 1, 1).toLocaleString('default', { month: 'short' })}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ width: '50%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Harvesting Months
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {plant.harvestMonths?.map(month => (
                  <Chip
                    key={month}
                    label={new Date(2023, month - 1, 1).toLocaleString('default', { month: 'short' })}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Nutritional Benefits
          </Typography>
          <Typography variant="body1">
            {plant.nutritionalInfo || 'No nutritional information available for this plant.'}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Common Pests & Diseases
          </Typography>
          <Typography variant="body1" paragraph>
            {plant.pestInfo || 'No pest information available for this plant.'}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Organic Control Methods
          </Typography>
          <Typography variant="body1" paragraph>
            • Regular inspection is key to early detection and control
          </Typography>
          <Typography variant="body1" paragraph>
            • Healthy soil and proper spacing help prevent many issues
          </Typography>
          <Typography variant="body1" paragraph>
            • Consider companion planting to naturally deter pests
          </Typography>
          <Typography variant="body1">
            • For specific treatments, consult the Winston, OR gardening guide
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ width: '50%' }}>
              <Typography variant="h6" gutterBottom>
                Good Companions
              </Typography>
              {plant.companionPlants && plant.companionPlants.length > 0 ? (
                <List>
                  {plant.companionPlants.map(companionId => {
                    const companionPlant = plants.find(p => p.id === companionId);
                    return (
                      <ListItem key={companionId}>
                        <ListItemIcon>
                          <CompanionIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={companionPlant?.name || companionId}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body1">
                  No specific companion plants listed.
                </Typography>
              )}
            </Box>

            <Box sx={{ width: '50%' }}>
              <Typography variant="h6" gutterBottom>
                Plants to Avoid
              </Typography>
              {plant.avoidPlants && plant.avoidPlants.length > 0 ? (
                <List>
                  {plant.avoidPlants.map(avoidId => {
                    const avoidPlant = plants.find(p => p.id === avoidId);
                    return (
                      <ListItem key={avoidId}>
                        <ListItemIcon>
                          <AvoidIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={avoidPlant?.name || avoidId}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body1">
                  No specific plants to avoid listed.
                </Typography>
              )}
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

import { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalFlorist as PlantIcon,
  Spa as EcoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGarden } from '../../contexts/GardenContext';
import AddPlantingDialog from './AddPlantingDialog';

export default function GardenView() {
  const [selectedGardenIndex, setSelectedGardenIndex] = useState(0);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [addPlantingOpen, setAddPlantingOpen] = useState(false);
  const { gardens, userPlantings, plants, loading, deletePlanting } = useGarden();
  const navigate = useNavigate();

  const formatDate = (dateValue) => {
    try {
      // For Firestore Timestamp objects with toDate method
      if (dateValue && typeof dateValue.toDate === 'function') {
        return dateValue.toDate().toLocaleDateString();
      } else if (dateValue) {
        // For regular Date strings or objects
        return new Date(dateValue).toLocaleDateString();
      } 
      return 'Unknown date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (gardens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to GREEN!
        </Typography>
        <Typography variant="body1" paragraph>
          Let's set up your garden to get started.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/garden/setup')}
        >
          Set Up My Garden
        </Button>
      </Box>
    );
  }

  const selectedGarden = gardens[selectedGardenIndex];
  const selectedArea = selectedGarden.areas[selectedAreaIndex];

  // Filter plantings for the selected area
  const areaPlantings = userPlantings.filter(
    planting => planting.gardenId === selectedGarden.id && planting.areaId === selectedArea.id
  );

  const handleGardenChange = (event, newValue) => {
    setSelectedGardenIndex(newValue);
    setSelectedAreaIndex(0); // Reset area selection when garden changes
  };

  const handleAreaChange = (event, newValue) => {
    setSelectedAreaIndex(newValue);
  };

  const handleAddPlanting = () => {
    setAddPlantingOpen(true);
  };

  const handleAddPlantingClose = () => {
    setAddPlantingOpen(false);
  };

  const handleDeletePlanting = async (plantingId) => {
    try {
      await deletePlanting(plantingId);
    } catch (error) {
      console.error("Error deleting planting:", error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Garden
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate('/garden/edit')}
        >
          Edit Garden
        </Button>
      </Box>

      {gardens.length > 1 && (
        <Tabs
          value={selectedGardenIndex}
          onChange={handleGardenChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {gardens.map((garden) => (
            <Tab key={garden.id} label={garden.name} />
          ))}
        </Tabs>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {selectedGarden.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Climate Zone: {selectedGarden.climateZone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Frost: {formatDate(selectedGarden.lastFrost)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          First Frost: {formatDate(selectedGarden.firstFrost)}
        </Typography>
      </Paper>

      <Tabs
        value={selectedAreaIndex}
        onChange={handleAreaChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {selectedGarden.areas.map((area, index) => (
          <Tab
            key={area.id}
            label={area.name}
            icon={area.type === 'greenhouse' ? <EcoIcon /> : <PlantIcon />}
            iconPosition="start"
          />
        ))}
      </Tabs>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {selectedArea.name}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPlanting}
          >
            Add Plant
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {selectedArea.type === 'greenhouse' ? 'Greenhouse' : 'Outdoor Bed'} •
          {selectedArea.length} ft × {selectedArea.width} ft •
          {selectedArea.length * selectedArea.width} sq ft
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {areaPlantings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No plants in this area yet
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddPlanting}
            sx={{ mt: 1 }}
          >
            Add Your First Plant
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {areaPlantings.map((planting) => {
            const plantData = plants.find(p => p.id === planting.plantId) || {};
            return (
              <Grid key={planting.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, padding: 1.5 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div">
                        {plantData.name}
                      </Typography>
                      <Chip
                        label={planting.status}
                        color={planting.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {plantData.variety}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Planted: {formatDate(planting.datePlanted)}
                    </Typography>
                    <Typography variant="body2">
                      Quantity: {planting.quantity}
                    </Typography>
                    {planting.locationNotes && (
                      <Typography variant="body2" color="text.secondary">
                        Notes: {planting.locationNotes}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/plants/${planting.id}`)}>
                      Details
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      sx={{ marginLeft: 'auto' }}
                      onClick={() => handleDeletePlanting(planting.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <AddPlantingDialog
        open={addPlantingOpen}
        onClose={handleAddPlantingClose}
        gardenId={selectedGarden.id}
        areaId={selectedArea.id}
        areaName={selectedArea.name}
      />
    </Box>
  );
}

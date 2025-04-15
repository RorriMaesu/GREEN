import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useGarden } from '../../contexts/GardenContext';

export default function AddPlantingDialog({ open, onClose, gardenId, areaId, areaName }) {
  const [plantId, setPlantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [datePlanted, setDatePlanted] = useState(new Date().toISOString().split('T')[0]);
  const [locationNotes, setLocationNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { plants, addPlanting } = useGarden();

  const handleSubmit = async () => {
    if (!plantId) {
      setError('Please select a plant');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const plantingData = {
        plantId,
        gardenId,
        areaId,
        quantity: Number(quantity),
        datePlanted,
        locationNotes,
        plantName: plants.find(p => p.id === plantId)?.name || ''
      };
      
      await addPlanting(plantingData);
      handleClose();
    } catch (error) {
      setError('Failed to add planting: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPlantId('');
    setQuantity(1);
    setDatePlanted(new Date().toISOString().split('T')[0]);
    setLocationNotes('');
    setError('');
    onClose();
  };

  // Get selected plant details
  const selectedPlant = plants.find(p => p.id === plantId);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Plant to {areaName}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required margin="normal">
              <InputLabel id="plant-select-label">Select Plant</InputLabel>
              <Select
                labelId="plant-select-label"
                id="plant-select"
                value={plantId}
                label="Select Plant"
                onChange={(e) => setPlantId(e.target.value)}
              >
                {plants.map((plant) => (
                  <MenuItem key={plant.id} value={plant.id}>
                    {plant.name} - {plant.variety}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="quantity"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="datePlanted"
              label="Date Planted"
              type="date"
              value={datePlanted}
              onChange={(e) => setDatePlanted(e.target.value)}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="locationNotes"
              label="Location Notes"
              placeholder="e.g., North end of bed, near the fence"
              value={locationNotes}
              onChange={(e) => setLocationNotes(e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
        
        {selectedPlant && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Plant Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Type:</strong> {selectedPlant.type}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Sun Requirement:</strong> {selectedPlant.sunRequirement}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Days to Maturity:</strong> {selectedPlant.daysToMaturity}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Spacing:</strong> {selectedPlant.spacing} inches
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Watering Needs:</strong> {selectedPlant.wateringNeeds}
            </Typography>
            <Typography variant="body2">
              <strong>Nutritional Info:</strong> {selectedPlant.nutritionalInfo}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          Add Plant
        </Button>
      </DialogActions>
    </Dialog>
  );
}

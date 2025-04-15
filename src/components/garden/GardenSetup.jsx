import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { useGarden } from '../../contexts/GardenContext';

const steps = ['Garden Information', 'Garden Areas', 'Confirm'];

export default function GardenSetup() {
  const [activeStep, setActiveStep] = useState(0);
  const [gardenName, setGardenName] = useState('My Winston Garden');
  const [climateZone, setClimateZone] = useState('8b/9a');
  const [lastFrost, setLastFrost] = useState('2023-04-01');
  const [firstFrost, setFirstFrost] = useState('2023-11-05');
  const [areas, setAreas] = useState([
    { id: 'area1', name: 'Perimeter Bed', type: 'outdoor', length: 80, width: 2 },
    { id: 'area2', name: 'Greenhouse 1', type: 'greenhouse', length: 20, width: 10 },
    { id: 'area3', name: 'Greenhouse 2', type: 'greenhouse', length: 20, width: 10 }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createGarden } = useGarden();
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAreaChange = (index, field, value) => {
    const newAreas = [...areas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    setAreas(newAreas);
  };

  const addArea = () => {
    setAreas([...areas, {
      id: `area${areas.length + 1}`,
      name: `Area ${areas.length + 1}`,
      type: 'outdoor',
      length: 10,
      width: 10
    }]);
  };

  const removeArea = (index) => {
    const newAreas = [...areas];
    newAreas.splice(index, 1);
    setAreas(newAreas);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setLoading(true);

      const gardenData = {
        name: gardenName,
        climateZone,
        lastFrost: new Date(lastFrost),
        firstFrost: new Date(firstFrost),
        areas
      };

      await createGarden(gardenData);
      navigate('/garden');
    } catch (error) {
      setError('Failed to create garden: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Garden Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="gardenName"
                  name="gardenName"
                  label="Garden Name"
                  fullWidth
                  variant="outlined"
                  value={gardenName}
                  onChange={(e) => setGardenName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="climateZone"
                  name="climateZone"
                  label="Climate Zone"
                  fullWidth
                  variant="outlined"
                  value={climateZone}
                  onChange={(e) => setClimateZone(e.target.value)}
                  helperText="Winston, OR is in USDA Hardiness Zones 8b/9a"
                />
              </Grid>
              <Grid sm={6} xs={12}>
                <TextField
                  required
                  id="lastFrost"
                  name="lastFrost"
                  label="Average Last Frost Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={lastFrost}
                  onChange={(e) => setLastFrost(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Typically around April 1st"
                />
              </Grid>
              <Grid sm={6} xs={12}>
                <TextField
                  required
                  id="firstFrost"
                  name="firstFrost"
                  label="Average First Frost Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={firstFrost}
                  onChange={(e) => setFirstFrost(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Typically around November 5th"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Garden Areas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Define the different areas in your garden. For Winston, OR, we've pre-configured a perimeter bed and two greenhouses.
            </Typography>

            {areas.map((area, index) => (
              <Paper key={area.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid sm={6} xs={12}>
                    <TextField
                      required
                      label="Area Name"
                      fullWidth
                      variant="outlined"
                      value={area.name}
                      onChange={(e) => handleAreaChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <TextField
                      select
                      label="Area Type"
                      fullWidth
                      variant="outlined"
                      value={area.type}
                      onChange={(e) => handleAreaChange(index, 'type', e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="outdoor">Outdoor Bed</option>
                      <option value="greenhouse">Greenhouse</option>
                      <option value="container">Container Garden</option>
                    </TextField>
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <TextField
                      required
                      label="Length (feet)"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={area.length}
                      onChange={(e) => handleAreaChange(index, 'length', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid sm={6} xs={12}>
                    <TextField
                      required
                      label="Width (feet)"
                      type="number"
                      fullWidth
                      variant="outlined"
                      value={area.width}
                      onChange={(e) => handleAreaChange(index, 'width', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeArea(index)}
                      disabled={areas.length <= 1}
                    >
                      Remove Area
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button variant="outlined" onClick={addArea} sx={{ mt: 2 }}>
              Add Another Area
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Garden Setup
            </Typography>
            <Typography variant="body1" gutterBottom>
              Garden Name: {gardenName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Climate Zone: {climateZone}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Last Frost Date: {new Date(lastFrost).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              First Frost Date: {new Date(firstFrost).toLocaleDateString()}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Garden Areas:
            </Typography>
            {areas.map((area) => (
              <Paper key={area.id} elevation={1} sx={{ p: 2, mb: 1 }}>
                <Typography variant="body1">
                  {area.name} ({area.type}): {area.length}' x {area.width}'
                  {area.length && area.width ? ` (${area.length * area.width} sq ft)` : ''}
                </Typography>
              </Paper>
            ))}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Garden Setup
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              Create Garden
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

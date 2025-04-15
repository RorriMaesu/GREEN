import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  WaterDrop as WaterIcon, 
  LocalFlorist as PlantIcon, 
  Spa as HarvestIcon, 
  BugReport as PestIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useGarden } from '../../contexts/GardenContext';
import { format } from 'date-fns';

export default function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { tasks, plants, completeTask } = useGarden();
  const navigate = useNavigate();

  // Safe function for date handling
  const formatDate = (dateValue) => {
    try {
      if (dateValue && typeof dateValue.toDate === 'function') {
        return format(dateValue.toDate(), 'MMMM d, yyyy');
      } else if (dateValue) {
        return format(new Date(dateValue), 'MMMM d, yyyy');
      }
      return 'Unknown date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === taskId);
      
      if (foundTask) {
        setTask(foundTask);
        
        // Find the related plant
        if (foundTask.plantingId) {
          const relatedPlant = plants.find(p => p.id === foundTask.plantId);
          setPlant(relatedPlant || null);
        }
      } else {
        setError('Task not found');
      }
      
      setLoading(false);
    }
  }, [taskId, tasks, plants]);

  const handleCompleteTask = async () => {
    try {
      setError('');
      await completeTask(taskId);
      // Update the local task state
      setTask(prev => ({ ...prev, status: 'completed', completedAt: new Date() }));
    } catch (error) {
      console.error('Error completing task:', error);
      setError(error.message || 'Failed to complete task');
    }
  };

  const getTaskIcon = (taskType) => {
    switch (taskType) {
      case 'water':
        return <WaterIcon fontSize="large" color="primary" />;
      case 'plant':
        return <PlantIcon fontSize="large" color="success" />;
      case 'harvest':
        return <HarvestIcon fontSize="large" style={{ color: '#f57c00' }} />;
      case 'pestCheck':
        return <PestIcon fontSize="large" color="warning" />;
      default:
        return <InfoIcon fontSize="large" />;
    }
  };

  const getTaskTypeLabel = (taskType) => {
    switch (taskType) {
      case 'water':
        return 'Watering';
      case 'plant':
        return 'Planting';
      case 'harvest':
        return 'Harvesting';
      case 'pestCheck':
        return 'Pest Check';
      default:
        return 'Task';
    }
  };

  const getTaskInstructions = (taskType) => {
    switch (taskType) {
      case 'water':
        return (
          <>
            <Typography variant="h6" gutterBottom>Watering Instructions</Typography>
            <Typography variant="body1" paragraph>
              Water deeply at the base of the plant, avoiding the leaves to prevent disease.
            </Typography>
            <Typography variant="body1" paragraph>
              The best time to water is early morning or late evening to minimize evaporation.
            </Typography>
            <Typography variant="body1">
              Check soil moisture by inserting your finger about 1 inch into the soil. If it feels dry, it's time to water.
            </Typography>
          </>
        );
      case 'harvest':
        return (
          <>
            <Typography variant="h6" gutterBottom>Harvesting Tips</Typography>
            <Typography variant="body1" paragraph>
              Harvest in the morning when temperatures are cooler for the best flavor and shelf life.
            </Typography>
            <Typography variant="body1" paragraph>
              Use clean, sharp tools to avoid damaging the plant.
            </Typography>
            <Typography variant="body1">
              Regular harvesting encourages continued production in many plants.
            </Typography>
          </>
        );
      case 'pestCheck':
        return (
          <>
            <Typography variant="h6" gutterBottom>Pest Scouting Guide</Typography>
            <Typography variant="body1" paragraph>
              Check both the tops and undersides of leaves for insects, eggs, or damage.
            </Typography>
            <Typography variant="body1" paragraph>
              Look for holes, discoloration, wilting, or distorted growth which may indicate pest problems.
            </Typography>
            <Typography variant="body1">
              If you find pests, identify them before treating. Many insects are beneficial or harmless.
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/tasks')}
          sx={{ mb: 2 }}
        >
          Back to Tasks
        </Button>
        <Alert severity="error">{error || 'Task not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/tasks')}
        sx={{ mb: 3 }}
      >
        Back to Tasks
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getTaskIcon(task.taskType)}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" component="h1">
              {getTaskTypeLabel(task.taskType)} Task
            </Typography>
            <Chip 
              label={task.status === 'completed' ? 'Completed' : formatDate(task.dueDate)} 
              color={task.status === 'completed' ? 'success' : 'primary'}
              variant={task.status === 'completed' ? 'filled' : 'outlined'}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {task.details}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
          <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
            <Typography variant="body1">
              <strong>Plant:</strong> {task.relatedPlantName}
            </Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
            <Typography variant="body1">
              <strong>Location:</strong> {task.relatedAreaId}
            </Typography>
          </Box>
          {task.recurring && (
            <Box sx={{ width: '100%', px: 1, mt: 1 }}>
              <Typography variant="body1">
                <strong>Recurring:</strong> Every {task.recurringDays} days
              </Typography>
            </Box>
          )}
        </Box>

        {task.status !== 'completed' && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CheckCircleIcon />}
            onClick={handleCompleteTask}
            sx={{ mt: 3 }}
            fullWidth
          >
            Mark as Completed
          </Button>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {getTaskInstructions(task.taskType)}
      </Paper>

      {plant && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Plant Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {plant.name} ({plant.variety})
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Type:</strong> {plant.type}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Days to Maturity:</strong> {plant.daysToMaturity}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Watering Needs:</strong> {plant.wateringNeeds}
            </Typography>
            {plant.pestInfo && (
              <Typography variant="body1" gutterBottom>
                <strong>Pest Information:</strong> {plant.pestInfo}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => navigate(`/plants/${plant.id}`)}>
              View Plant Details
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
}

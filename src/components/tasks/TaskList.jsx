import { useState } from 'react';
import { 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction, 
  IconButton, 
  Checkbox, 
  Chip, 
  Divider, 
  Paper, 
  Tabs, 
  Tab,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  WaterDrop as WaterIcon, 
  LocalFlorist as PlantIcon, 
  Spa as HarvestIcon, 
  BugReport as PestIcon,
  Info as InfoIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGarden } from '../../contexts/GardenContext';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';

export default function TaskList() {
  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { tasks, completeTask, loading } = useGarden();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTaskComplete = async (taskId, event) => {
    event.stopPropagation();
    try {
      setErrorMessage('');
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
      // Extract the specific error message about scheduled dates
      if (error.message && error.message.includes('scheduled for')) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to complete the task. Please try again.');
      }
      setSnackbarOpen(true);
    }
  };

  const getTaskIcon = (taskType) => {
    switch (taskType) {
      case 'water':
        return <WaterIcon color="primary" />;
      case 'plant':
        return <PlantIcon color="success" />;
      case 'harvest':
        return <HarvestIcon style={{ color: '#f57c00' }} />;
      case 'pestCheck':
        return <PestIcon color="warning" />;
      default:
        return <InfoIcon />;
    }
  };

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

  const getDateLabel = (date) => {
    const taskDate = getDateObject(date);
    
    if (isToday(taskDate)) {
      return 'Today';
    } else if (isTomorrow(taskDate)) {
      return 'Tomorrow';
    } else if (isPast(taskDate)) {
      return 'Overdue';
    } else if (isThisWeek(taskDate)) {
      return format(taskDate, 'EEEE'); // Day name
    } else {
      return format(taskDate, 'MMM d'); // Month day
    }
  };

  // Filter tasks based on tab
  const filteredTasks = tasks.filter(task => {
    if (task.status === 'completed') return tabValue === 3;
    
    const taskDate = getDateObject(task.dueDate);
    
    if (tabValue === 0) return true; // All pending tasks
    if (tabValue === 1) return isToday(taskDate) || isPast(taskDate); // Today + Overdue
    if (tabValue === 2) return isThisWeek(taskDate) && !isToday(taskDate); // This week (excluding today)
    
    return false;
  });

  // Sort tasks: overdue first, then by date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = getDateObject(a.dueDate);
    const dateB = getDateObject(b.dueDate);
    
    // First sort by completion status
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    // Then sort by date
    if (isPast(dateA) && !isPast(dateB)) return -1;
    if (!isPast(dateA) && isPast(dateB)) return 1;
    
    return dateA - dateB;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Garden Tasks
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<FilterIcon />}
          onClick={() => {}}
        >
          Filter
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" />
          <Tab label="Today" />
          <Tab label="This Week" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      {errorMessage && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        </Paper>
      )}

      {sortedTasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tabValue === 3 
              ? "You haven't completed any tasks yet." 
              : "You're all caught up! Add plants to your garden to generate more tasks."}
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {sortedTasks.map((task, index) => (
              <Box key={task.id}>
                {index > 0 && <Divider />}
                <ListItem 
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  sx={{
                    bgcolor: task.status === 'completed' 
                      ? 'action.hover' 
                      : (isPast(getDateObject(task.dueDate)) && task.status !== 'completed' 
                        ? 'error.lightest' 
                        : 'inherit'),
                    cursor: 'pointer'
                  }}
                >
                  <ListItemIcon>
                    {getTaskIcon(task.taskType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={task.details}
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={getDateLabel(task.dueDate)} 
                          size="small"
                          color={isPast(getDateObject(task.dueDate)) && task.status !== 'completed' ? 'error' : 'default'}
                          variant="outlined"
                        />
                        <Typography variant="body2" component="span">
                          {task.relatedPlantName} in {task.relatedAreaId}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      '& .MuiListItemText-primary': {
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={task.status === 'completed'}
                      onChange={(e) => handleTaskComplete(task.id, e)}
                      inputProps={{ 'aria-labelledby': `task-${task.id}` }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Error message Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="warning" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

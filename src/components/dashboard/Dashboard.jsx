import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  WaterDrop as WaterIcon,
  LocalFlorist as PlantIcon,
  Spa as HarvestIcon,
  BugReport as PestIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircleOutline as CheckIcon,
  Nature as EcoIcon,
  Opacity as OpacityIcon,
  WbSunny as SunIcon,
  Psychology as AIIcon  // Adding Psychology icon as AIIcon alternative
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';
import { childVariants } from '../animations/AnimatedSection';
import AnimatedElement, { presets } from '../animations/AnimatedElement';
import { useAuth } from '../../contexts/AuthContext';
import { useGarden } from '../../contexts/GardenContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { isToday, isTomorrow, isPast, format } from 'date-fns';
import SeasonalAdvisor from '../advisor/SeasonalAdvisor';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { gardens, tasks, userPlantings, plants, loading } = useGarden();
  const { notificationsSupported, notificationPermission, requestPermission } = useNotifications();
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

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

  useEffect(() => {
    if (tasks.length > 0) {
      // Filter tasks for today and upcoming
      const today = [];
      const upcoming = [];

      tasks.forEach(task => {
        if (task.status === 'completed') return;

        const taskDate = getDateObject(task.dueDate);

        if (isToday(taskDate) || isPast(taskDate)) {
          today.push(task);
        } else if (isTomorrow(taskDate) || (upcoming.length < 5 && !isPast(taskDate))) {
          upcoming.push(task);
        }
      });

      // Sort by date
      today.sort((a, b) => getDateObject(a.dueDate) - getDateObject(b.dueDate));
      upcoming.sort((a, b) => getDateObject(a.dueDate) - getDateObject(b.dueDate));

      setTodayTasks(today);
      setUpcomingTasks(upcoming.slice(0, 5)); // Limit to 5 upcoming tasks
    }
  }, [tasks]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} thickness={4} />
        </motion.div>
      </Box>
    );
  }

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

  const getDateLabel = (date) => {
    const taskDate = getDateObject(date);

    if (isToday(taskDate)) {
      return 'Today';
    } else if (isTomorrow(taskDate)) {
      return 'Tomorrow';
    } else if (isPast(taskDate)) {
      return 'Overdue';
    } else {
      return format(taskDate, 'MMM d'); // Month day
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box>
        <AnimatedSection animation="slideUp" delay={0.1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome, {currentUser?.displayName || 'Gardener'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your Winston, Oregon gardening assistant
            </Typography>
          </Box>
        </AnimatedSection>

      {gardens.length === 0 ? (
        <AnimatedSection animation="slideUp" delay={0.2}>
          <Paper
            sx={{
              p: 4,
              mb: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(145deg, ${alpha('#e8f5e9', 0.8)} 0%, ${alpha('#f1f8e9', 0.8)} 100%)`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <EcoIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.8 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Let's set up your garden
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Start by creating your garden to track plants and get personalized tasks.
              </Typography>
              <AnimatedElement
                type="div"
                {...presets.buttonHover}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/garden/setup')}
                  sx={{
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)'
                  }}
                >
                  Set Up Garden
                </Button>
              </AnimatedElement>
            </motion.div>
          </Paper>
        </AnimatedSection>
      ) : userPlantings.length === 0 ? (
        <AnimatedSection animation="slideUp" delay={0.2}>
          <Paper
            sx={{
              p: 4,
              mb: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: `linear-gradient(145deg, ${alpha('#e8f5e9', 0.8)} 0%, ${alpha('#f1f8e9', 0.8)} 100%)`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <PlantIcon sx={{ fontSize: 60, color: 'success.main', mb: 2, opacity: 0.8 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Add your first plants
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Your garden is set up! Now add some plants to start tracking and get care reminders.
              </Typography>
              <AnimatedElement
                type="div"
                {...presets.buttonHover}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/garden')}
                  sx={{
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)'
                  }}
                >
                  Add Plants
                </Button>
              </AnimatedElement>
            </motion.div>
          </Paper>
        </AnimatedSection>
      ) : null}

      {notificationsSupported && notificationPermission === 'default' && (
        <AnimatedSection animation="fadeIn" delay={0.3}>
          <Alert
            severity="info"
            sx={{
              mb: 4,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              '& .MuiAlert-icon': {
                color: theme.palette.info.main
              }
            }}
            action={
              <AnimatedElement
                type="div"
                {...presets.buttonHover}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={requestPermission}
                  sx={{ borderRadius: 2 }}
                >
                  Enable
                </Button>
              </AnimatedElement>
            }
          >
            Enable notifications to receive timely gardening reminders
          </Alert>
        </AnimatedSection>
      )}

      <Grid container spacing={4}>
        {/* Seasonal Garden Advisor */}
        <Grid sx={{ width: '100%' }}>
          <AnimatedSection animation="slideUp" delay={0.3}>
            <motion.div
              whileHover="hover"
              variants={cardVariants}
            >
              <SeasonalAdvisor />
            </motion.div>
          </AnimatedSection>
        </Grid>

        {/* Today's Tasks */}
        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <AnimatedSection animation="slideInLeft" delay={0.4}>
            <motion.div
              whileHover="hover"
              variants={cardVariants}
            >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: theme.palette.primary.main,
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                      Today's Tasks
                    </Typography>
                  </Box>

                  {todayTasks.length === 0 ? (
                    <Box sx={{
                      textAlign: 'center',
                      py: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <CheckIcon sx={{ fontSize: 40, color: alpha(theme.palette.success.main, 0.5), mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No tasks for today
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      <AnimatedSection animation="staggered">
                        {todayTasks.map((task, index) => (
                          <motion.div key={task.id} variants={childVariants}>
                            <Box>
                              {index > 0 && <Divider sx={{ my: 1 }} />}
                              <ListItem
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                sx={{
                                  bgcolor: isPast(getDateObject(task.dueDate)) && !isToday(getDateObject(task.dueDate))
                                    ? alpha(theme.palette.error.main, 0.08)
                                    : 'inherit',
                                  cursor: 'pointer',
                                  borderRadius: 2,
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    transform: 'translateX(5px)'
                                  }
                                }}
                              >
                                <ListItemIcon>
                                  {getTaskIcon(task.taskType)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{task.details}</Typography>}
                                  secondary={
                                    <Typography component="span" variant="body2">
                                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <Chip
                                          size="small"
                                          label={task.relatedPlantName}
                                          sx={{
                                            mr: 1,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: theme.palette.primary.main,
                                            fontWeight: 500,
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                        <Typography component="span" variant="caption" color="text.secondary">
                                          {task.relatedAreaId}
                                        </Typography>
                                      </Box>
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </Box>
                          </motion.div>
                        ))}
                      </AnimatedSection>
                    </List>
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <AnimatedElement
                    type="div"
                    {...presets.buttonHover}
                  >
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/tasks')}
                      sx={{ borderRadius: 2 }}
                    >
                      View All Tasks
                    </Button>
                  </AnimatedElement>
                </CardActions>
              </Card>
            </motion.div>
          </AnimatedSection>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <AnimatedSection animation="slideInRight" delay={0.5}>
            <motion.div
              whileHover="hover"
              variants={cardVariants}
            >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: theme.palette.secondary.main,
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WaterIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                      Upcoming Tasks
                    </Typography>
                  </Box>

                  {upcomingTasks.length === 0 ? (
                    <Box sx={{
                      textAlign: 'center',
                      py: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <WaterIcon sx={{ fontSize: 40, color: alpha(theme.palette.secondary.main, 0.5), mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No upcoming tasks
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      <AnimatedSection animation="staggered">
                        {upcomingTasks.map((task, index) => (
                          <motion.div key={task.id} variants={childVariants}>
                            <Box>
                              {index > 0 && <Divider sx={{ my: 1 }} />}
                              <ListItem
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                sx={{
                                  cursor: 'pointer',
                                  borderRadius: 2,
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                                    transform: 'translateX(5px)'
                                  }
                                }}
                              >
                                <ListItemIcon>
                                  {getTaskIcon(task.taskType)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{task.details}</Typography>}
                                  secondary={
                                    <Typography component="span" variant="body2">
                                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <Chip
                                          size="small"
                                          label={getDateLabel(task.dueDate)}
                                          sx={{
                                            mr: 1,
                                            bgcolor: isTomorrow(getDateObject(task.dueDate))
                                              ? alpha(theme.palette.warning.main, 0.1)
                                              : alpha(theme.palette.info.main, 0.1),
                                            color: isTomorrow(getDateObject(task.dueDate))
                                              ? theme.palette.warning.dark
                                              : theme.palette.info.dark,
                                            fontWeight: 500,
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                        <Typography component="span" variant="caption" color="text.secondary">
                                          {task.relatedPlantName}
                                        </Typography>
                                      </Box>
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            </Box>
                          </motion.div>
                        ))}
                      </AnimatedSection>
                    </List>
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <AnimatedElement
                    type="div"
                    {...presets.buttonHover}
                  >
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate('/tasks')}
                      sx={{ borderRadius: 2 }}
                    >
                      View All Tasks
                    </Button>
                  </AnimatedElement>
                </CardActions>
              </Card>
            </motion.div>
          </AnimatedSection>
        </Grid>

        {/* Garden Summary */}
        <Grid sx={{ width: '100%' }}>
          <AnimatedSection animation="slideUp" delay={0.6}>
            <motion.div
              whileHover="hover"
              variants={cardVariants}
            >
              <Card sx={{
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EcoIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        My Garden
                      </Typography>
                    </Box>
                    <Chip
                      label={`${gardens.length} ${gardens.length === 1 ? 'garden' : 'gardens'}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  <Grid container spacing={3}>
                    <AnimatedSection animation="staggered">
                      {gardens.map((garden) => (
                        <Grid key={garden.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
                          <motion.div variants={childVariants}>
                            <Paper
                              sx={{
                                p: 3,
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                                }
                              }}
                            >
                              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                                {garden.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Climate Zone: {garden.climateZone}
                              </Typography>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1.5,
                                mt: 1,
                                mb: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                              }}>
                                <PlantIcon sx={{ color: theme.palette.success.main, mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {garden.areas.length} Areas • {userPlantings.filter(p => p.gardenId === garden.id).length} Plants
                                </Typography>
                              </Box>
                              <AnimatedElement
                                type="div"
                                {...presets.buttonHover}
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate('/garden')}
                                  sx={{ borderRadius: 2 }}
                                >
                                  View Garden
                                </Button>
                              </AnimatedElement>
                            </Paper>
                          </motion.div>
                        </Grid>
                      ))}
                    </AnimatedSection>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatedSection>
        </Grid>
      </Grid>
    </Box>
    </motion.div>
  );
}

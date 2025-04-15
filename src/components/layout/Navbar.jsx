import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalFlorist as PlantIcon,
  Assignment as TaskIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Nature as EcoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useGarden } from '../../contexts/GardenContext';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { tasks } = useGarden();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Count overdue tasks for notification badge
  const overdueTasks = tasks.filter(task => {
    if (!task || task.status === 'completed') return false;
    
    // Handle both Firestore Timestamp objects and regular Date strings
    let taskDate;
    try {
      // For Firestore Timestamp objects with toDate method
      if (task.dueDate && typeof task.dueDate.toDate === 'function') {
        taskDate = task.dueDate.toDate();
      } else if (task.dueDate) {
        // For regular Date strings or objects
        taskDate = new Date(task.dueDate);
      } else {
        return false;
      }
      
      const today = new Date();
      return taskDate < today && taskDate.toDateString() !== today.toDateString();
    } catch (error) {
      console.error("Error processing task date:", error);
      return false;
    }
  });

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'My Garden', icon: <PlantIcon />, path: '/garden' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  // Animation variants
  const logoVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } }
  };

  const navbarVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -50 }
  };

  const listItemVariants = {
    hover: {
      x: 10,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      transition: { duration: 0.2 }
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white'
        }}
      >
        <motion.div
          initial="normal"
          whileHover="hover"
          variants={logoVariants}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EcoIcon fontSize="large" />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              GREEN
            </Typography>
          </Box>
        </motion.div>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 2 }}>
        <AnimatePresence>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === '/' && location.pathname === '');

            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                whileHover="hover"
                variants={listItemVariants}
              >
                <ListItem
                  component={Link}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    mb: 1,
                    mx: 1,
                    borderRadius: 2,
                    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    '& .MuiListItemIcon-root': {
                      color: isActive ? theme.palette.primary.main : 'inherit',
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400
                    }}
                  />
                </ListItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </List>
      {currentUser && (
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
              }}
            >
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {currentUser.displayName || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  const formatTaskDate = (dueDate) => {
    try {
      if (dueDate && typeof dueDate.toDate === 'function') {
        return dueDate.toDate().toLocaleDateString();
      } else if (dueDate) {
        return new Date(dueDate).toLocaleDateString();
      }
    } catch (error) {
      console.error("Error formatting task date:", error);
      return "Invalid date";
    }
  };

  return (
    <>
      <motion.div
        initial="visible"
        animate={scrolled ? "visible" : "visible"}
        variants={navbarVariants}
        transition={{ duration: 0.3 }}
      >
        <AppBar
          position="sticky"
          elevation={scrolled ? 4 : 0}
          sx={{
            bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff',
            color: '#333',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <motion.div
              initial="normal"
              whileHover="hover"
              variants={logoVariants}
            >
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <EcoIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  GREEN
                </Typography>
              </Box>
            </motion.div>

            <Box sx={{ flexGrow: 1 }} />

            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isMobile && (
                  <Box sx={{ display: 'flex', mr: 2 }}>
                    {menuItems.map((item) => {
                      const isActive = location.pathname === item.path ||
                        (item.path === '/' && location.pathname === '');

                      return (
                        <Button
                          key={item.text}
                          component={Link}
                          to={item.path}
                          color={isActive ? 'primary' : 'inherit'}
                          sx={{
                            mx: 0.5,
                            fontWeight: isActive ? 600 : 400,
                            position: 'relative',
                            '&::after': isActive ? {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: '20%',
                              width: '60%',
                              height: '3px',
                              bgcolor: 'primary.main',
                              borderRadius: '3px 3px 0 0'
                            } : {}
                          }}
                          startIcon={item.icon}
                        >
                          {item.text}
                        </Button>
                      );
                    })}
                  </Box>
                )}

                <Tooltip title="Notifications">
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleNotificationMenuOpen}
                    sx={{ mx: 1 }}
                  >
                    <Badge badgeContent={overdueTasks.length} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Account">
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        border: `2px solid ${theme.palette.background.paper}`
                      }}
                    >
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {currentUser.displayName || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                    <ListItemIcon>
                      <AccountIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>

                <Menu
                  id="notification-menu"
                  anchorEl={notificationAnchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(notificationAnchorEl)}
                  onClose={handleNotificationMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 280,
                      maxWidth: 320,
                      maxHeight: 400,
                      overflowY: 'auto',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Notifications
                    </Typography>
                    {overdueTasks.length > 0 && (
                      <Typography variant="caption" color="error">
                        {overdueTasks.length} overdue
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                  {overdueTasks.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No notifications
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {overdueTasks.slice(0, 5).map((task) => (
                        <ListItem
                          key={task.id}
                          sx={{
                            px: 2,
                            py: 1,
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                          }}
                          onClick={() => {
                            handleNotificationMenuClose();
                            navigate(`/tasks/${task.id}`);
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <TaskIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={task.details}
                            secondary={`Due: ${formatTaskDate(task.dueDate)}`}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                      {overdueTasks.length > 5 && (
                        <Box sx={{ p: 1, textAlign: 'center' }}>
                          <Button
                            size="small"
                            onClick={() => {
                              handleNotificationMenuClose();
                              navigate('/tasks');
                            }}
                          >
                            View all ({overdueTasks.length})
                          </Button>
                        </Box>
                      )}
                    </List>
                  )}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    sx={{ borderRadius: 2 }}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    component={Link}
                    to="/signup"
                    sx={{
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.39)'
                    }}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            borderRadius: '0 16px 16px 0',
            boxShadow: '0 16px 40px rgba(0,0,0,0.12)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

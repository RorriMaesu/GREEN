import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Switch, 
  Button, 
  TextField, 
  Avatar, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListSubheader,
  ListItemSecondaryAction,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  DataUsage as DataUsageIcon,
  Storage as StorageIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Opacity as WaterIcon,
  LightMode as SunIcon,
  SecurityUpdateGood as UpdateIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Brush as ThemeIcon,
  Save as SaveIcon,
  SmartToy as SmartToyIcon,
  Psychology as AIIcon  // Adding Psychology icon as AIIcon alternative
} from '@mui/icons-material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGarden } from '../../contexts/GardenContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { db } from '../../firebase/config';
import AnimatedSection from '../animations/AnimatedSection';

export default function Settings() {
  const { currentUser, logout, getUserData } = useAuth();
  const { clearGardenData } = useGarden();
  const { requestPermission, notificationsSupported, notificationPermission } = useNotifications();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    wateringReminders: true,
    harvestReminders: true,
    weeklyDigest: true,
    dataStorage: 'cloud',
    theme: 'system',
    temperatureUnit: 'fahrenheit',
    language: 'en', 
    locationTracking: false,
    geminiApiKey: '' // Add Gemini API key to preferences
  });
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setProfileData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || ''
        });
        
        const data = await getUserData();
        if (data) {
          setUserData(data);
          setPreferences({
            ...preferences,
            ...(data.preferences || {})
          });
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, getUserData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (currentUser.displayName !== profileData.displayName) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName
        });
      }
      
      if (currentUser.email !== profileData.email) {
        await updateEmail(currentUser, profileData.email);
      }
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: profileData.displayName,
        email: profileData.email
      });
      
      setEditMode(false);
      setSuccess('Profile updated successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to update profile: ' + error.message);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password updated successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to update password: ' + error.message);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Update user preferences in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        preferences: preferences
      });
      
      if (preferences.notifications && notificationsSupported && notificationPermission !== 'granted') {
        requestPermission();
      }
      
      setSuccess('Preferences saved successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to save preferences: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Clear user data from Firestore and local storage
      await clearGardenData();
      
      // Delete user account
      await deleteUser(currentUser);
      
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError('Failed to delete account: ' + error.message);
      setDeleteDialogOpen(false);
    }
  };

  if (loading && !userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <AnimatedSection animation="slideUp" delay={0.1}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={currentUser?.photoURL} 
              alt={currentUser?.displayName || "User"}
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: theme.palette.primary.main,
                fontSize: 32,
                mr: 2
              }}
            >
              {currentUser?.displayName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {currentUser?.displayName || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              {!editMode ? (
                <Button 
                  startIcon={<EditIcon />} 
                  variant="outlined" 
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button 
                  startIcon={<SaveIcon />} 
                  variant="contained" 
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  Save
                </Button>
              )}
            </Box>
          </Box>
          
          {editMode ? (
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Display Name"
                variant="outlined"
                margin="normal"
                value={profileData.displayName}
                onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </Box>
          ) : null}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <TextField
            fullWidth
            label="Current Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
          />
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
          />
          <Button 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleChangePassword}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || loading}
          >
            Update Password
          </Button>
        </Paper>
      </AnimatedSection>
      
      <AnimatedSection animation="slideUp" delay={0.2}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          
          <List
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'transparent' }}>
                Notifications
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Enable Notifications" 
                secondary="Receive timely reminders about garden tasks"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <WaterIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Watering Reminders" 
                secondary="Get reminders when plants need watering"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={preferences.wateringReminders}
                  onChange={(e) => setPreferences({...preferences, wateringReminders: e.target.checked})}
                  disabled={!preferences.notifications}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <SunIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Harvest Reminders" 
                secondary="Notify me when crops are ready to harvest"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={preferences.harvestReminders}
                  onChange={(e) => setPreferences({...preferences, harvestReminders: e.target.checked})}
                  disabled={!preferences.notifications}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <UpdateIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Weekly Garden Digest" 
                secondary="Receive a weekly report of garden progress"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={preferences.weeklyDigest}
                  onChange={(e) => setPreferences({...preferences, weeklyDigest: e.target.checked})}
                  disabled={!preferences.notifications}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <List
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'transparent' }}>
                General Settings
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Data Storage" 
                secondary="Where to store your garden data"
              />
              <ListItemSecondaryAction>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={preferences.dataStorage}
                    onChange={(e) => setPreferences({...preferences, dataStorage: e.target.value})}
                  >
                    <MenuItem value="cloud">Cloud Storage</MenuItem>
                    <MenuItem value="local">Local Only</MenuItem>
                    <MenuItem value="hybrid">Hybrid (Both)</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <AIIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Gemini API Key" 
                secondary="Required for intelligent weather recommendations"
              />
              <ListItemSecondaryAction>
                <TextField
                  size="small"
                  variant="outlined"
                  type="password"
                  placeholder="Enter API key"
                  value={preferences.geminiApiKey}
                  onChange={(e) => setPreferences({...preferences, geminiApiKey: e.target.value})}
                  sx={{ minWidth: 200 }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <ThemeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Theme" 
                secondary="App display theme"
              />
              <ListItemSecondaryAction>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System Default</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <WaterIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Temperature Units" 
                secondary="Preferred temperature display units"
              />
              <ListItemSecondaryAction>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={preferences.temperatureUnit}
                    onChange={(e) => setPreferences({...preferences, temperatureUnit: e.target.value})}
                  >
                    <MenuItem value="fahrenheit">Fahrenheit (°F)</MenuItem>
                    <MenuItem value="celsius">Celsius (°C)</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Language" 
                secondary="App display language"
              />
              <ListItemSecondaryAction>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LocationIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Location Tracking" 
                secondary="Allow app to use location for local weather data"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={preferences.locationTracking}
                  onChange={(e) => setPreferences({...preferences, locationTracking: e.target.checked})}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSavePreferences}
              disabled={loading}
            >
              Save Preferences
            </Button>
          </Box>
        </Paper>
      </AnimatedSection>
      
      <AnimatedSection animation="slideUp" delay={0.3}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="error">
            Danger Zone
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Sign Out
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log out of your account
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Delete Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permanently delete your account and all data
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Box>
        </Paper>
      </AnimatedSection>
      
      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Your Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. All your garden data, plants, and settings will be permanently deleted.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, mb: 2, color: 'error.main', fontWeight: 'bold' }}>
            To confirm, please type "DELETE" in the field below:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={confirmDeleteText}
            onChange={(e) => setConfirmDeleteText(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={confirmDeleteText !== 'DELETE'}
          >
            Permanently Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
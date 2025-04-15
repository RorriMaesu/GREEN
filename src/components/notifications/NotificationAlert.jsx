import { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationAlert() {
  const [open, setOpen] = useState(false);
  const { notification, notificationsSupported, requestPermission } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      setOpen(true);
    }
  }, [notification]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(false);
    
    // If notification has task data, navigate to that task
    if (notification?.data?.taskId) {
      navigate(`/tasks/${notification.data.taskId}`);
    } else {
      navigate('/tasks');
    }
  };

  return (
    <>
      {notification && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleClose} 
            severity="info" 
            sx={{ width: '100%' }}
            action={
              <Button color="inherit" size="small" onClick={handleClick}>
                VIEW
              </Button>
            }
          >
            {notification.title}: {notification.body}
          </Alert>
        </Snackbar>
      )}
      
      {notificationsSupported && Notification.permission === 'default' && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="info" 
            sx={{ width: '100%' }}
            action={
              <Button color="inherit" size="small" onClick={requestPermission}>
                ENABLE
              </Button>
            }
          >
            Enable notifications to receive gardening reminders
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

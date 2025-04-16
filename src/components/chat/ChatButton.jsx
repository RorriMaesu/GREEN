import { useState } from 'react';
import {
  Fab,
  Zoom,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import GardenGPT from '../advisor/GardenGPT';

/**
 * A floating chat button that provides access to the garden chatbot from anywhere in the app
 */
export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Zoom in={true}>
        <Tooltip title="Garden Assistant" placement="left">
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
            onClick={handleOpen}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      </Zoom>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: fullScreen ? '100%' : '80vh',
            maxHeight: '700px',
            borderRadius: fullScreen ? 0 : 2,
          }
        }}
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Custom styling for dialog mode */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <GardenGPT inDialog={true} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
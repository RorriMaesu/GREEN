import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.jsx';
import theme from './theme';
import { initializePlantsCollection } from './utils/initializeDatabase';

// Initialize the database with plant data
initializePlantsCollection().then(() => {
  console.log('Database initialization complete');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
);

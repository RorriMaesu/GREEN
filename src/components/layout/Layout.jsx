import { Box, Container, Paper, Typography, Link, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import NotificationAlert from '../notifications/NotificationAlert';
import AnimatedSection from '../animations/AnimatedSection';

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export default function Layout({ children }) {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    }}>
      <Navbar />
      <NotificationAlert />

      <Container
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          style={{ width: '100%' }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
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
            }}
          >
            {children}
          </Paper>
        </motion.div>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
          boxShadow: '0 -5px 20px rgba(0,0,0,0.03)'
        }}
      >
        <AnimatedSection animation="fadeIn">
          <Typography variant="body2" color="text.secondary">
            GREEN - Winston, Oregon Gardening Assistant
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            © {new Date().getFullYear()} | <Link href="#" color="inherit">Privacy</Link> | <Link href="#" color="inherit">Terms</Link>
          </Typography>
        </AnimatedSection>
      </Box>
    </Box>
  );
}

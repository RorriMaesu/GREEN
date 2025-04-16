import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  Alert,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Google as GoogleIcon,
  Nature as EcoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedSection from '../animations/AnimatedSection';
import AnimatedElement, { presets } from '../animations/AnimatedElement';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authDomainError, setAuthDomainError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if we're on GitHub Pages
  const isGitHubPages = window.location.hostname.includes('github.io');

  useEffect(() => {
    // On component mount, check if there's a domain error in localStorage
    // This helps persist the error message across redirects
    const storedError = localStorage.getItem('auth_domain_error');
    if (storedError) {
      setAuthDomainError(true);
      setError(storedError);
      // Clear the stored error
      localStorage.removeItem('auth_domain_error');
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setAuthDomainError(false);
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setAuthDomainError(false);
      setLoading(true);

      const result = await loginWithGoogle();

      if (!result.success) {
        if (result.error && result.error.includes('not authorized for Firebase Authentication')) {
          setAuthDomainError(true);
          // Store the error in localStorage in case of redirect
          localStorage.setItem('auth_domain_error', result.error);
        }
        setError(result.error || 'Failed to log in with Google.');
        return;
      }

      navigate('/');
    } catch (error) {
      setError('Failed to log in with Google.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box
          sx={{
            marginTop: { xs: 4, sm: 8 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{
                width: 50,
                height: 50,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 20px rgba(46, 125, 50, 0.2)',
                mr: 2
              }}>
                <EcoIcon fontSize="large" />
              </Avatar>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                GREEN
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar sx={{
                  m: '0 auto',
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  boxShadow: '0 4px 14px rgba(46, 125, 50, 0.2)'
                }}>
                  <LockOutlinedIcon fontSize="large" />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                  Sign in
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Welcome back to your gardening assistant
                </Typography>
              </Box>

              {authDomainError && (
                <AnimatedSection animation="fadeIn">
                  <Alert
                    severity="warning"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(237, 108, 2, 0.1)'
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Authorization Error:</strong> This domain is not authorized for Firebase Authentication.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      To fix this:
                      <ul style={{ marginTop: 4, marginBottom: 4, paddingLeft: 20 }}>
                        <li>Go to Firebase Console → Authentication → Settings</li>
                        <li>Add "{window.location.hostname}" to Authorized Domains</li>
                      </ul>
                    </Typography>
                    <Typography variant="body2">
                      For testing, please use the regular login with email and password or use the application on the authorized domain.
                    </Typography>
                  </Alert>
                </AnimatedSection>
              )}

              {error && !authDomainError && (
                <AnimatedSection animation="fadeIn">
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)'
                    }}
                  >
                    {error}
                  </Alert>
                </AnimatedSection>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused': {
                        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                      }
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused': {
                        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                      }
                    }
                  }}
                />

                <AnimatedElement
                  type="div"
                  {...presets.buttonHover}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.39)',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`
                    }}
                  >
                    Sign In
                  </Button>
                </AnimatedElement>

                <Box sx={{ position: 'relative', my: 3 }}>
                  <Divider>
                    <Typography variant="caption" sx={{ px: 1, color: 'text.secondary' }}>
                      OR
                    </Typography>
                  </Divider>
                </Box>

                <AnimatedElement
                  type="div"
                  {...presets.buttonHover}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    Sign In with Google
                  </Button>
                </AnimatedElement>

                {isGitHubPages && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                      Note: You're using this app on GitHub Pages ({window.location.hostname}).
                      <br />Google login requires domain authorization in Firebase.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/signup"
                      style={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    >
                      Don't have an account? Sign Up
                    </Link>
                  </motion.div>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  );
}

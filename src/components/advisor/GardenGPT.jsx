import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  LocalFlorist as PlantIcon,
  WaterDrop as WaterIcon,
  BugReport as PestIcon,
  TipsAndUpdates as TipsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useGarden } from '../../contexts/GardenContext';
import { useNavigate } from 'react-router-dom';
import GeminiService from '../../services/GeminiService';

/**
 * GardenGPT - A chatbot interface using Gemini 2.5 Pro to provide personalized gardening advice
 * based on the user's garden data and local climate information
 * @param {Object} props - Component props
 * @param {boolean} [props.inDialog=false] - Whether the component is being displayed in a dialog
 */
export default function GardenGPT({ inDialog = false }) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState('checking');
  const [geminiService, setGeminiService] = useState(null);
  const [error, setError] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const endOfMessagesRef = useRef(null);
  const { currentUser, getUserData } = useAuth();
  const { gardens, userPlantings, plants } = useGarden();
  const navigate = useNavigate();

  // Initial conversation messages
  const initialMessages = [
    {
      sender: 'bot',
      text: 'Hello! I\'m your Winston, Oregon gardening assistant powered by Google Gemini 2.5 Pro Preview. Ask me anything about gardening in your specific climate zone (8b/9a).'
    },
    {
      sender: 'bot',
      text: 'I can help with planting advice, pest management, seasonal tasks, and more - personalized to your garden!'
    }
  ];

  // Sample questions to help users get started
  const sampleQuestions = [
    "What should I plant in my garden this month?",
    "How do I deal with aphids on my tomatoes?",
    "When should I harvest my carrots?",
    "What vegetables grow well in partial shade?",
    "How often should I water my garden in summer?",
    "What companion plants work well with peppers?",
    "How can I improve my soil quality?",
    "What cover crops should I plant this fall?",
    "How do I prepare my garden for winter?",
    "What's the best way to start seeds indoors?"
  ];

  // Scroll to bottom of chat when new messages appear
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Check for API key and initialize Gemini service on component mount
  useEffect(() => {
    async function initializeGeminiService() {
      try {
        setApiKeyStatus('checking');
        const userData = await getUserData();
        const geminiApiKey = userData?.preferences?.geminiApiKey;

        if (!geminiApiKey) {
          setApiKeyStatus('missing');
          setError('To use the garden assistant, please add your Gemini API key in Settings.');
          return;
        }

        // Create and initialize the Gemini service
        const service = new GeminiService(geminiApiKey);
        const initialized = await service.initialize();

        if (initialized) {
          setGeminiService(service);
          setApiKeyStatus('valid');
          setConversation(initialMessages);
        } else {
          setApiKeyStatus('invalid');
          setError('Unable to initialize Gemini service. Please check that your API key is valid.');
        }
      } catch (error) {
        console.error('Error initializing Gemini service:', error);
        setApiKeyStatus('error');
        setError('An error occurred while setting up the gardening assistant. Please try again later.');
      }
    }

    initializeGeminiService();
  }, [getUserData]);

  // Prepare garden context data for Gemini
  const prepareGardenContext = () => {
    if (gardens.length === 0) {
      return {
        hasGarden: false,
        climateZone: '8b/9a (Winston, Oregon)',
        areas: [],
        plantings: []
      };
    }

    // Get the first garden (most users will only have one)
    const garden = gardens[0];
    
    // Create a list of garden areas with details
    const areas = garden.areas.map(area => ({
      name: area.name, 
      type: area.type,
      sunExposure: area.sunExposure || 'mixed', // Default if not set
      soilType: area.soilType || 'loam', // Default if not set
    }));
    
    // Create a list of plants the user has in their garden
    const plantings = userPlantings.map(planting => {
      const plantData = plants.find(p => p.id === planting.plantId);
      const area = garden.areas.find(a => a.id === planting.areaId);
      
      return {
        plantName: plantData?.name || planting.plantName || 'Unknown plant',
        plantedDate: planting.datePlanted,
        areaName: area?.name || 'Unknown area',
        quantity: planting.quantity,
        status: planting.status
      };
    });
    
    return {
      hasGarden: true,
      climateZone: garden.climateZone || '8b/9a',
      areas: areas,
      plantings: plantings
    };
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;
    
    // Add user message to conversation
    const userMessage = {
      sender: 'user',
      text: message
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    
    try {
      if (apiKeyStatus !== 'valid' || !geminiService) {
        throw new Error('Gemini service is not properly initialized');
      }
      
      // Get user's garden context data
      const gardenContext = prepareGardenContext();
      
      // Process with Gemini
      const responseText = await geminiService.chatWithGardener(message, gardenContext);
      
      // Add AI response to conversation
      const botMessage = {
        sender: 'bot',
        text: responseText
      };
      
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to conversation
      const errorMessage = {
        sender: 'error',
        text: 'Sorry, I experienced an error processing your request. Please try again later or check your Gemini API key in settings.'
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Animation variants for messages
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <Paper sx={{ 
      p: 3, 
      mb: inDialog ? 0 : 3, 
      borderRadius: inDialog ? 0 : 2,
      boxShadow: inDialog ? 0 : 3,
      display: 'flex',
      flexDirection: 'column',
      height: inDialog ? '100%' : 500,
      width: inDialog ? '100%' : 'auto',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <BotIcon sx={{ mr: 1 }} color="primary" /> Garden Assistant
        </Typography>
        
        <Box>
          <Tooltip title="How to use Garden Assistant">
            <IconButton color="info" size="small" onClick={() => setHelpOpen(true)}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="API Settings">
            <IconButton 
              color="primary" 
              size="small" 
              onClick={() => navigate('/settings')}
              sx={{ ml: 1 }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {apiKeyStatus === 'missing' || apiKeyStatus === 'invalid' ? (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <Button 
              size="small" 
              color="primary" 
              onClick={() => navigate('/settings')}
            >
              Go to Settings
            </Button>
          }
        >
          {error}
        </Alert>
      ) : apiKeyStatus === 'error' ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : null}

      {/* Messages container */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          bgcolor: 'background.default',
          borderRadius: 1,
          p: 2,
          mb: 2
        }}
      >
        <List>
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={messageVariants}
            >
              <ListItem 
                alignItems="flex-start"
                sx={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  mb: 1,
                }}
              >
                <ListItemAvatar sx={{ minWidth: msg.sender === 'user' ? 0 : 56 }}>
                  {msg.sender === 'bot' && (
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BotIcon />
                    </Avatar>
                  )}
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Paper 
                      elevation={1}
                      sx={{
                        p: 2,
                        display: 'inline-block',
                        maxWidth: '80%',
                        bgcolor: msg.sender === 'user' 
                          ? 'primary.light' 
                          : msg.sender === 'error' 
                            ? 'error.light' 
                            : 'background.paper',
                        color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        borderTopRightRadius: msg.sender === 'user' ? 0 : 2,
                        borderTopLeftRadius: msg.sender === 'bot' ? 0 : 2,
                      }}
                    >
                      <Typography variant="body1" component="div">
                        {msg.text}
                      </Typography>
                    </Paper>
                  }
                  sx={{ margin: 0 }}
                />

                <ListItemAvatar sx={{ minWidth: msg.sender === 'bot' ? 0 : 56 }}>
                  {msg.sender === 'user' && (
                    <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                      <PersonIcon />
                    </Avatar>
                  )}
                </ListItemAvatar>
              </ListItem>
              {index < conversation.length - 1 && <Divider variant="inset" component="li" />}
            </motion.div>
          ))}
          <div ref={endOfMessagesRef} />
        </List>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Message input */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about gardening in Winston, Oregon..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={apiKeyStatus !== 'valid' || loading}
          multiline
          maxRows={3}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!message.trim() || apiKeyStatus !== 'valid' || loading}
        >
          Send
        </Button>
      </Box>

      {/* Help dialog */}
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
        <DialogTitle>How to use Garden Assistant</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Here are some sample questions to get you started:
          </Typography>
          <List>
            {sampleQuestions.map((question, index) => (
              <ListItem key={index}>
                <ListItemText primary={question} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
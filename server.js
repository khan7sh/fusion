const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const axios = require('axios'); // Add this line for chatbot functionality

// Load environment variables
dotenv.config();

// Setup Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  serverSelectionTimeoutMS: 30000, 
  connectTimeoutMS: 30000, 
  poolSize: 10 
})
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

const app = express();
const port = process.env.PORT || 3000;

// HTTPS redirect middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Serve Tailwind CSS files
app.use('/tailwindcss', express.static(path.join(__dirname, 'node_modules/tailwindcss/dist')));

// Serve React app
app.use(express.static(path.join(__dirname, 'dist')));

// Set up session middleware
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'strict' }
}));

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Admin credentials
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

// Middleware for admin authentication
const adminAuth = async (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    logger.warn('Unauthorized access attempt to admin route');
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-form', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('budget').notEmpty().withMessage('Budget is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Form submission validation failed', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      budget: req.body.budget,
      message: req.body.message
    });
    await newContact.save();
    logger.info('New contact form submitted', { email: req.body.email });
    res.json({ message: 'Thank you for your message. We will get in touch soon!' });
  } catch (error) {
    logger.error('Error saving contact form', { error: error.message });
    if (error.name === 'MongooseServerSelectionError') {
      res.status(503).json({ message: 'Service temporarily unavailable. Please try again later.' });
    } else {
      next(error);
    }
  }
});

app.get('/admin', (req, res) => {
  if (req.session.isAdmin) {
    res.sendFile(path.join(__dirname, 'admin.html'));
  } else {
    res.sendFile(path.join(__dirname, 'admin-login.html'));
  }
});

app.get('/check-env', (req, res) => {
  res.json({
    adminUsernameSet: !!process.env.ADMIN_USERNAME,
    adminPasswordHashSet: !!process.env.ADMIN_PASSWORD_HASH,
    sessionSecretSet: !!process.env.SESSION_SECRET
  });
});

app.post('/admin/login', async (req, res, next) => {
  const { username, password } = req.body;
  
  if (username === adminUsername && adminPasswordHash) {
    try {
      const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
      if (passwordMatch) {
        req.session.isAdmin = true;
        logger.info('Admin login successful', { username });
        res.json({ message: 'Login successful' });
      } else {
        logger.warn('Failed admin login attempt', { username });
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      logger.error('Error during admin login', { error: error.message });
      next(error);
    }
  } else {
    logger.warn('Invalid admin login attempt', { username });
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('Error during admin logout', { error: err.message });
      res.status(500).json({ message: 'Error logging out' });
    } else {
      logger.info('Admin logout successful');
      res.json({ message: 'Logout successful' });
    }
  });
});

app.get('/contacts', adminAuth, async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    logger.info('Contacts list retrieved');
    res.json(contacts);
  } catch (error) {
    logger.error('Error fetching contacts', { error: error.message });
    next(error);
  }
});

app.get('/download-csv', adminAuth, async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    const fields = ['name', 'email', 'budget', 'message', 'date'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(contacts);

    logger.info('CSV file generated and downloaded');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  } catch (error) {
    logger.error('Error generating CSV', { error: error.message });
    next(error);
  }
});

// Chatbot endpoint
//const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(OPENAI_API_URL, {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Azam, an AI assistant for Orbit Owl, an AI agency specializing in creating advanced AI agent teams. Provide helpful information about Orbit Owl's services, answer questions about AI technology, and assist potential clients with their inquiries. Keep your responses concise and friendly."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const botResponse = response.data.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error in chatbot response:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.get('/temp-admin-login', (req, res) => {
  req.session.isAdmin = true;
  logger.warn('Temporary admin login used');
  res.send('Temporary admin login successful. <a href="/admin">Go to admin page</a>');
});

// Global error handler
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

app.use(errorHandler);

// Custom error pages
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, '500.html'));
});

// Start the server
app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});

module.exports = app;
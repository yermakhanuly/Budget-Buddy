const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Enable CORS with specific origins
app.use(cors({
  origin: [
    'https://budget-buddy.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Budget Buddy API' });
});

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Prepare for serverless environment (Vercel)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Don't start the server if this file is imported, only export the app
module.exports = app; 
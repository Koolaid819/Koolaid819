const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/api');
dotenv.config();

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set HTTP headers for security
app.use((req, res, next) => {
  // Only allow your site to be loaded in an iframe on your own pages
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Set Content-Security-Policy to restrict iframe embedding
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");

  // Disable DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  
  // Only allow your site to send the referrer for your own pages
  res.setHeader('Referrer-Policy', 'same-origin');
  
  next();
});

// Connect to DB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Set up routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

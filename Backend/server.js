const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//Routes
const bookingRoutes = require('./routes/bookingRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware (Allows us to accept JSON data)
app.use(express.json());
app.use(cors());


// Use Routes
app.use('/api/bookings', bookingRoutes);


// Test Route to check if server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
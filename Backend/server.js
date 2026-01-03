const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Added for file paths
const connectDB = require('./config/db');

// Routes
const bookingRoutes = require('./routes/bookingRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- ADDED THIS SECTION TO SERVE YOUR FRONTEND ---
// --- UPDATED SECTION FOR SERVER.JS ---

// Go UP one level from Backend, then INTO Frontend/static
app.use('/static', express.static(path.join(__dirname, '..', 'Frontend', 'static')));

// Go UP one level from Backend, then INTO Frontend/templates
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
// ------------------------------------------------

// Use Routes
app.use('/api/bookings', bookingRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
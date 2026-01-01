require('dotenv').config(); // Load the .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Allow the Frontend (Port 5173) to talk to Backend (Port 5000)
app.use(express.json()); // Allow the server to understand JSON data sent from frontend

// --- DATABASE CONNECTION ---
// We use the variable we stored in .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- DATA MODEL (SCHEMA) ---
// This defines what a "Style" looks like in the database.
// Notice it matches the Mock Data structure we used in Home.jsx
const styleSchema = new mongoose.Schema({
  title: String,
  salon: String,
  price: String,
  image: String,
  duration: Number // We added this recently!
});

// Create the Model
const Style = mongoose.model('Style', styleSchema);

// Booking Schema ---
const bookingSchema = new mongoose.Schema({
  customerName: String,
  phoneNumber: String,
  styleTitle: String,
  selectedTime: String,
  price: String,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- API ROUTES ---

// 1. GET Route: Fetch all styles
app.get('/api/styles', async (req, res) => {
  try {
    const styles = await Style.find(); // Mongoose magic to get all items
    res.json(styles); // Send them back to React
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 2. POST: Create a new style (MAKE SURE THIS PART EXISTS)
app.post('/api/styles', async (req, res) => {
  const { title, salon, price, image, duration } = req.body;

  const newStyle = new Style({
    title,
    salon,
    price,
    image,
    duration
  });

  try {
    const savedStyle = await newStyle.save();
    console.log("🆕 New Style Added:", savedStyle.title); // Check your terminal for this log!
    res.status(201).json(savedStyle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. POST: Create a new Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    console.log("📅 New Booking:", savedBooking.customerName);
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
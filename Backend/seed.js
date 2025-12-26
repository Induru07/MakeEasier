const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import your Models
const User = require('./models/User');
const Salon = require('./models/Salon');
const Service = require('./models/Service');
const Slot = require('./models/Slot');
const Booking = require('./models/Booking');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB...'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // 1. Clear old data (Optional: Be careful if you have real data!)
    await User.deleteMany({});
    await Salon.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Old data cleared.');

    // 2. Create a Dummy User
    const user = await User.create({
      name: "Test Customer",
      phone: "0771234567",
      location: "Colombo"
    });
    console.log(`👤 User Created! ID: ${user._id}`);

    // 3. Create a Salon (Updated to match your strict Schema)
    const salon = await Salon.create({
      salonID: "SALON_001",           // Fixes: Path `salonID` is required
      name: "Hackathon Salon",
      address: "123 Moratuwa Rd",     // Fixes: Path `address` is required
      location: {                     // Fixes: Path `location.type` & `coordinates` is required
        type: "Point",
        coordinates: [79.9000, 6.9000] // [Longitude, Latitude]
      },
      openingTime: "09:00",
      closingTime: "21:00"
    });
    console.log(`🏢 Salon Created! ID: ${salon._id}`);

    // 4. Create Services for that Salon
    const haircut = await Service.create({
      salonID: salon._id,
      serviceID: "SERVICE_001",
      name: "Men's Haircut",
      price: 500,
      duration: 30, // minutes
      capacity: 3,  // 3 barbers available
      gender: 'M'
    });
    console.log(`✂️  Service 1 (Haircut) ID: ${haircut._id}`);

    const facial = await Service.create({
      salonID: salon._id,
        serviceID: "SERVICE_002",
      name: "Facial Cleanse",
      price: 2500,
      duration: 60, // minutes
      capacity: 1,  // Only 1 room available
      gender: 'Unisex'
    });
    console.log(`💆 Service 2 (Facial) ID: ${facial._id}`);

    console.log('------------------------------------------------');
    console.log('✅ DATA SEEDING COMPLETE');
    console.log('⚠️  Copy the IDs above and give them to your Chatbot teammate!');
    console.log('------------------------------------------------');

    process.exit();
  } catch (error) {
    console.error(`❌ Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();


// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB...');
    // ONLY run the seed function AFTER the connection succeeds
    seedData();
  })
  .catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });

// Remove the standalone seedData(); call at the bottom if it exists!
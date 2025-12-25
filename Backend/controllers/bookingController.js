const Booking = require('../models/Booking');
const Service = require('../models/Service');

//LOGIC: Check availability and create booking
exports.createBooking = async (req, res) => {
    try {
        const { userID, salonID, serviceID, bookingDate, bookingTime } = req.body;

        console.log("Received booking request:", req.body);// Debug log

        //1. Find the service to get its availability and capacity
        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        //2. Count existing bookings for the same service, date, and time
        const bookedCount = await Booking.countDocuments({
            serviceID: serviceID,
            bookingDate: bookingDate,// assuming bookingDate is in "YYYY-MM-DD" format
            bookingTime: bookingTime,// assuming bookingTime is in "HH:mm" format
            status: 'booked' // Only consider active bookings
        });
        //3. Check if capacity is reached
        if (bookedCount >= service.capacity) {
            return res.status(400).json({ 
                success: false,
                message: 'Slot fuly booked. Please choose a different time.' 
            });
        }

        //4. Create the booking if available
        const newBooking = await Booking.create({// this is an async operation
            userID: userID,
            salonID: salonID,
            serviceID : serviceID,
            bookingDate : bookingDate,
            bookingTime : bookingTime,
            status: 'booked'
        });
        res.status(201).json({ 
            success: true,
            message: 'Booking created successfully',
            booking: newBooking 
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while creating booking' 
        });
    }
};

//Check if a slot is available
exports.checkAvailability = async (req, res) => {
    try {
        // we expect salonID, serviceID, bookingDate, bookingTime in req.body
        const { serviceID, bookingDate, bookingTime } = req.query;
        
        //1. Find the service to get its capacity
        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        //2. Count existing bookings for the same service, date, and time
        const bookedCount = await Booking.countDocuments({
            serviceID: serviceID,
            bookingDate: bookingDate,// assuming bookingDate is in "YYYY-MM-DD" format
            bookingTime: bookingTime,// assuming bookingTime is in "HH:mm" format
            status: 'booked' // Only consider active bookings
        });

        //3. Compare booked count with capacity
        const isAvailable = bookedCount < service.capacity;
        const remainingSeats = service.capacity - bookedCount;

        res.status(200).json({
            service : service.name,// return service name for clarity
            bookingDate: bookingDate,
            bookingTime: bookingTime,
            isAvailable: isAvailable,
            bookedCount: bookedCount,
            remainingSeats: remainingSeats
        });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while checking availability' 
        });
    }
};
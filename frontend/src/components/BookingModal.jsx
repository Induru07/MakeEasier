import React, { useState } from 'react';
import '../styles/BookingModal.css';

const BookingModal = ({ isOpen, onClose, selectedStyle }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  
  // New State for User Details
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "02:00 PM", "02:30 PM", "04:00 PM"];

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedTime || !customerName || !phoneNumber) {
      alert("Please fill in all fields!");
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      customerName,
      phoneNumber,
      styleTitle: selectedStyle.title,
      price: selectedStyle.price,
      selectedTime
    };

    try {
      // Send data to Backend
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert(`✅ Success! Booked for ${selectedTime}`);
        onClose(); // Close the modal
        // Reset fields
        setCustomerName('');
        setPhoneNumber('');
        setSelectedTime(null);
      } else {
        alert("❌ Booking Failed. Try again.");
      }
    } catch (error) {
      console.error("Error booking:", error);
      alert("Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Book Appointment</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <p className="summary-text">Booking <strong>{selectedStyle?.title}</strong> ({selectedStyle?.price})</p>
          
          {/* 1. Time Selection */}
          <div className="section-label">1. Select Time</div>
          <div className="time-grid">
            {timeSlots.map((time) => (
              <button 
                key={time}
                className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          {/* 2. User Details */}
          <div className="section-label">2. Your Details</div>
          <input 
            type="text" 
            placeholder="Your Name" 
            className="modal-input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            className="modal-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

        </div>

        <div className="modal-footer">
          <button 
            className="confirm-btn" 
            disabled={!selectedTime || !customerName || !phoneNumber || isSubmitting} 
            onClick={handleConfirm}
          >
            {isSubmitting ? "Booking..." : "Confirm Appointment"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingModal;
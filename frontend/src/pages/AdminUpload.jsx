import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/AdminUpload.css';

const AdminUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    salon: '',
    price: '',
    image: '',
    duration: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // UPDATED: We use '/api/styles' so the Vite Proxy handles the connection
      const response = await fetch('/api/styles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('✅ Upload Successful!');
        setFormData({ title: '', salon: '', price: '', image: '', duration: '' });
      } else {
        setMessage('❌ Upload Failed.');
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('❌ Server Error.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h2>Upload New Style</h2>
        {message && <div className="status-msg">{message}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <label>Style Title (e.g., Fade Cut)</label>
          <input name="title" value={formData.title} onChange={handleChange} required />

          <label>Salon Name</label>
          <input name="salon" value={formData.salon} onChange={handleChange} required />

          <label>Price (e.g., $15.00)</label>
          <input name="price" value={formData.price} onChange={handleChange} required />

          <label>Duration (Minutes)</label>
          <input name="duration" type="number" value={formData.duration} onChange={handleChange} required />

          <label>Image URL</label>
          <input name="image" value={formData.image} onChange={handleChange} required />

          <button type="submit" className="upload-btn">Upload to Database</button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpload;
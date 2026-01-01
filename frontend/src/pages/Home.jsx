import React, { useState, useEffect } from 'react'; // Import useEffect
import Navbar from '../components/Navbar';
import StyleCard from '../components/StyleCard';
import BookingModal from '../components/BookingModal';
import '../styles/Home.css';

const Home = () => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // 1. State to store data from MongoDB
  const [styles, setStyles] = useState([]);

  // 2. Fetch Data when page loads
  useEffect(() => {
    fetch('/api/styles')
      .then(res => res.json())
      .then(data => setStyles(data))
      .catch(err => console.error("Error fetching styles:", err));
  }, []); // Empty brackets [] means "run only once on load"

  const handleBookClick = (style) => {
    setSelectedStyle(style);
  };

  const handleCloseModal = () => {
    setSelectedStyle(null);
  };

  return (
    <div className="home-container">
      <Navbar />
      
      <div className="hero-section">
        <h1>Find Your Next <span className="highlight">Look</span></h1>
        <p>Discover top rated styles from salons near you.</p>
      </div>

      <div className="style-grid">
        {/* The .map() function now uses the Real Database Data */}
        {styles.map((style) => (
          <div key={style._id} onClick={() => handleBookClick(style)}> 
            {/* Note: MongoDB uses '_id' instead of 'id' */}
            <StyleCard 
              image={style.image}
              title={style.title}
              salonName={style.salon}
              price={style.price}
              duration={style.duration}
            />
          </div>
        ))}
      </div>

      <BookingModal 
        isOpen={selectedStyle !== null} 
        onClose={handleCloseModal}
        selectedStyle={selectedStyle}
      />
    </div>
  );
};

export default Home;
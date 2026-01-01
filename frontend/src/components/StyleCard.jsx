import React from 'react';
import '../styles/StyleCard.css';

// 1. PROPS: Look inside the parentheses: ({ image, title, price, salonName })
// This tells React: "I expect to receive these 4 specific pieces of info."
const StyleCard = ({ image, title, price, salonName, duration}) => {
  
  return (
    <div className="style-card">
      {/* 2. DYNAMIC DATA: We use curly braces {} to insert the variables */}
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
      </div>

      <div className="card-details">
        <h3 className="card-title">{title}</h3>
        <p className="card-salon">{salonName}</p>

        <div className="card-meta">
          <span className="duration-badge">⏱ {duration} min</span>
        </div>
        
        <div className="card-footer">
          <span className="card-price">{price}</span>
          <button className="book-btn">Book</button>
        </div>
      </div>
    </div>
  );
};

export default StyleCard;
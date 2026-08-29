import React from 'react';

const CapacityBar = ({ value, label }) => {
  const getBarColor = (val) => {
    if (val < 40) return '#ef4444'; // Red for critical
    if (val < 70) return '#f59e0b'; // Amber for warning
    return '#10b981'; // Green for healthy
  };

  return (
    <div className="capacity-bar-container">
      <div className="capacity-bar-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="capacity-bar-bg">
        <div 
          className="capacity-bar-fill" 
          style={{ 
            width: `${value}%`, 
            backgroundColor: getBarColor(value) 
          }}
        ></div>
      </div>
    </div>
  );
};

export default CapacityBar;

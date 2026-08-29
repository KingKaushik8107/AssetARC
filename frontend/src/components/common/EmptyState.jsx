import React from 'react';

const EmptyState = ({ message, ctaText, onCtaClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <p>{message || "No data found."}</p>
      {ctaText && (
        <button onClick={onCtaClick} className="cta-btn">
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

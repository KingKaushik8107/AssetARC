import React from 'react';

const ErrorHandler = ({ message }) => {
  if (!message) return null;
  return (
    <div className="error-banner">
      <div className="error-content">
        <span>{message}</span>
        <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
      </div>
    </div>
  );
};

export default ErrorHandler;

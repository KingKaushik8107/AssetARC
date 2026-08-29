import React, { useState, useEffect } from 'react';

const NotificationStack = ({ notifications, onRemove }) => {
  return (
    <div className="notification-stack">
      {notifications.map((note) => (
        <div key={note.id} className={`notification ${note.type}`}>
          {note.message}
          <button onClick={() => onRemove(note.id)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationStack;

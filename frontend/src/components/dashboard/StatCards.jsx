import React from 'react';

const StatCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stat-cards">
      <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
        <div className="stat-label">Total Assets</div>
        <div className="stat-value">{stats.totalAssets}</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
        <div className="stat-label">Under Maintenance</div>
        <div className="stat-value">{stats.activeMaintenanceCount}</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
        <div className="stat-label">Avg Health Score</div>
        <div className="stat-value">{stats.averageHealthScore}%</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
        <div className="stat-label">Fleet Value</div>
        <div className="stat-value">${stats.totalFleetValue.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default StatCards;

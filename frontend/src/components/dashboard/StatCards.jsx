import React from 'react';

const StatCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="stat-cards">
      {/* 1. Total Assets */}
      <div className="stat-card stat-blue">
        <div className="stat-card-header">
          <span className="stat-label">Total Assets Fleet</span>
          <div className="stat-icon-wrap blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>
        <div className="stat-value">{stats.totalAssets ?? 0}</div>
        <div className="stat-trend-bar">
          <span className="trend-badge positive">● Connected to SCADA</span>
          <span className="stat-caption">Active monitored units</span>
        </div>
      </div>

      {/* 2. Under Maintenance */}
      <div className="stat-card stat-amber">
        <div className="stat-card-header">
          <span className="stat-label">Under Maintenance</span>
          <div className="stat-icon-wrap amber">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
        </div>
        <div className="stat-value">{stats.activeMaintenanceCount ?? 0}</div>
        <div className="stat-trend-bar">
          <span className={`trend-badge ${stats.activeMaintenanceCount > 0 ? 'warning' : 'neutral'}`}>
            {stats.activeMaintenanceCount > 0 ? '⚠ Active Interventions' : '✓ All Systems Running'}
          </span>
          <span className="stat-caption">Service in progress</span>
        </div>
      </div>

      {/* 3. Avg Health Score */}
      <div className="stat-card stat-green">
        <div className="stat-card-header">
          <span className="stat-label">Aggregate Health Index</span>
          <div className="stat-icon-wrap green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
        <div className="stat-value">{stats.averageHealthScore ?? 100}%</div>
        <div className="stat-trend-bar">
          <span className="trend-badge positive">
            {(stats.averageHealthScore ?? 100) >= 80 ? '✓ Nominal Performance' : '⚠ Anomaly Degradation'}
          </span>
          <span className="stat-caption">Fleet average condition</span>
        </div>
      </div>

      {/* 4. Fleet Valuation */}
      <div className="stat-card stat-purple">
        <div className="stat-card-header">
          <span className="stat-label">Fleet Capital Value</span>
          <div className="stat-icon-wrap purple">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
        </div>
        <div className="stat-value">${(stats.totalFleetValue || 0).toLocaleString()}</div>
        <div className="stat-trend-bar">
          <span className="trend-badge neutral">Capital Asset Ledger</span>
          <span className="stat-caption">Replacement valuation</span>
        </div>
      </div>
    </div>
  );
};

export default StatCards;

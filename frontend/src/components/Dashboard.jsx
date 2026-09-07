import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from './dashboard/StatCards';
import StatusDonut from './dashboard/StatusDonut';
import assetService from '../services/assetService';
import { INDUSTRIAL_IMAGES } from '../services/industrialAssets';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetService.getStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="page-container dashboard-page">
      <div className="skeleton-hero-banner shimmer"></div>
      <div className="skeleton-grid shimmer"></div>
    </div>
  );

  const distribution = stats?.statusDistribution || {};
  const donutData = [
    { label: 'Active', value: distribution.ACTIVE || 0, color: '#10b981' },
    { label: 'Maintenance', value: distribution.UNDER_MAINTENANCE || 0, color: '#f59e0b' },
    { label: 'Decommissioned', value: distribution.DECOMMISSIONED || 0, color: '#ef4444' }
  ];

  return (
    <div className="page-container dashboard-page">
      {/* Hero Command Center Banner */}
      <div 
        className="page-hero-banner industrial-command-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(7, 11, 20, 0.90) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(7, 11, 20, 0.94) 100%), url(${INDUSTRIAL_IMAGES.DASHBOARD_HERO})`
        }}
      >
        <div className="hero-banner-overlay" aria-hidden="true"></div>
        <div className="hero-banner-content">
          <div className="hero-badge-pill">
            <span className="pill-dot live"></span>
            <span>CENTRAL SCADA DISPATCH • LIVE TELEMETRY</span>
          </div>
          <h1 className="hero-title">Industrial Operations Center</h1>
          <p className="hero-subtitle">
            Real-time machine visibility, condition telemetry, and predictive asset lifecycle analytics across plant floor units.
          </p>

          <div className="hero-status-chips">
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">SYSTEM ONLINE</span>
            </div>
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">{stats?.totalAssets ?? 0} ASSETS MONITORED</span>
            </div>
            <div className="hero-chip">
              <span className={`chip-indicator ${stats?.activeMaintenanceCount > 0 ? 'warning' : 'active'}`}></span>
              <span className="chip-text">{stats?.activeMaintenanceCount ?? 0} ATTENTION REQUIRED</span>
            </div>
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">AVG HEALTH: {stats?.averageHealthScore ?? 100}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <StatCards stats={stats} />

      {/* Operations Grid */}
      <div className="dashboard-grid">
        <StatusDonut data={donutData} />

        <div className="welcome-card industrial-card">
          <div className="welcome-card-header">
            <div className="badge-tag">STATUS REPORT</div>
            <h3>Fleet Health Overview & Availability</h3>
          </div>
          <p>
            Equipment availability across facility sectors is currently operating within nominal parameters.
            There are <strong>{stats?.activeMaintenanceCount || 0}</strong> assets undergoing maintenance protocols.
          </p>

          <div className="quick-stats-row">
            <div className="quick-stat-box">
              <span className="quick-stat-lbl">Active Units</span>
              <span className="quick-stat-val text-green">{distribution.ACTIVE || 0}</span>
            </div>
            <div className="quick-stat-box">
              <span className="quick-stat-lbl">Maintenance</span>
              <span className="quick-stat-val text-amber">{distribution.UNDER_MAINTENANCE || 0}</span>
            </div>
            <div className="quick-stat-box">
              <span className="quick-stat-lbl">Decommissioned</span>
              <span className="quick-stat-val text-red">{distribution.DECOMMISSIONED || 0}</span>
            </div>
          </div>

          <div className="welcome-actions">
            <button className="primary-btn" onClick={() => navigate('/assets')}>
              <span>Explore Assets Fleet</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="secondary-btn" onClick={() => navigate('/health')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Live Health Stream</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

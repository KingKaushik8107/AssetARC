import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from './dashboard/StatCards';
import StatusDonut from './dashboard/StatusDonut';
import assetService from '../services/assetService';

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

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const distribution = stats?.statusDistribution || {};
  const donutData = [
    { label: 'Active', value: distribution.ACTIVE || 0, color: '#10b981' },
    { label: 'Maintenance', value: distribution.UNDER_MAINTENANCE || 0, color: '#f59e0b' },
    { label: 'Decommissioned', value: distribution.DECOMMISSIONED || 0, color: '#ef4444' }
  ];

  return (
    <div className="dashboard">
      <h1>Operations Dashboard</h1>
      <StatCards stats={stats} />
      <div className="dashboard-grid">
        <StatusDonut data={donutData} />
        <div className="welcome-card">
          <h3>Fleet Health Overview</h3>
          <p>
            Equipment availability is currently high. 
            There are {stats?.activeMaintenanceCount || 0} assets currently undergoing maintenance.
          </p>
          <button className="primary-btn" onClick={() => navigate('/assets')}>Explore Assets</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

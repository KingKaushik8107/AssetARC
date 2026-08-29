import React from 'react';
import { useSelector } from 'react-redux';
import CapacityBar from './common/CapacityBar';

const HealthMonitor = () => {
  const { items } = useSelector((state) => state.assets);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Live Condition Monitoring</h1>
        <div className="status-legend">
          <span className="dot online"></span> System Connected
        </div>
      </div>

      <div className="telemetry-grid">
        {items.filter(a => a.currentStatus !== 'DECOMMISSIONED').map((asset) => (
          <div key={asset.id} className="telemetry-card">
            <div className="card-top">
              <h3>{asset.name}</h3>
              <span className="tag-label">{asset.assetTag}</span>
            </div>

            <div className="sensor-readings">
              <div className="sensor-item">
                <label>Vibration</label>
                <span className={`value ${(asset.currentHealth ?? 100) < 70 ? 'danger' : ''}`}>
                  {(asset.currentHealth ?? 100) > 80
                    ? (0.01 + (asset.id % 5) * 0.005).toFixed(2)
                    : (asset.currentHealth ?? 100) > 60 ? '0.08' : '0.15'}
                  <small>mm/s</small>
                </span>
              </div>
              <div className="sensor-item">
                <label>Temperature</label>
                <span className={`value ${(asset.currentHealth ?? 100) < 70 ? 'danger' : ''}`}>
                  {(asset.currentHealth ?? 100) > 80
                    ? (40 + (asset.id % 10) * 0.8).toFixed(1)
                    : (asset.currentHealth ?? 100) > 60 ? '75.5' : '110.8'}
                  <small>°C</small>
                </span>
              </div>
            </div>

            <div className="health-bar-container">
              <label>Aggregate Health Index</label>
              <CapacityBar value={asset.currentHealth ?? 100} />
            </div>

            <div className="card-footer">
              <span className="last-sync">Last updated: Just now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthMonitor;
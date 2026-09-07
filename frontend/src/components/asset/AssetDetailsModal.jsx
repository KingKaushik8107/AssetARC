import React, { useState } from 'react';
import CapacityBar from '../common/CapacityBar';
import { getEquipmentImage } from '../../services/industrialAssets';

const AssetDetailsModal = ({ isOpen, onClose, asset }) => {
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'telemetry' | 'lifecycle'

  if (!isOpen || !asset) return null;

  const equipmentImgUrl = getEquipmentImage(asset.category);
  const healthScore = asset.currentHealth ?? 100;
  const isHealthy = healthScore >= 80;
  const isWarning = healthScore >= 60 && healthScore < 80;

  return (
    <div className="modal-overlay">
      <div className="modal-content digital-twin-modal industrial-card">
        {/* Digital Twin Image Header Banner */}
        <div 
          className="digital-twin-hero-header"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(7, 11, 20, 0.45) 0%, rgba(15, 23, 42, 0.88) 70%, rgba(17, 24, 39, 0.98) 100%), url(${equipmentImgUrl})`
          }}
        >
          <div className="digital-twin-top-row">
            <div className="digital-twin-tag-badge">
              <span className="scada-dot live"></span>
              <span>DIGITAL TWIN PROFILE • {asset.assetTag}</span>
            </div>
            <button className="close-btn modal-close-btn" onClick={onClose} title="Close inspection">✕</button>
          </div>

          <div className="digital-twin-title-block">
            <h2 className="digital-twin-name">{asset.name}</h2>
            <div className="digital-twin-meta-chips">
              <span className="meta-chip category">{asset.category || 'Machinery'}</span>
              <span className={`status-pill ${asset.currentStatus?.toLowerCase()}`}>
                {asset.currentStatus === 'UNDER_MAINTENANCE' 
                  ? 'Under Maintenance' 
                  : asset.currentStatus === 'ACTIVE' 
                    ? 'Active Operation' 
                    : asset.currentStatus?.replace(/_/g, ' ') || 'Unknown'}
              </span>
              <span className={`health-status-chip ${isHealthy ? 'healthy' : isWarning ? 'warning' : 'critical'}`}>
                {isHealthy ? '● HEALTHY' : isWarning ? '⚠ ATTENTION' : '🔴 CRITICAL'} ({healthScore}%)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="digital-twin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Equipment Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            Live Condition Telemetry
          </button>
          <button 
            className={`tab-btn ${activeTab === 'lifecycle' ? 'active' : ''}`}
            onClick={() => setActiveTab('lifecycle')}
          >
            Lifecycle & Capital Asset Data
          </button>
        </div>

        {/* Tab 1: Equipment Specifications */}
        {activeTab === 'specs' && (
          <div className="details-grid-wrapper">
            <div className="details-grid">
              <div className="detail-item">
                <label>Asset Serial / Tag</label>
                <p><code>{asset.assetTag}</code></p>
              </div>
              <div className="detail-item">
                <label>Unit Model Name</label>
                <p>{asset.name}</p>
              </div>
              <div className="detail-item">
                <label>Equipment Classification</label>
                <p>{asset.category || 'General Industrial'}</p>
              </div>
              <div className="detail-item">
                <label>Commissioning Date</label>
                <p>{asset.installDate ? new Date(asset.installDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Capital Acquisition Cost</label>
                <p>${Number(asset.purchasePrice || 0).toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <label>Design Lifecycle</label>
                <p>{asset.expectedLifespanYears || 10} Years</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Condition Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="digital-twin-telemetry-body">
            <div className="telemetry-gauge-card">
              <div className="gauge-header">
                <span className="gauge-label">AGGREGATE SYSTEM HEALTH</span>
                <span className="gauge-score">{healthScore}%</span>
              </div>
              <CapacityBar value={healthScore} />
            </div>

            <div className="telemetry-sensors-row">
              <div className="sensor-box">
                <span className="sensor-lbl">Vibration Velocity (RMS)</span>
                <span className={`sensor-val ${healthScore < 70 ? 'text-danger' : 'text-cyan'}`}>
                  {healthScore > 80 ? '0.03' : healthScore > 60 ? '0.08' : '0.19'} <small>mm/s</small>
                </span>
                <span className="sensor-threshold">{healthScore > 80 ? 'ISO Class I Nominal' : 'Vibration Alert'}</span>
              </div>
              <div className="sensor-box">
                <span className="sensor-lbl">Operating Thermal Bearing</span>
                <span className={`sensor-val ${healthScore < 70 ? 'text-danger' : 'text-cyan'}`}>
                  {healthScore > 80 ? '46.4' : healthScore > 60 ? '79.2' : '109.8'} <small>°C</small>
                </span>
                <span className="sensor-threshold">{healthScore > 80 ? 'Thermal Safe Range' : 'High Temp Warning'}</span>
              </div>
              <div className="sensor-box">
                <span className="sensor-lbl">SCADA Status</span>
                <span className="sensor-val text-green">Online</span>
                <span className="sensor-threshold">Continuous Polling</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lifecycle & Depreciation */}
        {activeTab === 'lifecycle' && (
          <div className="digital-twin-lifecycle-body">
            <div className="lifecycle-metrics-grid">
              <div className="lifecycle-stat">
                <span className="lbl">Initial Capital Expenditure</span>
                <span className="val">${Number(asset.purchasePrice || 0).toLocaleString()}</span>
              </div>
              <div className="lifecycle-stat">
                <span className="lbl">Expected Useful Service</span>
                <span className="val">{asset.expectedLifespanYears || 10} Years</span>
              </div>
              <div className="lifecycle-stat">
                <span className="lbl">Operating Status</span>
                <span className="val">{asset.currentStatus}</span>
              </div>
              <div className="lifecycle-stat">
                <span className="lbl">Preventative Service Interval</span>
                <span className="val">Every 90 Days</span>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Close Profile</button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;

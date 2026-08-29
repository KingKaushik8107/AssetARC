import React from 'react';
import CapacityBar from '../common/CapacityBar';

const AssetDetailsModal = ({ isOpen, onClose, asset }) => {
  if (!isOpen || !asset) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content asset-details-modal">
        <div className="modal-header">
          <h2>Asset Specifications</h2>
          <span className={`status-badge ${asset.currentStatus.toLowerCase()}`}>
            {asset.currentStatus}
          </span>
        </div>
        
        <div className="details-grid">
          <div className="detail-item">
            <label>Asset Tag</label>
            <p>{asset.assetTag}</p>
          </div>
          <div className="detail-item">
            <label>Name</label>
            <p>{asset.name}</p>
          </div>
          <div className="detail-item">
            <label>Category</label>
            <p>{asset.category}</p>
          </div>
          <div className="detail-item">
            <label>Installation Date</label>
            <p>{new Date(asset.installDate).toLocaleDateString()}</p>
          </div>
          <div className="detail-item">
            <label>Purchase Price</label>
            <p>${asset.purchasePrice.toLocaleString()}</p>
          </div>
          <div className="detail-item">
            <label>Expected Lifespan</label>
            <p>{asset.expectedLifespanYears} Years</p>
          </div>
        </div>

        <div className="health-section">
          <h3>Condition Monitoring</h3>
          <div className="health-card">
            <label>Current Health Index</label>
            <CapacityBar value={asset.currentHealth ?? 100} />
            <div className="telemetry">
              <span>Vibration: {(asset.currentHealth ?? 100) > 80 ? '0.02' : '0.15'}mm/s</span>
              <span>Temp: {(asset.currentHealth ?? 100) > 80 ? '45.2' : '110.5'}°C</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsModal;

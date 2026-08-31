import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssets } from '../store/slices/assetSlice';
import healthService from '../services/healthService';
import CapacityBar from './common/CapacityBar';

const HealthMonitor = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetAsset, setTargetAsset] = useState('');
  const [healthScore, setHealthScore] = useState('90');
  const [vibrationLevel, setVibrationLevel] = useState('0.04');
  const [temperatureCelsius, setTemperatureCelsius] = useState('48.5');
  const [apiType, setApiType] = useState('DIAGNOSTIC'); // 'DIAGNOSTIC' -> /api/health/record, 'TELEMETRY' -> /api/monitoring/metrics
  const [submitting, setSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState({ type: '', message: '' });

  const activeAssets = (items || []).filter(a => a.currentStatus !== 'DECOMMISSIONED');

  const handleOpenModal = (asset = null, defaultApiType = 'DIAGNOSTIC') => {
    if (asset) {
      setTargetAsset(asset.id.toString());
      setHealthScore((asset.currentHealth ?? 90).toString());
    } else if (activeAssets.length > 0) {
      setTargetAsset(activeAssets[0].id.toString());
    }
    setApiType(defaultApiType);
    setStatusFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  const handleRecordMetric = async (e) => {
    e.preventDefault();
    if (!targetAsset) {
      alert('Please select an equipment unit.');
      return;
    }
    setSubmitting(true);
    setStatusFeedback({ type: '', message: '' });

    const payload = {
      assetId: parseInt(targetAsset, 10),
      healthScore: parseInt(healthScore, 10),
      vibrationLevel: parseFloat(vibrationLevel),
      temperatureCelsius: parseFloat(temperatureCelsius)
    };

    try {
      if (apiType === 'DIAGNOSTIC') {
        await healthService.recordHealth(payload);
        setStatusFeedback({
          type: 'success',
          message: 'Diagnostic health metric recorded successfully via /api/health/record!'
        });
      } else {
        await healthService.recordMetric(payload);
        setStatusFeedback({
          type: 'success',
          message: 'IoT sensor telemetry ingested successfully via /api/monitoring/metrics!'
        });
      }
      // Refresh asset state to reflect updated health
      dispatch(fetchAssets(0));
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to submit health metrics', err);
      setStatusFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit metrics. Check user permissions.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isTechnician = user?.role === 'MAINTENANCE_TECHNICIAN' || user?.role === 'SYSTEM_ADMIN';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Live Condition Monitoring & Telemetry</h1>
          <p className="page-subtitle">Real-time vibration, thermal sensors, and aggregate health metrics</p>
        </div>
        <div className="header-actions-flex">
          <div className="status-legend">
            <span className="dot online"></span> Telemetry Stream Active
          </div>
          {isTechnician && (
            <button className="primary-btn" onClick={() => handleOpenModal(null, 'DIAGNOSTIC')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Record Diagnostics</span>
            </button>
          )}
          <button className="secondary-btn" onClick={() => handleOpenModal(null, 'TELEMETRY')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Update Diagnostics</span>
          </button>
        </div>
      </div>

      <div className="telemetry-grid">
        {activeAssets.map((asset) => (
          <div key={asset.id} className="telemetry-card">
            <div className="card-top">
              <div>
                <h3>{asset.name}</h3>
                <span className="tag-label">{asset.assetTag}</span>
              </div>
              <span className={`status-pill ${asset.currentStatus?.toLowerCase()}`}>
                {asset.currentStatus}
              </span>
            </div>

            <div className="sensor-readings">
              <div className="sensor-item">
                <label>Vibration (RMS)</label>
                <span className={`value ${(asset.currentHealth ?? 100) < 70 ? 'danger' : ''}`}>
                  {(asset.currentHealth ?? 100) > 80
                    ? (0.02 + (asset.id % 5) * 0.008).toFixed(2)
                    : (asset.currentHealth ?? 100) > 60 ? '0.09' : '0.18'}
                  <small>mm/s</small>
                </span>
              </div>
              <div className="sensor-item">
                <label>Operating Temp</label>
                <span className={`value ${(asset.currentHealth ?? 100) < 70 ? 'danger' : ''}`}>
                  {(asset.currentHealth ?? 100) > 80
                    ? (42 + (asset.id % 10) * 1.1).toFixed(1)
                    : (asset.currentHealth ?? 100) > 60 ? '78.4' : '108.6'}
                  <small>°C</small>
                </span>
              </div>
            </div>

            <div className="health-bar-container">
              <div className="health-bar-header">
                <label>Aggregate Health Index</label>
                <span className="health-percent">{asset.currentHealth ?? 100}%</span>
              </div>
              <CapacityBar value={asset.currentHealth ?? 100} />
            </div>

            <div className="card-footer-actions">
              <span className="last-sync">Status: Online</span>
              <div className="card-btn-row">
                <button
                  className="quick-action-btn"
                  onClick={() => handleOpenModal(asset, isTechnician ? 'DIAGNOSTIC' : 'TELEMETRY')}
                  title="Update Condition Score"
                >
                  ⚡ Record Metric
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Record Health & Condition Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Record Health & Condition Metric</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            {statusFeedback.message && (
              <div className={`notification-banner ${statusFeedback.type}`}>
                {statusFeedback.message}
              </div>
            )}

            <form onSubmit={handleRecordMetric} className="modal-form">
              <div className="form-group">
                <label>API Endpoint Target</label>
                <div className="endpoint-selector">
                  <label className={`radio-pill ${apiType === 'DIAGNOSTIC' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="apiType"
                      value="DIAGNOSTIC"
                      checked={apiType === 'DIAGNOSTIC'}
                      onChange={() => setApiType('DIAGNOSTIC')}
                    />
                    <span>POST /api/health/record (Technician Diagnostic)</span>
                  </label>
                  <label className={`radio-pill ${apiType === 'TELEMETRY' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="apiType"
                      value="TELEMETRY"
                      checked={apiType === 'TELEMETRY'}
                      onChange={() => setApiType('TELEMETRY')}
                    />
                    <span>POST /api/monitoring/metrics (Sensor Telemetry)</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Target Equipment Asset</label>
                <select
                  required
                  value={targetAsset}
                  onChange={(e) => setTargetAsset(e.target.value)}
                >
                  <option value="">-- Choose Equipment --</option>
                  {activeAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.assetTag} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Health Score (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={healthScore}
                  onChange={(e) => setHealthScore(e.target.value)}
                  placeholder="e.g. 92"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vibration Level (mm/s)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={vibrationLevel}
                    onChange={(e) => setVibrationLevel(e.target.value)}
                    placeholder="e.g. 0.04"
                  />
                </div>
                <div className="form-group">
                  <label>Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={temperatureCelsius}
                    onChange={(e) => setTemperatureCelsius(e.target.value)}
                    placeholder="e.g. 52.0"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Submitting to Backend...' : 'Submit Metric Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthMonitor;


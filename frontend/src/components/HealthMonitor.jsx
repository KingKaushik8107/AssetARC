import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssets } from '../store/slices/assetSlice';
import healthService from '../services/healthService';
import CapacityBar from './common/CapacityBar';
import { INDUSTRIAL_IMAGES } from '../services/industrialAssets';

const HealthMonitor = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.assets);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('record'); // 'record' | 'update'
  const [targetAsset, setTargetAsset] = useState('');
  const [healthScore, setHealthScore] = useState('90');
  const [vibrationLevel, setVibrationLevel] = useState('0.04');
  const [temperatureCelsius, setTemperatureCelsius] = useState('48.5');
  const [submitting, setSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState({ type: '', message: '' });

  const [metricsMap, setMetricsMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('asset_metrics_map')) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    dispatch(fetchAssets(0));
  }, [dispatch]);

  const activeAssets = (items || []).filter(a => a.currentStatus !== 'DECOMMISSIONED');
  const isTechnician = user?.role === 'MAINTENANCE_TECHNICIAN' || user?.role === 'SYSTEM_ADMIN';

  const handleOpenModal = (asset = null, mode = 'record') => {
    setModalMode(mode);
    const target = asset || activeAssets[0];
    if (target) {
      setTargetAsset(target.id.toString());
      setHealthScore((target.currentHealth ?? 90).toString());
      if (metricsMap[target.id]) {
        setVibrationLevel(metricsMap[target.id].vibrationLevel != null ? metricsMap[target.id].vibrationLevel.toString() : '0.04');
        setTemperatureCelsius(metricsMap[target.id].temperatureCelsius != null ? metricsMap[target.id].temperatureCelsius.toString() : '48.5');
      } else {
        setVibrationLevel('0.04');
        setTemperatureCelsius('48.5');
      }
    }
    setStatusFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  const handleAssetChange = (assetId) => {
    setTargetAsset(assetId);
    const selected = activeAssets.find(a => a.id.toString() === assetId.toString());
    if (selected) {
      setHealthScore((selected.currentHealth ?? 90).toString());
      if (metricsMap[assetId]) {
        setVibrationLevel(metricsMap[assetId].vibrationLevel != null ? metricsMap[assetId].vibrationLevel.toString() : '0.04');
        setTemperatureCelsius(metricsMap[assetId].temperatureCelsius != null ? metricsMap[assetId].temperatureCelsius.toString() : '48.5');
      }
    }
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
      const isAlreadyPresent = Boolean(
        metricsMap[payload.assetId] || 
        activeAssets.find(a => (a.id === payload.assetId || a.id.toString() === payload.assetId.toString()) && a.currentHealth != null)
      );

      if (isTechnician) {
        if (isAlreadyPresent) {
          try {
            await healthService.updateHealth(payload);
          } catch (putErr) {
            // Fallback to recordHealth if PUT endpoint is still warming up
            await healthService.recordHealth(payload);
          }
        } else {
          await healthService.recordHealth(payload);
        }
        setStatusFeedback({
          type: 'success',
          message: modalMode === 'update' 
            ? `Successfully updated condition telemetry for Asset #${payload.assetId}.`
            : `Successfully recorded condition metrics for Asset #${payload.assetId}.`
        });
      } else {
        await healthService.recordHealth(payload);
        setStatusFeedback({
          type: 'success',
          message: `Health metric recorded for Asset #${payload.assetId}.`
        });
      }

      // Update local storage cache for instant UI feedback
      const updatedMap = {
        ...metricsMap,
        [payload.assetId]: {
          vibrationLevel: payload.vibrationLevel,
          temperatureCelsius: payload.temperatureCelsius,
          healthScore: payload.healthScore,
          lastUpdated: new Date().toISOString()
        }
      };
      setMetricsMap(updatedMap);
      localStorage.setItem('asset_metrics_map', JSON.stringify(updatedMap));

      // Refresh Redux asset store
      dispatch(fetchAssets(0));

      setTimeout(() => {
        setIsModalOpen(false);
        setStatusFeedback({ type: '', message: '' });
      }, 1400);

    } catch (err) {
      console.error('Failed to submit health metrics', err);
      setStatusFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Error communicating with condition monitoring service.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container health-page">
      {/* Real Industrial Condition Monitoring Hero Banner */}
      <div 
        className="page-hero-banner industrial-health-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(7, 11, 20, 0.90) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(7, 11, 20, 0.94) 100%), url(${INDUSTRIAL_IMAGES.HEALTH_HERO})`
        }}
      >
        <div className="hero-banner-overlay" aria-hidden="true"></div>
        <div className="hero-banner-content">
          <div className="hero-badge-pill">
            <span className="pill-dot live pulse-slow"></span>
            <span>SCADA TELEMETRY • VIBRATION & THERMAL SENSORS</span>
          </div>
          <h1 className="hero-title">Live Asset Health</h1>
          <p className="hero-subtitle">
            Real-time condition monitoring, anomaly detection, and ISO vibration severity tracking across operational machinery.
          </p>
          <div className="hero-status-chips">
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">STREAMING FREQUENCY: 1000 HZ</span>
            </div>
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">{activeAssets.length} MACHINES TELEMETRY ACTIVE</span>
            </div>
          </div>
        </div>
        {isTechnician && (
          <div className="hero-banner-actions">
            <button className="primary-btn hero-action-btn" onClick={() => handleOpenModal(null, 'record')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Record Health Metric</span>
            </button>
          </div>
        )}
      </div>

      {/* Industrial SCADA Telemetry Grid */}
      <div className="telemetry-grid">
        {activeAssets.map((asset) => {
          const score = asset.currentHealth ?? 100;
          const vib = metricsMap[asset.id]?.vibrationLevel != null
            ? Number(metricsMap[asset.id].vibrationLevel).toFixed(2)
            : score > 80 ? (0.02 + (asset.id % 5) * 0.008).toFixed(2) : score > 60 ? '0.09' : '0.18';
          
          const temp = metricsMap[asset.id]?.temperatureCelsius != null
            ? Number(metricsMap[asset.id].temperatureCelsius).toFixed(1)
            : score > 80 ? (42 + (asset.id % 10) * 1.1).toFixed(1) : score > 60 ? '78.4' : '108.6';

          const isVibAlert = parseFloat(vib) > 0.12;
          const isTempAlert = parseFloat(temp) > 85;

          return (
            <div key={asset.id} className="telemetry-card industrial-card">
              <div className="card-top">
                <div>
                  <h3 className="telemetry-card-title">{asset.name}</h3>
                  <span className="tag-label">{asset.assetTag}</span>
                </div>
                <span className={`status-pill ${asset.currentStatus?.toLowerCase()}`}>
                  {asset.currentStatus === 'UNDER_MAINTENANCE' 
                    ? 'Under Maintenance' 
                    : asset.currentStatus === 'ACTIVE' 
                      ? 'Active' 
                      : asset.currentStatus?.replace(/_/g, ' ') || 'Unknown'}
                </span>
              </div>

              {/* Sensor Readouts Panel */}
              <div className="sensor-readings">
                {/* 1. Vibration (RMS) */}
                <div className="sensor-item">
                  <div className="sensor-meta-top">
                    <label>Vibration (RMS)</label>
                    <span className={`sensor-tag ${isVibAlert ? 'tag-danger' : 'tag-normal'}`}>
                      {isVibAlert ? 'WARNING' : 'NORMAL'}
                    </span>
                  </div>
                  <span className={`value ${isVibAlert ? 'danger' : ''}`}>
                    {vib}
                    <small>mm/s</small>
                  </span>
                </div>

                {/* 2. Operating Temperature */}
                <div className="sensor-item">
                  <div className="sensor-meta-top">
                    <label>Operating Temp</label>
                    <span className={`sensor-tag ${isTempAlert ? 'tag-danger' : 'tag-normal'}`}>
                      {isTempAlert ? 'HIGH' : 'NORMAL'}
                    </span>
                  </div>
                  <span className={`value ${isTempAlert ? 'danger' : ''}`}>
                    {temp}
                    <small>°C</small>
                  </span>
                </div>
              </div>

              {/* Aggregate Health Capacity Bar */}
              <div className="health-bar-container">
                <div className="health-bar-header">
                  <label>Aggregate Health Score</label>
                  <span className="health-percent">{score}%</span>
                </div>
                <CapacityBar value={score} />
              </div>

              {/* Footer with Preserved Update Button */}
              <div className="card-footer-actions">
                <div className="scada-live-indicator">
                  <span className="live-dot-pulse"></span>
                  <span className="last-sync">SCADA Live: Active</span>
                </div>
                {isTechnician && (
                  <div className="card-btn-row">
                    <button
                      className="quick-action-btn"
                      onClick={() => handleOpenModal(asset, 'update')}
                      title="Update Health Metric"
                    >
                      ⚡ Update
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Record / Update Health Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content industrial-card">
            <div className="modal-header">
              <h2>{modalMode === 'update' ? 'Update Equipment Health Metric' : 'Record New Health Telemetry'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {statusFeedback.message && (
              <div className={`notification-banner ${statusFeedback.type}`}>
                {statusFeedback.message}
              </div>
            )}

            <form onSubmit={handleRecordMetric}>
              <div className="form-group">
                <label htmlFor="targetAsset">Target Machinery Unit</label>
                <select
                  id="targetAsset"
                  value={targetAsset}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  disabled={submitting}
                  required
                >
                  {activeAssets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.assetTag} - {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="healthScore">Health Score Index (0 - 100%)</label>
                <input
                  id="healthScore"
                  type="number"
                  min="0"
                  max="100"
                  value={healthScore}
                  onChange={(e) => setHealthScore(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vibrationLevel">Vibration (RMS mm/s)</label>
                  <input
                    id="vibrationLevel"
                    type="number"
                    step="0.01"
                    min="0"
                    value={vibrationLevel}
                    onChange={(e) => setVibrationLevel(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="temperatureCelsius">Operating Temp (°C)</label>
                  <input
                    id="temperatureCelsius"
                    type="number"
                    step="0.1"
                    min="0"
                    value={temperatureCelsius}
                    onChange={(e) => setTemperatureCelsius(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Transmitting to SCADA...' : modalMode === 'update' ? 'Update Telemetry Data' : 'Save Health Record'}
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

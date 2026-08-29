import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSchedule } from '../../store/slices/maintenanceSlice';

const ScheduleMaintenanceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items: assets } = useSelector((state) => state.assets);
  const [formData, setFormData] = useState({
    assetId: '',
    plannedDate: '',
    maintenanceType: 'ROUTINE',
    priority: 'MEDIUM'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSchedule({
      ...formData,
      assetId: parseInt(formData.assetId)
    })).then((res) => {
      if (!res.error) onClose();
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Schedule Maintenance</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Asset</label>
            <select 
              required 
              value={formData.assetId}
              onChange={(e) => setFormData({...formData, assetId: e.target.value})}
            >
              <option value="">-- Select Asset --</option>
              {assets.filter(a => a.currentStatus !== 'DECOMMISSIONED').map(asset => (
                <option key={asset.id} value={asset.id}>{asset.assetTag} - {asset.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Planned Date</label>
            <input 
              type="date" 
              required 
              value={formData.plannedDate}
              onChange={(e) => setFormData({...formData, plannedDate: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Maintenance Type</label>
            <select 
              value={formData.maintenanceType}
              onChange={(e) => setFormData({...formData, maintenanceType: e.target.value})}
            >
              <option value="ROUTINE">Routine</option>
              <option value="REPAIR">Repair</option>
              <option value="INSPECTION">Inspection</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select 
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn">Schedule Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMaintenanceModal;

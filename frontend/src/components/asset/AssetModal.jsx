import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAsset } from '../../store/slices/assetSlice';

const AssetModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    category: 'MANUFACTURING',
    installDate: '',
    purchasePrice: '',
    expectedLifespanYears: '',
    currentStatus: 'ACTIVE'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAsset(formData)).then((res) => {
      if (!res.error) onClose();
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register New Asset</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Asset Tag</label>
            <input 
              type="text" 
              required 
              value={formData.assetTag}
              onChange={(e) => setFormData({...formData, assetTag: e.target.value})}
              placeholder="e.g. CNC-202"
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Main Milling Station"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="MANUFACTURING">Manufacturing</option>
                <option value="LOGISTICS">Logistics</option>
                <option value="UTILITIES">Utilities</option>
                <option value="FACILITIES">Facilities</option>
              </select>
            </div>
            <div className="form-group">
              <label>Install Date</label>
              <input 
                type="date" 
                required 
                value={formData.installDate}
                onChange={(e) => setFormData({...formData, installDate: e.target.value})}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Purchase Price ($)</label>
              <input 
                type="number" 
                required 
                value={formData.purchasePrice}
                onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Lifespan (Years)</label>
              <input 
                type="number" 
                required 
                value={formData.expectedLifespanYears}
                onChange={(e) => setFormData({...formData, expectedLifespanYears: e.target.value})}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn">Save Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;

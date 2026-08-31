import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAsset, updateAsset } from '../../store/slices/assetSlice';

const AssetModal = ({ isOpen, onClose, assetToEdit = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    assetTag: '',
    name: '',
    category: 'MANUFACTURING',
    installDate: '',
    purchasePrice: '',
    expectedLifespanYears: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        assetTag: assetToEdit.assetTag || '',
        name: assetToEdit.name || '',
        category: assetToEdit.category || 'MANUFACTURING',
        installDate: assetToEdit.installDate ? assetToEdit.installDate.substring(0, 10) : '',
        purchasePrice: assetToEdit.purchasePrice || '',
        expectedLifespanYears: assetToEdit.expectedLifespanYears || ''
      });
    } else {
      setFormData({
        assetTag: '',
        name: '',
        category: 'MANUFACTURING',
        installDate: '',
        purchasePrice: '',
        expectedLifespanYears: ''
      });
    }
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      assetTag: formData.assetTag,
      name: formData.name,
      category: formData.category,
      installDate: formData.installDate,
      purchasePrice: parseFloat(formData.purchasePrice),
      expectedLifespanYears: parseInt(formData.expectedLifespanYears, 10)
    };

    if (assetToEdit && assetToEdit.id) {
      const res = await dispatch(updateAsset({ id: assetToEdit.id, assetData: payload }));
      setSaving(false);
      if (!res.error) onClose();
    } else {
      const res = await dispatch(createAsset(payload));
      setSaving(false);
      if (!res.error) onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{assetToEdit ? 'Edit Asset Specifications' : 'Register New Industrial Asset'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
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
            <label>Equipment Name</label>
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
                step="0.01"
                required 
                value={formData.purchasePrice}
                onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Lifespan (Years)</label>
              <input 
                type="number" 
                min="1"
                required 
                value={formData.expectedLifespanYears}
                onChange={(e) => setFormData({...formData, expectedLifespanYears: e.target.value})}
                placeholder="10"
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? 'Saving...' : (assetToEdit ? 'Save Changes' : 'Create Asset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeTask } from '../../store/slices/maintenanceSlice';

const LogMaintenanceModal = ({ isOpen, onClose, task }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    workDescription: '',
    costIncurred: ''
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        workDescription: '',
        costIncurred: ''
      });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(completeTask({
      scheduleId: task.id,
      workDescription: formData.workDescription,
      costIncurred: parseFloat(formData.costIncurred),
      technicianId: user.id
    })).then((res) => {
      if (!res.error) onClose();
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Complete Maintenance Task</h2>
        <p>Asset: <strong>{task?.asset?.name} ({task?.asset?.assetTag})</strong></p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Work Description</label>
            <textarea 
              required 
              rows="4"
              value={formData.workDescription}
              onChange={(e) => setFormData({...formData, workDescription: e.target.value})}
              placeholder="Describe the maintenance work performed..."
            ></textarea>
          </div>
          <div className="form-group">
            <label>Cost Incurred ($)</label>
            <input 
              type="number" 
              required 
              value={formData.costIncurred}
              onChange={(e) => setFormData({...formData, costIncurred: e.target.value})}
              placeholder="Total cost of parts and labor"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="complete-btn">Submit Completion</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogMaintenanceModal;

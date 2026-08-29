import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../../store/slices/maintenanceSlice';
import EmptyState from '../common/EmptyState';

import LogMaintenanceModal from './LogMaintenanceModal';
import ScheduleMaintenanceModal from './ScheduleMaintenanceModal';
import AssetDetailsModal from '../asset/AssetDetailsModal';

const MaintenanceScheduler = () => {
  const dispatch = useDispatch();
  const { schedules, loading } = useSelector((state) => state.maintenance);
  const { user } = useSelector((state) => state.auth);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState(null);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  if (loading) return <div className="loading">Loading schedules...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Maintenance Schedule</h1>
        {(user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN') && (
          <button className="add-btn" onClick={() => setIsScheduleModalOpen(true)}>Schedule Task</button>
        )}
      </div>

      <div className="table-card">
        {schedules.length === 0 ? (
          <EmptyState message="All systems are clear. No pending maintenance." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Planned Date</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((task) => (
                <tr key={task.id}>
                  <td>{task.asset.assetTag}</td>
                  <td>{task.maintenanceType}</td>
                  <td>{task.plannedDate}</td>
                  <td>
                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    {user?.role === 'MAINTENANCE_TECHNICIAN' ? (
                      <button className="complete-btn" onClick={() => setSelectedTask(task)}>Complete Task</button>
                    ) : (
                      <button className="view-btn" onClick={() => setSelectedAsset(task.asset)}>View Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <LogMaintenanceModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask} 
      />
      <ScheduleMaintenanceModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
      <AssetDetailsModal
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        asset={selectedAsset}
      />
    </div>
  );
};

export default MaintenanceScheduler;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules } from '../../store/slices/maintenanceSlice';
import EmptyState from '../common/EmptyState';
import { INDUSTRIAL_IMAGES } from '../../services/industrialAssets';

import LogMaintenanceModal from './LogMaintenanceModal';
import ScheduleMaintenanceModal from './ScheduleMaintenanceModal';
import AssetDetailsModal from '../asset/AssetDetailsModal';

const MaintenanceScheduler = () => {
  const dispatch = useDispatch();
  const { schedules, loading } = useSelector((state) => state.maintenance);
  const { user } = useSelector((state) => state.auth);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const canSchedule = user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN';
  const isTechnician = user?.role === 'MAINTENANCE_TECHNICIAN' || user?.role === 'SYSTEM_ADMIN';

  const filteredSchedules = (schedules || []).filter(task => {
    if (priorityFilter === 'ALL') return true;
    return task.priority?.toUpperCase() === priorityFilter;
  });

  const criticalCount = (schedules || []).filter(s => s.priority?.toUpperCase() === 'CRITICAL' || s.priority?.toUpperCase() === 'HIGH').length;

  if (loading && (schedules || []).length === 0) return (
    <div className="page-container maintenance-page">
      <div className="skeleton-hero-banner shimmer"></div>
      <div className="skeleton-table shimmer"></div>
    </div>
  );

  return (
    <div className="page-container maintenance-page">
      {/* Predictive Maintenance Hero Banner */}
      <div 
        className="page-hero-banner industrial-maintenance-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(7, 11, 20, 0.90) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(7, 11, 20, 0.94) 100%), url(${INDUSTRIAL_IMAGES.MAINTENANCE_HERO})`
        }}
      >
        <div className="hero-banner-overlay" aria-hidden="true"></div>
        <div className="hero-banner-content">
          <div className="hero-badge-pill">
            <span className="pill-dot warning"></span>
            <span>PREDICTIVE WORKSPACE • WORK ORDERS</span>
          </div>
          <h1 className="hero-title">Maintenance Operations</h1>
          <p className="hero-subtitle">
            Prevent unscheduled facility downtime before it happens through proactive intervention, field technician dispatch, and AI threshold alerts.
          </p>
          <div className="hero-status-chips">
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">{schedules?.length || 0} SCHEDULED INTERVENTIONS</span>
            </div>
            <div className="hero-chip">
              <span className={`chip-indicator ${criticalCount > 0 ? 'warning' : 'active'}`}></span>
              <span className="chip-text">{criticalCount} HIGH / CRITICAL PRIORITY</span>
            </div>
          </div>
        </div>
        {canSchedule && (
          <div className="hero-banner-actions">
            <button className="primary-btn hero-action-btn" onClick={() => setIsScheduleModalOpen(true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Schedule Maintenance Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="maintenance-filter-bar">
        <div className="filter-tab-chips">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              type="button"
              className={`filter-tab-btn ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p === 'ALL' ? 'All Scheduled Tasks' : `${p} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance Table Card */}
      <div className="table-card industrial-card">
        {filteredSchedules.length === 0 ? (
          <EmptyState 
            title="All Machinery Systems Clear"
            message="No pending maintenance tasks matching this filter. Equipment operating normally." 
          />
        ) : (
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Target Machinery</th>
                  <th>Task Type</th>
                  <th>Scheduled Target Date</th>
                  <th>Priority Level</th>
                  <th>Operations Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((task) => {
                  const isCritical = task.priority?.toUpperCase() === 'CRITICAL' || task.priority?.toUpperCase() === 'HIGH';
                  return (
                    <tr key={task.id} className={isCritical ? 'row-critical-highlight' : ''}>
                      <td>
                        <div className="maintenance-asset-cell">
                          <strong className="asset-tag-badge">{task.asset?.assetTag || 'N/A'}</strong>
                          <span className="asset-sub-name">{task.asset?.name || ''}</span>
                        </div>
                      </td>
                      <td>
                        <span className="maintenance-type-pill">{task.maintenanceType || 'Inspection'}</span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <span className="calendar-icon">📅</span>
                          <span>{task.plannedDate || 'Pending'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`priority-badge ${task.priority?.toLowerCase()} ${isCritical ? 'pulse-priority' : ''}`}>
                          {isCritical && <span className="priority-pulse-dot"></span>}
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          {isTechnician ? (
                            <button className="complete-btn" onClick={() => setSelectedTask(task)}>
                              <span>Complete Task</span>
                            </button>
                          ) : (
                            <button className="view-btn" onClick={() => setSelectedAsset(task.asset)}>
                              <span>View Specs</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
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

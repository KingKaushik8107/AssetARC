import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import maintenanceService from '../services/maintenanceService';
import EmptyState from './common/EmptyState';

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const fetchLogs = () => {
    setLoading(true);
    maintenanceService.getLogs()
      .then(data => {
        setLogs(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteLog = async (id, assetTag) => {
    if (!window.confirm(`Are you sure you want to delete maintenance record #${id} for asset ${assetTag}?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await maintenanceService.deleteLog(id);
      setLogs(prev => prev.filter(log => log.id !== id));
    } catch (err) {
      console.error('Failed to delete maintenance log', err);
      alert('Error deleting maintenance log. Please ensure you have appropriate permissions.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalCost = (logs || []).reduce((sum, log) => sum + (Number(log.costIncurred) || 0), 0);
  const canDelete = user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN';

  if (loading && logs.length === 0) return <div className="loading">Generating reports...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Maintenance & Lifecycle Reports</h1>
          <p className="page-subtitle">Audit logs, operational expenses, and historical intervention logs</p>
        </div>
        <div className="report-summary">
          <div className="summary-item">
            <span className="label">Total Maintenance Spend</span>
            <span className="value">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="summary-item">
            <span className="label">Completed Interventions</span>
            <span className="value">{logs.length}</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="card-header-flex">
          <h3>Historical Maintenance Activity Log</h3>
          <button className="secondary-btn" onClick={fetchLogs} title="Refresh Logs">
            ↻ Refresh Logs
          </button>
        </div>

        {logs.length === 0 ? (
          <EmptyState message="No maintenance logs found. Reports will populate as tasks are completed." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Completion Date</th>
                <th>Asset Tag</th>
                <th>Technician</th>
                <th>Work Description</th>
                <th>Cost Incurred</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td><code>#{log.id}</code></td>
                  <td>{log.completionDate ? new Date(log.completionDate).toLocaleString() : 'N/A'}</td>
                  <td><strong className="asset-tag-badge">{log.asset?.assetTag || 'N/A'}</strong></td>
                  <td>
                    <span className="technician-badge">
                      👤 {log.technician?.username || 'Technician'}
                    </span>
                  </td>
                  <td>{log.workDescription}</td>
                  <td><strong>${Number(log.costIncurred || 0).toFixed(2)}</strong></td>
                  {canDelete && (
                    <td>
                      <button
                        className="delete-btn"
                        disabled={deletingId === log.id}
                        onClick={() => handleDeleteLog(log.id, log.asset?.assetTag)}
                        title="Delete Maintenance Log"
                      >
                        {deletingId === log.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;


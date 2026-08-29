import React, { useEffect, useState } from 'react';
import maintenanceService from '../services/maintenanceService';
import EmptyState from './common/EmptyState';

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maintenanceService.getLogs()
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalCost = logs.reduce((sum, log) => sum + log.costIncurred, 0);

  if (loading) return <div className="loading">Generating reports...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Maintenance & Lifecycle Reports</h1>
        <div className="report-summary">
          <div className="summary-item">
            <span className="label">Total Maintenance Spend</span>
            <span className="value">${totalCost.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Interventions</span>
            <span className="value">{logs.length}</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3>Recent Maintenance Activity</h3>
        {logs.length === 0 ? (
          <EmptyState message="No maintenance logs found. Reports will populate as tasks are completed." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Asset</th>
                <th>Technician</th>
                <th>Description</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.completionDate).toLocaleDateString()}</td>
                  <td><strong>{log.asset.assetTag}</strong></td>
                  <td>{log.technician.username}</td>
                  <td>{log.workDescription}</td>
                  <td>${log.costIncurred.toFixed(2)}</td>
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

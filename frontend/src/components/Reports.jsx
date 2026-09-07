import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import maintenanceService from '../services/maintenanceService';
import EmptyState from './common/EmptyState';
import { INDUSTRIAL_IMAGES } from '../services/industrialAssets';

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
  const avgCost = logs.length > 0 ? (totalCost / logs.length) : 0;
  const canDelete = user?.role === 'ASSET_MANAGER' || user?.role === 'SYSTEM_ADMIN';

  const filteredLogs = (logs || []).filter(log => 
    log.asset?.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.technician?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actionTaken?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(log.id).includes(searchTerm)
  );

  if (loading && logs.length === 0) return (
    <div className="page-container reports-page">
      <div className="skeleton-hero-banner shimmer"></div>
      <div className="skeleton-table shimmer"></div>
    </div>
  );

  return (
    <div className="page-container reports-page">
      {/* Enterprise Operational Intelligence Hero Banner */}
      <div 
        className="page-hero-banner industrial-reports-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(7, 11, 20, 0.90) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(7, 11, 20, 0.94) 100%), url(${INDUSTRIAL_IMAGES.REPORTS_HERO})`
        }}
      >
        <div className="hero-banner-overlay" aria-hidden="true"></div>
        <div className="hero-banner-content">
          <div className="hero-badge-pill">
            <span className="pill-dot active"></span>
            <span>ENTERPRISE ANALYTICS • LIFECYCLE AUDIT</span>
          </div>
          <h1 className="hero-title">Operational Intelligence</h1>
          <p className="hero-subtitle">
            Turn equipment telemetry and intervention history into actionable operational insights, financial tracking, and regulatory audit records.
          </p>
          <div className="hero-status-chips">
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">COMPLETED INTERVENTIONS: {logs.length}</span>
            </div>
            <div className="hero-chip">
              <span className="chip-indicator active"></span>
              <span className="chip-text">TOTAL EXPENDITURE: ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Operations KPI Bar */}
      <div className="report-kpi-grid">
        <div className="report-kpi-card industrial-card">
          <span className="kpi-label">TOTAL MAINTENANCE EXPENDITURE</span>
          <span className="kpi-value text-cyan">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="kpi-meta">Cumulative capital expended</span>
        </div>
        <div className="report-kpi-card industrial-card">
          <span className="kpi-label">COMPLETED WORK ORDERS</span>
          <span className="kpi-value text-green">{logs.length}</span>
          <span className="kpi-meta">Fully documented interventions</span>
        </div>
        <div className="report-kpi-card industrial-card">
          <span className="kpi-label">AVERAGE COST / INTERVENTION</span>
          <span className="kpi-value">${avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="kpi-meta">Cost efficiency per ticket</span>
        </div>
      </div>

      {/* Historical Log Table */}
      <div className="table-card industrial-card">
        <div className="card-header-flex">
          <div>
            <h3>Historical Maintenance & Audit Log</h3>
            <p className="section-subtext">Certified lifecycle intervention records and expenditure breakdown</p>
          </div>
          <div className="header-actions-flex">
            <input
              type="text"
              className="search-input table-mini-search"
              placeholder="Filter logs by tag, technician, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="secondary-btn" onClick={fetchLogs} title="Refresh Logs">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <EmptyState 
            title="No Maintenance Records Found"
            message="Logs will populate as maintenance interventions are conducted and finalized." 
          />
        ) : (
          <div className="table-responsive-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Execution Date</th>
                  <th>Target Machinery</th>
                  <th>Certified Technician</th>
                  <th>Action & Scope Summary</th>
                  <th>Cost Incurred</th>
                  {canDelete && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td><span className="code-pill">#{log.id}</span></td>
                    <td>{log.completionDate ? new Date(log.completionDate).toLocaleString() : 'N/A'}</td>
                    <td><strong className="asset-tag-badge">{log.asset?.assetTag || 'N/A'}</strong></td>
                    <td>
                      <div className="technician-cell">
                        <span className="technician-badge">
                          👤 {log.technician?.username || 'Field Tech'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="work-description-cell">
                        {log.actionTaken || 'Preventative servicing completed'}
                      </div>
                    </td>
                    <td>
                      <span className="cost-tag">
                        ${Number(log.costIncurred || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    {canDelete && (
                      <td>
                        <button 
                          className="delete-btn"
                          disabled={deletingId === log.id}
                          onClick={() => handleDeleteLog(log.id, log.asset?.assetTag || '')}
                          title="Purge Record"
                        >
                          {deletingId === log.id ? 'Purging...' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

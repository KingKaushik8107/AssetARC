import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, clearError } from '../store/slices/authSlice';
import ThemeToggle from './common/ThemeToggle';
import { INDUSTRIAL_IMAGES } from '../services/industrialAssets';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'ASSET_MANAGER'
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (isRegister) {
      dispatch(register({
        username: credentials.username,
        password: credentials.password,
        role: credentials.role
      })).then((res) => {
        if (!res.error) {
          setSuccessMessage('Registration successful! Please sign in with your credentials.');
          setIsRegister(false);
          setCredentials(prev => ({ ...prev, password: '' }));
        }
      });
    } else {
      dispatch(login({
        username: credentials.username,
        password: credentials.password
      }));
    }
  };

  return (
    <div className="login-wrapper split-layout">
      {/* LEFT SIDE: Industrial Hero & Telemetry Visual Panel */}
      <div 
        className="login-visual-panel"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(7, 11, 20, 0.88) 0%, rgba(15, 23, 42, 0.76) 50%, rgba(7, 11, 20, 0.94) 100%), url(${INDUSTRIAL_IMAGES.LOGIN_HERO})`
        }}
      >
        <div className="visual-scanline-overlay" aria-hidden="true"></div>
        <div className="visual-grid-overlay" aria-hidden="true"></div>
        
        <div className="visual-content">
          <div className="visual-brand-header">
            <div className="visual-brand-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div>
              <h1 className="visual-brand-title">Asset<span className="brand-highlight">Arc</span></h1>
              <span className="visual-brand-tag">INDUSTRIAL ASSET INTELLIGENCE</span>
            </div>
          </div>

          <div className="visual-hero-body">
            <h2 className="visual-headline">Next-Generation Industrial Asset Lifecycle & Telemetry Engine</h2>
            <p className="visual-tagline">"Monitor. Predict. Maintain. Perform."</p>
            <p className="visual-subtext">
              Real-time SCADA connectivity, machine vibration analysis, AI anomaly thresholds, and automated preventative maintenance scheduling for smart manufacturing operations.
            </p>
          </div>

          <div className="visual-telemetry-cluster">
            <div className="telemetry-pill">
              <span className="pill-dot live"></span>
              <div className="pill-meta">
                <span className="pill-label">SCADA GATEWAY</span>
                <span className="pill-value">Connected (12ms)</span>
              </div>
            </div>
            <div className="telemetry-pill">
              <span className="pill-dot active"></span>
              <div className="pill-meta">
                <span className="pill-label">PREDICTIVE AI</span>
                <span className="pill-value">Active Anomaly Scan</span>
              </div>
            </div>
            <div className="telemetry-pill">
              <span className="pill-dot uptime"></span>
              <div className="pill-meta">
                <span className="pill-label">FLEET UPTIME</span>
                <span className="pill-value">99.98% High Availability</span>
              </div>
            </div>
          </div>
        </div>

        <div className="visual-footer-bar">
          <span>Enterprise Industrial Edition 4.0</span>
          <span>Security Protocol TLS 1.3 / ISO 55000</span>
        </div>
      </div>

      {/* RIGHT SIDE: Glassmorphic Interactive Authentication Panel */}
      <div className="login-form-panel">
        <div className="login-panel-top">
          <div className="login-brand-mobile">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <span>AssetArc</span>
          </div>
          <ThemeToggle showLabel={true} />
        </div>

        <div className="login-card-container">
          <form className="login-form industrial-card" onSubmit={handleSubmit}>
            <div className="login-header">
              <div className="login-badge-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h2>{isRegister ? 'Register Station Account' : 'AssetArc Login'}</h2>
              <p className="login-subtitle">
                {isRegister ? 'Authorize new personnel into the AssetArc monitoring network' : 'Enter enterprise credentials to access equipment telemetry'}
              </p>
            </div>

            <div className="auth-mode-switch">
              <button
                type="button"
                className={`mode-btn ${!isRegister ? 'active' : ''}`}
                onClick={() => {
                  setIsRegister(false);
                  dispatch(clearError());
                  setSuccessMessage('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`mode-btn ${isRegister ? 'active' : ''}`}
                onClick={() => {
                  setIsRegister(true);
                  dispatch(clearError());
                  setSuccessMessage('');
                }}
              >
                Register User
              </button>
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Operator / Username</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Security Access Key / Password</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>
            </div>

            {isRegister && (
              <div className="form-group">
                <label htmlFor="role">Assign Operational Station Role</label>
                <div className="input-with-icon">
                  <svg className="input-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <select
                    id="role"
                    name="role"
                    value={credentials.role}
                    onChange={handleChange}
                    className="role-select"
                  >
                    <option value="ASSET_MANAGER">Asset Manager (Full Equipment Fleet CRUD)</option>
                    <option value="MAINTENANCE_TECHNICIAN">Maintenance Technician (Health & Logs)</option>
                    <option value="OPERATIONS_SUPERVISOR">Operations Supervisor (Dashboard & Specs)</option>
                    <option value="SYSTEM_ADMIN">System Administrator (Complete Control)</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading-content">
                  <span className="btn-spinner"></span>
                  <span>{isRegister ? 'Provisioning Station Access...' : 'Authenticating Operator...'}</span>
                </span>
              ) : (
                <span>{isRegister ? 'Provision Account →' : 'Authorize & Launch Dashboard →'}</span>
              )}
            </button>

            {!isRegister && (
              <div className="demo-accounts-hint">
                <span className="hint-title">Quick Demo Access Profiles</span>
                <div className="demo-tags">
                  <button type="button" className="demo-chip" onClick={() => setCredentials({ ...credentials, username: 'admin', password: 'admin123' })}>
                    <strong>admin</strong> / admin123
                  </button>
                  <button type="button" className="demo-chip" onClick={() => setCredentials({ ...credentials, username: 'tech', password: 'tech123' })}>
                    <strong>tech</strong> / tech123
                  </button>
                  <button type="button" className="demo-chip" onClick={() => setCredentials({ ...credentials, username: 'manager', password: 'manager123' })}>
                    <strong>manager</strong> / manager123
                  </button>
                  <button type="button" className="demo-chip" onClick={() => setCredentials({ ...credentials, username: 'supervisor', password: 'super123' })}>
                    <strong>supervisor</strong> / super123
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

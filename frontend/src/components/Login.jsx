import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, clearError } from '../store/slices/authSlice';
import ThemeToggle from './common/ThemeToggle';

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
          setSuccessMessage('Account registered successfully! Redirecting...');
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
    <div className="login-wrapper">
      <div className="login-header-bar">
        <div className="login-brand-small">
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

      <div className="login-container">
        <div className="login-card-backdrop"></div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-header">
            <div className="login-badge-icon">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h2>{isRegister ? 'Create an Account' : 'Sign in to AssetArc'}</h2>
            <p className="login-subtitle">Industrial Equipment Lifecycle & Condition Monitor</p>
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
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
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
              <label htmlFor="role">Assign System Role</label>
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
                  <option value="ASSET_MANAGER">Asset Manager (Full Asset CRUD)</option>
                  <option value="MAINTENANCE_TECHNICIAN">Maintenance Technician (Health & Logs)</option>
                  <option value="OPERATIONS_SUPERVISOR">Operations Supervisor (Dashboard & Specs)</option>
                  <option value="SYSTEM_ADMIN">System Administrator (Complete Access)</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-content">
                <span className="btn-spinner"></span>

                <span>
                  {isRegister
                    ? 'Creating Account...'
                    : 'Authenticating...'}
                </span>
              </span>
            ) : (
              <span>
                {isRegister
                  ? 'Register & Sign In →'
                  : 'AssetArc Login'}
              </span>
            )}
          </button>

          {!isRegister && (
            <div className="demo-accounts-hint">
              <span className="hint-title">Demo Access</span>
              <div className="demo-tags">
                <code>admin / admin123</code>
                <code>manager / manager123</code>
                <code>tech / tech123</code>
                <code>supervisor / super123</code>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;


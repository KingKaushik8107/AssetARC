import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import AssetList from './components/asset/AssetList';
import MaintenanceScheduler from './components/maintenance/MaintenanceScheduler';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import HealthMonitor from './components/HealthMonitor';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/assets" element={<PrivateRoute><AssetList /></PrivateRoute>} />
              <Route path="/maintenance" element={<PrivateRoute><MaintenanceScheduler /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/health" element={<PrivateRoute><HealthMonitor /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Summary from "./components/Summary.js";
import CreateAlertForm from "./components/CreateAlertForm.js";
import EscalatedAlerts from "./components/EscalatedAlerts.js";
import RecentAlerts from "./components/RecentAlerts.js";
import TopDrivers from "./components/TopDrivers.js";
import "./styles.css";

const BASE_URL = "http://localhost:5000/api/v1";

function App() {
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    escalatedAlerts: [],
    recentAlerts: [],
    topDrivers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`);
      if (res.data && res.data.data) {
        setDashboardData(res.data.data);
      }
      setError(null);
    } catch (err) {
      setError("Unable to load dashboard data. Ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (alertPayload) => {
    try {
      await axios.post(`${BASE_URL}/alerts`, alertPayload);
      await loadDashboard();
    } catch (err) {
      alert("Failed to create alert: " + (err.response?.data?.message || err.message));
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await axios.patch(`${BASE_URL}/alerts/${alertId}/resolve`);
      await loadDashboard();
    } catch (err) {
      alert("Failed to resolve alert: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="dashboard" style={{ textAlign: "center", paddingTop: "50px" }}>
        <h2>Loading Intelligent Alert Escalation System...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard" style={{ textAlign: "center", paddingTop: "50px", color: "#e53e3e" }}>
        <h2>System Error</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadDashboard}>Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h1 className="title">Intelligent Alert Escalation System</h1>
          <div className="subtitle">Real-time driver event monitoring, severity evaluation, and threshold escalation</div>
        </div>
        <button className="btn btn-primary" onClick={loadDashboard}>🔄 Refresh</button>
      </div>

      <Summary metrics={dashboardData.metrics} />

      <CreateAlertForm onCreateAlert={handleCreateAlert} />

      <EscalatedAlerts
        alerts={dashboardData.escalatedAlerts}
        onResolve={handleResolveAlert}
      />

      <RecentAlerts
        alerts={dashboardData.recentAlerts}
        onResolve={handleResolveAlert}
      />

      <TopDrivers data={dashboardData.topDrivers} />
    </div>
  );
}

export default App;
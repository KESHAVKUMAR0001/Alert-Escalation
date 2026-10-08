import React from "react";

const RecentAlerts = ({ alerts = [], onResolve }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card">
        <h3>Recent Alerts Stream</h3>
        <p style={{ color: "#718096", margin: 0 }}>No recent alerts found.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Recent Alerts Stream</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Event Type</th>
            <th>Message</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert._id || alert.alertId}>
              <td><strong>{alert.driverId}</strong></td>
              <td>{alert.sourceType}</td>
              <td>{alert.message}</td>
              <td>
                <span className={`badge ${alert.severity}`}>{alert.severity}</span>
              </td>
              <td>
                <span className={`badge ${alert.status}`}>{alert.status}</span>
              </td>
              <td>{new Date(alert.createdAt).toLocaleTimeString()}</td>
              <td>
                {alert.status !== "RESOLVED" ? (
                  <button
                    className="btn btn-success"
                    onClick={() => onResolve(alert.alertId)}
                  >
                    Resolve
                  </button>
                ) : (
                  <span style={{ color: "#38a169", fontSize: "13px", fontWeight: "600" }}>✓ Resolved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentAlerts;

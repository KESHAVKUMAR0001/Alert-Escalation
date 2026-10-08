import React from "react";

const EscalatedAlerts = ({ alerts = [], onResolve }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card">
        <h3>Active Escalated Alerts</h3>
        <p style={{ color: "#718096", margin: 0 }}>No active escalated alerts requiring immediate escalation attention.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ color: "#e53e3e" }}>🚨 Active Escalated Alerts</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Driver</th>
            <th>Event Type</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Escalation Reason</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert._id || alert.alertId}>
              <td>
                <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
                  {alert.alertId.substring(0, 8)}...
                </span>
              </td>
              <td><strong>{alert.driverId}</strong></td>
              <td>{alert.sourceType}</td>
              <td>
                <span className="badge ESCALATED">ESCALATED</span>
              </td>
              <td>
                <span className="badge CRITICAL">CRITICAL</span>
              </td>
              <td>
                <div className="escalation-box">{alert.escalationReason || "Threshold breach"}</div>
              </td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => onResolve(alert.alertId)}
                >
                  Resolve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EscalatedAlerts;

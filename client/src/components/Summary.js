import React from "react";

const Summary = ({ metrics = {} }) => {
  const items = [
    { key: "total", label: "Total Alerts", value: metrics.total || 0 },
    { key: "open", label: "Open Alerts", value: metrics.open || 0 },
    { key: "warning", label: "Warning Alerts", value: metrics.warning || 0 },
    { key: "critical", label: "Critical Alerts", value: metrics.critical || 0 },
    { key: "resolved", label: "Resolved Alerts", value: metrics.resolved || 0 },
  ];

  return (
    <div className="card">
      <h3>System Alert Metrics</h3>
      <div className="summary-grid">
        {items.map((item) => (
          <div key={item.key} className={`summary-item ${item.key}`}>
            <div className="label">{item.label}</div>
            <div className="count">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
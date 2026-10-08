import React from "react";

const TopDrivers = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>Top Offenders by Alert Count</h3>
        <p style={{ color: "#718096", margin: 0 }}>No driver alert data recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Top Offenders by Alert Count</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Driver ID</th>
            <th>Total Alerts Logged</th>
          </tr>
        </thead>
        <tbody>
          {data.map((driver, index) => (
            <tr key={index}>
              <td><strong>{driver._id}</strong></td>
              <td>{driver.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopDrivers;
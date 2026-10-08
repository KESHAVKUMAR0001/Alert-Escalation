import React, { useState } from "react";

const CreateAlertForm = ({ onCreateAlert }) => {
  const [driverId, setDriverId] = useState("D-101");
  const [sourceType, setSourceType] = useState("overspeed");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverId || !sourceType) return;

    setSubmitting(true);
    await onCreateAlert({ driverId, sourceType, message });
    setMessage("");
    setSubmitting(false);
  };

  return (
    <div className="card">
      <h3>Simulate / Trigger Alert Event</h3>
      <form onSubmit={handleSubmit} className="form-group">
        <select
          className="form-control"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        >
          <option value="D-101">Driver D-101</option>
          <option value="D-102">Driver D-102</option>
          <option value="D-103">Driver D-103</option>
        </select>

        <select
          className="form-control"
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
        >
          <option value="overspeed">Overspeed (INFO → Escalate at 3)</option>
          <option value="feedback_negative">Feedback Negative (WARNING → Escalate at 2)</option>
          <option value="compliance">Compliance (Immediate CRITICAL)</option>
        </select>

        <input
          type="text"
          className="form-control"
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="Optional note / custom message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Triggering..." : "Trigger Alert"}
        </button>
      </form>
    </div>
  );
};

export default CreateAlertForm;

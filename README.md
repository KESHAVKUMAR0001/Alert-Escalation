# Intelligent Alert Escalation and Resolution System

## Overview
A rule-driven alert lifecycle management backend built with Node.js, Express, MongoDB, and Redis. It processes operational events, evaluates escalation thresholds, manages state transitions, and supports dashboard analytics.

## Tech Stack
- Backend: Node.js (ES Modules), Express.js, MongoDB (Mongoose), Redis, node-cron
- Frontend: React, Chart.js, Axios
- Logging & Utilities: Winston logger, UUID

## Alert State Machine
Alerts transition through defined lifecycle states:
- OPEN: Initial state on alert creation.
- ESCALATED: Promoted state when threshold rules are breached.
- RESOLVED: Terminal state when manually resolved by an analyst.
- AUTO_CLOSED: Closed automatically by background compliance or expiry jobs.

## Escalation Rules
Rules are configured in `src/config/rules.json`:
- Overspeed: Escalates if count reaches 3 within 60 minutes.
- Negative Feedback: Escalates if count reaches 2 within 24 hours.
- Compliance: Validates document status and auto-closes on compliance.

## API Endpoints

### Alert Endpoints
- POST /api/v1/alerts - Create a new alert
- GET /api/v1/alerts/:alertId - Fetch alert by ID
- PATCH /api/v1/alerts/:alertId/resolve - Resolve an alert

### Dashboard Endpoints
- GET /api/v1/dashboard/summary - Severity distribution summary
- GET /api/v1/dashboard/top-drivers - Drivers with highest alert counts
- GET /api/v1/dashboard/trends - Alert trend analytics
- GET /api/v1/dashboard/recent-auto-closed - Recent auto-closed alerts
- GET /api/v1/dashboard/rules - Active rule configurations

## Setup and Installation

1. Clone the repository and navigate to project root:
   cd Alert-Escalation

2. Create a `.env` file with environment variables:
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/alert-db
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379

3. Install dependencies and start dev server:
   npm install && npm run dev

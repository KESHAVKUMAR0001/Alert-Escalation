import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  createAlertService,
  getAlertsService,
  getAlertByIdService,
  resolveAlertService,
} from "../services/alertService.js";

const createAlert = asyncHandler(async (req, res) => {
  const alert = await createAlertService(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, alert, "Alert created successfully"));
});

const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await getAlertsService();
  return res
    .status(200)
    .json(new ApiResponse(200, alerts, "Alerts retrieved successfully"));
});

const getAlert = asyncHandler(async (req, res) => {
  const alert = await getAlertByIdService(req.params.alertId);
  return res
    .status(200)
    .json(new ApiResponse(200, alert, "Alert details retrieved successfully"));
});

const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await resolveAlertService(req.params.alertId);
  return res
    .status(200)
    .json(new ApiResponse(200, alert, "Alert resolved successfully"));
});

export { createAlert, getAlerts, getAlert, resolveAlert };
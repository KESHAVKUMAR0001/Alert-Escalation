import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getDashboardData } from "../services/dashboardService.js";

const getDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardData();
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Dashboard data retrieved successfully"));
});

export { getDashboard };
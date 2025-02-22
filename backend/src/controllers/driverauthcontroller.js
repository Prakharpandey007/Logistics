import {
  driverSignup,
  driverLogin,
  getCachedDriverLogin,
  getDriverProfile,
  logoutDriver
} from "../services/driverauthservice.js";


export const driverLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await driverLogin(email, password);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        token: result.token,
        role: "driver",
        driver: {
          ...result.driver,
          isDriverDetailsFilled: result.isDriverDetailsFilled,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong in driver login.",
      data: {},
      err: error,
    });
  }
};

export const driverSignupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await driverSignup(name, email, password);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        token: result.token,
        driver: result.driver,
        isDriverDetailsFilled: result.isDriverDetailsFilled,
      },
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong in driver signup.",
      data: {},
      err: error,
    });
  }
};

// Get Cached Driver Login Controller
export const getCachedDriverLoginController = async (req, res) => {
  try {
    const { driverId } = req.params;
    const result = await getCachedDriverLogin(driverId);

    return res.status(200).json({
      success: true,
      message: "Cached session retrieved successfully.",
      data: result,
      err: {},
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.message || "Session expired or not found. Please log in again.",
      data: {},
      err: error,
    });
  }
};


export const getDriverProfileController = async (req, res) => {
  try {
    const driverId = req.params.driverIdId || req.query.driverId;
    if (!driverId) {
      return res.status(400).json({ success: false, message: "Driver ID is required." });
    }
    const result = await getDriverProfile(driverId);
    return res.status(200).json({
      success: true,
      message: "Driver profile retrieved successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error retrieving driver profile.",
      err: error,
    });
  }
};

/**
 * Controller for logging out a driver.
 * Expects the driver ID as a URL parameter.
 */
export const logoutDriverController = async (req, res) => {
  try {
    const driverId = req.query.driverId || req.params.driverId;
if (!driverId) {
    return res.status(400).json({ success: false, message: "Driver ID is required." });
}

    const result = await logoutDriver(driverId);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error logging out driver.",
      err: error,
    });
  }
};

import {
  driverSignup,
  driverLogin,
  getCachedDriverLogin,
} from "../services/driverauthservice.js";

// // Driver Signup Controller
// export const driverSignupController = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const result = await driverSignup(name, email, password);

//     return res.status(201).json({
//       success: true,
//       message: result.message,
//       data: result,
//       err: {},
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong in driver signup.",
//       data: {},
//       err: error,
//     });
//   }
// };

// // Driver Login Controller
// export const driverLoginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const { token, driver, message, isDriverDetailsFilled } = await driverLogin(
//       email,
//       password
//     );

//     return res.status(200).json({
//       success: true,
//       message,
//       data: {
//         token,
//         role: "driver",
//         driver: {
//           ...driver.toObject(),
//           isDriverDetailsFilled,
//         },
//       },
//     });
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: error.message || "Something went wrong in driver login.",
//       data: {},
//       err: error,
//     });
//   }
// };

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

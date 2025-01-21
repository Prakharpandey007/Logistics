import { signup, login, GetCachedLogin } from "../services/authService.js";

// Signup
export const signupController = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    const result = await signup(name, email, password, role);
    return res.status(200).json({
      success: true,
      message: "User successfully registered",
      data: result,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in signup fn in auth-controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

// Login
export const loginController = async (req, res) => {
  try {
    const { email, password,role } = req.body;
    // const { email, password } = req.body;
    const {token,role:userRole,user} = await login(email, password,role);
    if (userRole === "driver" && !user.isDriverDetailsFilled) {
      return res.status(200).json({
        success: true,
        message: "Driver must fill details",
        data: {
          token,
          role,
          user: { ...user, isDriverDetailsFilled: false }
        }
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {token,role,user},
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in login fn in auth-controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

// Cached login
export const cachedlogin = async (req, res) => { // Updated function name
  try {
    const { userId } = req.params;
    const cachedLogin = await GetCachedLogin(userId);
    if (cachedLogin) {
      return res.status(200).json({
        success: true,
        message: "Successfully logged in using cached token",
        data: cachedLogin,
        err: {},
      });
    } else {
      return res.status(404).json({ message: "No cached login found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in cached login fn in auth-controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

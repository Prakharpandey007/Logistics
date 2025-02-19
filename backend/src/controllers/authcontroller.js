
import { signup, login, GetCachedLogin } from "../services/authService.js";


export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false,
           message: "All fields are required" 
          });
    }

    const result = await signup(name, email, password);
    return res.status(201).json({ 
      success: true, 
      ...result
     });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: error.message
     });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ 
          success: false, 
          message: "Email and password are required"
         });
    }

    const result = await login(email, password);
    return res.status(200).json({ 
      success: true,
       ...result
       });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(401).json({
       success: false, message: error.message 
      });
  }
};

export const getCachedLoginController = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ 
          success: false, 
          message: "User ID is required" 
        });
    }

    const result = await GetCachedLogin(userId);
    if (result) {
      return res.status(200).json({
         success: true, ...result 
        });
    } else {
      return res
        .status(404)
        .json({ 
          success: false, message: "No cached session found"
         });
    }
  } catch (error) {
    console.error("Error fetching cached login:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

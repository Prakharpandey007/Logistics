
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";
import Driver from "../models/drivermodel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_EXPIRY = 86400; // 24 hours

const generateToken = (driverId) => {
  return jwt.sign({ id: driverId, role: "driver" }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

const storeSessionToken = async (driverId, token) => {
  await redisClient.set(`session:${driverId}`, token, { EX: SESSION_EXPIRY });
};

export const driverSignup = async (name, email, password) => {
  try {
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      throw new Error("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = new Driver({
      name,
      email,
      password: hashedPassword,
      isDriverDetailsFilled: false,
      status: "inactive"
    });

    await driver.save();

    const token = generateToken(driver._id);
    await storeSessionToken(driver._id, token);

    // Convert to plain object and remove password
    const driverResponse = driver.toObject();
    delete driverResponse.password;

    return { 
      message: "Driver registered successfully. Please complete your profile.", 
      driver: driverResponse, 
      token,
      isDriverDetailsFilled: false
    };
  } catch (error) {
    throw new Error(`Driver signup failed: ${error.message}`);
  }
};

export const driverLogin = async (email, password) => {
  try {
    const driver = await Driver.findOne({ email });
    if (!driver) {
      throw new Error("No driver found.");
    }

    const isPasswordValid = await bcrypt.compare(password, driver.password);
    if (!isPasswordValid) {
      throw new Error("Password is incorrect.");
    }

    let token = await redisClient.get(`session:${driver._id}`);
    if (!token) {
      token = generateToken(driver._id);
      await storeSessionToken(driver._id, token);
    }

    // Convert to plain object and remove password
    const driverResponse = driver.toObject();
    delete driverResponse.password;

    return {
      token,
      driver: driverResponse,
      message: driver.isDriverDetailsFilled
        ? "Login successful"
        : "Please complete your profile details",
      isDriverDetailsFilled: driver.isDriverDetailsFilled
    };
  } catch (error) {
    throw new Error(`Driver login failed: ${error.message}`);
  }
};


export const getCachedDriverLogin = async (driverId) => {
  try {
    const cachedToken = await redisClient.get(`session:${driverId}`);
    if (!cachedToken) {
      throw new Error("No cached session found. Please log in again.");
    }

    // Verify if the token is still valid
    const decoded = jwt.verify(cachedToken, JWT_SECRET);
    if (!decoded) {
      await redisClient.del(`session:${driverId}`);
      throw new Error("Session expired. Please log in again.");
    }

    return { token: cachedToken };
  } catch (error) {
    throw new Error(`Failed to retrieve cached login: ${error.message}`);
  }
};

export const getDriverProfile = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId).select("-password");
    if (!driver) {
      throw new Error("Driver not found.");
    }
    return { driver };
  } catch (error) {
    throw new Error(`Error retrieving driver profile: ${error.message}`);
  }
};

/**
 * Logs out a driver by deleting the session token from Redis.
 */
export const logoutDriver = async (driverId) => {
  try {
    await redisClient.del(`session:${driverId}`);
    return { message: "Driver logged out successfully." };
  } catch (error) {
    throw new Error(`Error logging out driver: ${error.message}`);
  }
};
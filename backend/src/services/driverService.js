import Driverdetails from "../models/driverDetails.js";
import Driver from "../models/drivermodel.js";
import axios from "axios";
import dotenv from "dotenv";
import redisClient from "../config/redis.js";
dotenv.config();

const otpStore = new Map(); // store OTP locally

export const sendOtp = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in Redis with a 20-minute expiration
  await redisClient.setEx(phoneNumber, 1200, otp);

  const fast2smsUrl = process.env.FAST2SMS_URL;
  const apiKey = process.env.FAST2SMS_API_KEY;

  const payload = {
    variables_values: otp,
    route: "otp",
    numbers: phoneNumber,
  };

  const headers = {
    authorization: apiKey,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await axios.post(fast2smsUrl, new URLSearchParams(payload), { headers });

    if (response.data.return === true) {
      return {
        requestId: response.data.request_id,
        message: response.data.message,
      };
    } else {
      throw new Error("Failed to send OTP. Service returned an error.");
    }
  } catch (error) {
    console.error("Error in sendOtp:", error);
    throw new Error("Failed to send OTP on your mobile number.");
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
  const storedOtp = await redisClient.get(phoneNumber);

  console.log(`Stored OTP for ${phoneNumber}:`, storedOtp);
  console.log(`Received OTP for ${phoneNumber}:`, otp);

  if (storedOtp && storedOtp === otp) {
    // Set verified status in Redis for 20 minutes
    await redisClient.setEx(`${phoneNumber}:verified`, 1200, "true");
    await redisClient.del(phoneNumber); // Remove OTP after successful verification
    return true;
  }
  console.log(`OTP verification failed for ${phoneNumber}`);
  return false;
};

export const isOtpVerified = async (phoneNumber) => {
  const verificationStatus = await redisClient.get(`${phoneNumber}:verified`);
  return verificationStatus === "true";
};

// export const fillDriverDetails = async (userId, details) => {
//   const driverDetails = new Driverdetails({ userId, ...details });
//   await driverDetails.save();

//   // Update the User to know that driver details are filled
//   await User.findByIdAndUpdate(userId, { isDriverDetailsFilled: true });
//   return driverDetails;
// };
export const fillDriverDetails = async (userId, details) => {
  try {
    // Check if details already exist
    const existingDetails = await Driverdetails.findOne({ userId });
    if (existingDetails) {
      throw new Error("Driver details already exist");
    }

    // Start a session for transaction
    const session = await Driverdetails.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Create driver details
        const driverDetails = new Driverdetails({ 
          userId, 
          ...details 
        });
        await driverDetails.save({ session });

        // Update driver status and details flag
        await Driver.findByIdAndUpdate(
          userId,
          { 
            isDriverDetailsFilled: true,
            status: "active"
          },
          { session }
        );
      });

      await session.endSession();

      return {
        success: true,
        message: "Driver details saved successfully",
        isProfileComplete: true
      };
    } catch (error) {
      await session.endSession();
      throw error;
    }
  } catch (error) {
    throw new Error(`Failed to save driver details: ${error.message}`);
  }
};

export const getDriverDetails = async (userId) => {
  try {
    const driverDetails = await Driverdetails.findOne({ userId });
    const driver = await Driver.findById(userId).select('-password');

    if (!driver) {
      throw new Error("Driver not found");
    }

    return {
      success: true,
      data: {
        driver,
        details: driverDetails,
        isProfileComplete: driver.isDriverDetailsFilled,
        status: driver.status
      }
    };
  } catch (error) {
    throw new Error(`Failed to get driver details: ${error.message}`);
  }
};

import Driverdetails from "../models/driverDetails.js";
import User from "../models/user.js";
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

export const fillDriverDetails = async (userId, details) => {
  const driverDetails = new Driverdetails({ userId, ...details });
  await driverDetails.save();

  // Update the User to know that driver details are filled
  await User.findByIdAndUpdate(userId, { isDriverDetailsFilled: true });
  return driverDetails;
};

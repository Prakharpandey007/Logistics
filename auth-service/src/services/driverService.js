import Driverdetails from "../models/driverDetails.js";
import User from "../models/user.js";
import axios from "axios";
import dotenv from "dotenv";
import redisClient from "../config/redis.js";
dotenv.config();
const otpStore = new Map(); // store otp locally

export const sendOtp = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
   // Store OTP in Redis with a 5-minute expiration
   await redisClient.setEx(phoneNumber, 600, otp);

  const fast2smsUrl = process.env.FAST2SMS_URL;
  const apiKey = process.env.FAST2SMS_API_KEY;
  const payload = {
    route: "q",
    message: `Your OTP for mobile verification is ${otp}`,
    language: "english",
    numbers: phoneNumber,
  };

  const headers = {
    authorization: apiKey,
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.post(fast2smsUrl, payload, { headers });
    return response.data;
  } catch (error) {
    throw new Error("Failed to send otp on your mobile number");
  }
};
export const verifyOtp = async (phoneNumber, otp) => {

  const storedOtp = await redisClient.get(phoneNumber);
  console.log(`Stored OTP for ${phoneNumber}:`, otpStore.get(phoneNumber));
  console.log(`Received OTP for ${phoneNumber}:`, otp);

  if (storedOtp && storedOtp === otp) {
      // Set verified status in Redis for 10 minutes
      await redisClient.setEx(`${phoneNumber}:verified`, 600, "true");
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

  // update the User to know that driver details is filled
  await User.findByIdAndUpdate(userId, { isDriverDetailsFilled: true });
  return fillDriverDetails;
};

import { isAxiosError } from "axios";
import { fillDriverDetails,sendOtp,verifyOtp,isOtpVerified } from "../services/driverService.js"

export const sendOtpController=async(req,res)=>{
  try {
    const {driverPhoneNumber}=req.body;
    if(!driverPhoneNumber){
      return res.status(400).json({
        success:false,
        message:"Phone number is required",
        data:{},
        err:{},

      });
    }
    const response=await sendOtp(driverPhoneNumber);
    return res.status(200).json({
      success:true,
      message:"Otp send successfully to your Mobile number",
      data:response,
      err:{},
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong in sendOtpController",
      success: false,
      err: error,
    });
  }
}
export const verifyOtpContrller=async(req,res)=>{
  try {
    const {driverPhoneNumber,otp}=req.body;
    if(!driverPhoneNumber||!otp){
      return res.status(400).json({
        success:false,
        message:"Phone number and otp is required",
        data:{},
        err:{},

      });
    }
    const isverified=await verifyOtp(driverPhoneNumber,otp);
    if(!isverified){
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        data: {},
        err: {},
      });
    }
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {},
      err: {},
    });
  } catch (error) {
    onsole.error(error);
    return res.status(500).json({
      message: "Something went wrong in verifyOtpController",
      success: false,
      err: error,
    });
  }
}

export const fillDriverDetailsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const details = req.body;
    const driverPhoneNumber = details.driverPhoneNumber;

    console.log("Phone number:", driverPhoneNumber);

    // Check if OTP is verified for this phone number
    const isVerified = await isOtpVerified(driverPhoneNumber);
    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP verification failed. Cannot submit driver details.",
        data: {},
        err: {},
      });
    }

    const driverDetails = await fillDriverDetails(userId, details);
    return res.status(200).json({
      success: true,
      message: "Driver details registered successfully",
      data: driverDetails,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in fillDriverDetailsController",
      data: {},
      success: false,
      err: error,
    });
  }
};
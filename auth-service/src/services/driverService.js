import Driverdetails from "../models/driverDetails.js";
import User from '../models/user.js';
export const fillDriverDetails=async(userId,details)=>{
    const driverDetails= new Driverdetails({userId,...details});
    await driverDetails.save();

    // update the User to know that driver details is filled 
    await User.findByIdAndUpdate(userId,{isDriverDetailsFilled:true});
    return fillDriverDetails;

}

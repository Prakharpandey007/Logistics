import { fillDriverDetails } from "../services/driverService.js"

export const fillDriverDetailsController =async(req,res)=>{
    try {
        const userId=req.user.id
        const details =req.body 
        const driverDetails= await fillDriverDetails(userId,details);
        return res.status(200).json({
            success: true,
            message: "Driver details registered sucessfully",
            data: driverDetails,
            err: {},
          });

    } catch (error) {
        console.log(error);
    return res.status(500).json({
      message: "Something went wrong in driver fn in driver-controller",
      data: {},
      success: false,
      err: error,
    });
    }
}
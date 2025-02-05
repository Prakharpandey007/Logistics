import {
  createBooking,
  confirmBooking,
  startBooking,
  endBooking,
} from "../services/bookingservice.js";

export const createRide = async (req, res) => {
  try {
    const { pickup, destination, vehicleType } = req.body;
    const userId = req.user.id;
    if (!pickup || !destination || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
        data: {},
        err: {},
      });
    }
    const booking = await createBooking(
      userId,
      pickup,
      destination,
      vehicleType
    );

    return res.status(200).json({
      success: true,
      message: "Booking is successfull",
      data: booking,
      err: {},
    });
  } catch (error) {
    console.error("Error in createRide controller :", error);
    return res.status(500).json({
      message: "Something went wrong in createride controller",
      success: false,
      err: error,
    });
  }
};

export const confirmRide = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;
    if (!bookingId || !driverId) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
        data: {},
        err: {},
      });
    }
    const booking = await confirmBooking(bookingId, driverId);
    return res.status(200).json({
      success: true,
      message: "Confirm Booking is successfull",
      data: booking,
      err: {},
    });
  } catch (error) {
    console.error("Error in confirmRide controller :", error);
    return res.status(500).json({
      message: "Something went wrong in ConfirmRide controller",
      success: false,
      err: error,
    });
  }
};

export const startRide = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId ) {
        return res.status(400).json({
          success: false,
          message: "All feilds are required",
          data: {},
          err: {},
        });
      }
      const booking=await startBooking(bookingId);
      return res.status(200).json({
        success: true,
        message: "Star Booking is successfull",
        data: booking,
        err: {},
      });

  } catch (error) {
    console.error("Error in startRide controller :", error);
    return res.status(500).json({
      message: "Something went wrong in StartRide controller",
      success: false,
      err: error,
    });
  }
};

export const endRide=async(req,res)=>{
    try {
        const { bookingId } = req.body;
        if (!bookingId ) {
            return res.status(400).json({
              success: false,
              message: "All feilds are required",
              data: {},
              err: {},
            });
          }
          const booking = await endBooking(bookingId);
          return res.status(200).json({
            success: true,
            message: "Ride end is successfull",
            data: booking,
            err: {},
          });

    } catch (error) {
        console.error("Error in EndRide controller :", error);
    return res.status(500).json({
      message: "Something went wrong in EndRide controller",
      success: false,
      err: error,
    });
    }
}

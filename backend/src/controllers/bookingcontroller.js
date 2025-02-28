import {
    createBooking,
    confirmBooking,
    startBooking,
    endBooking,
    getFare
} from "../services/bookingservice.js";

export const createRide = async (req, res) => {
    try {
        const { pickup, destination, vehicleType } = req.body;
        const userId = req.user?.id;
        
        if (!userId || !pickup || !destination || !vehicleType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: {},
                err: {},
            });
        }
        
        const booking = await createBooking(userId, pickup, destination, vehicleType);
        return res.status(200).json({
            success: true,
            message: "Booking is successful",
            data: booking,
            err: {},
        });
    } catch (error) {
        console.error("Error in createRide controller:", error);
        return res.status(500).json({
            message: "Something went wrong in createRide controller",
            success: false,
            err: error.message,
        });
    }
};

export const confirmRide = async (req, res) => {
    try {
        const { bookingId, driverId } = req.body;
        if (!bookingId || !driverId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: {},
                err: {},
            });
        }
        const booking = await confirmBooking(bookingId, driverId);
        return res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: booking,
            err: {},
        });
    } catch (error) {
        console.error("Error in confirmRide controller:", error);
        return res.status(500).json({
            message: "Something went wrong in confirmRide controller",
            success: false,
            err: error.message,
        });
    }
};

export const startRide = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
                data: {},
                err: {},
            });
        }
        const booking = await startBooking(bookingId);
        return res.status(200).json({
            success: true,
            message: "Ride started successfully",
            data: booking,
            err: {},
        });
    } catch (error) {
        console.error("Error in startRide controller:", error);
        return res.status(500).json({
            message: "Something went wrong in startRide controller",
            success: false,
            err: error.message,
        });
    }
};

export const endRide = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
                data: {},
                err: {},
            });
        }
        const booking = await endBooking(bookingId);
        return res.status(200).json({
            success: true,
            message: "Ride ended successfully",
            data: booking,
            err: {},
        });
    } catch (error) {
        console.error("Error in endRide controller:", error);
        return res.status(500).json({
            message: "Something went wrong in endRide controller",
            success: false,
            err: error.message,
        });
    }
};

export const getFareController = async (req, res) => {
    try {
        const { pickup, destination, vehicleType } = req.body;
        if (!pickup || !destination || !vehicleType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: {},
                err: {},
            });
        }
        const fare = await getFare(pickup, destination, vehicleType);
        return res.status(200).json({
            success: true,
            message: "Fare calculated successfully",
            data: { fare },
            err: {},
        });
    } catch (error) {
        console.error("Error in getFareController:", error);
        return res.status(500).json({
            message: "Something went wrong in getFareController",
            success: false,
            err: error.message,
        });
    }
};

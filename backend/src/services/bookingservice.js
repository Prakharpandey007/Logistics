import Booking from "../models/bookingmodel.js";
import {
  getCoordinates,
  getDistanceTime,
} from "../services/mapservice.js";

const baseFare = { Pickupvans: 50, MiniTrucks: 30 };
const perKmRate = { Pickupvans: 10, MiniTrucks: 5 };
const perMinuteRate = { Pickupvans: 2, MiniTrucks: 1 };

export const getFare = async (pickupAddress, destinationAddress, vehicleType) => {
    try {
        console.log(`Fetching coordinates for: ${pickupAddress} → ${destinationAddress}`);

        const pickupELOC = await getCoordinates(pickupAddress);
        const destinationELOC = await getCoordinates(destinationAddress);

        console.log(`Pickup eLoc: ${pickupELOC}`);
        console.log(`Destination eLoc: ${destinationELOC}`);

        const distanceTime = await getDistanceTime(pickupELOC, destinationELOC);

        console.log(`Distance & Time: ${JSON.stringify(distanceTime)}`);

        if (!baseFare[vehicleType] || !perKmRate[vehicleType] || !perMinuteRate[vehicleType]) {
            throw new Error("Invalid vehicle type or missing fare details");
        }

        return Math.round(
            baseFare[vehicleType] +
            (distanceTime.distance / 1000) * perKmRate[vehicleType] +
            (distanceTime.duration / 60) * perMinuteRate[vehicleType]
        );
    } catch (error) {
        console.error("Error in getFare:", error.message);
        throw new Error("Failed to calculate fare");
    }
};

export const createBooking = async (userId, pickup, destination, vehicleType) => {
    try {
        if (!userId || !pickup || !destination || !vehicleType) {
            throw new Error("All fields are required");
        }
        
        const fare = await getFare(pickup, destination, vehicleType);
        const booking = await Booking.create({
            user: userId,
            pickup,
            destination,
            fare,
            status: "pending",
        });

        return booking;
    } catch (error) {
        console.error("Booking creation failed:", error.message);
        throw new Error("Failed to create booking");
    }
};


export const confirmBooking = async (bookingId, driverId) => {
  try {
    if (!bookingId || !driverId) {
      throw new Error("All fields are required");
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { captain: driverId, status: "accepted" },
      { new: true }
    );

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  } catch (error) {
    console.error("Error confirming booking:", error);
    throw new Error("Failed to confirm booking");
  }
};

export const startBooking = async (bookingId) => {
  try {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.status !== "accepted") {
      throw new Error("Booking is not accepted yet");
    }

    booking.status = "ongoing";
    await booking.save();

    return booking;
  } catch (error) {
    console.error("Error starting ride:", error);
    throw new Error("Failed to start ride");
  }
};

export const endBooking = async (bookingId) => {
  try {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.status !== "ongoing") {
      throw new Error("Booking is not ongoing");
    }

    booking.status = "completed";
    await booking.save();

    return booking;
  } catch (error) {
    console.error("Error ending ride:", error);
    throw new Error("Failed to end ride");
  }
};



import Booking from "../models/bookingmodel.js";
import {
  getCoordinates,
  getDistanceTime,
  getCaptainsInTheRadius
} from "../services/mapservice.js";
import { sendMessageToSocketId } from "../../socket.js";

const baseFare = { Pickupvans: 50, MiniTrucks: 30, Trucks: 80, ContainerTrucks: 120 };
const perKmRate = { Pickupvans: 10, MiniTrucks: 20, Trucks: 40, ContainerTrucks: 60 };
const perMinuteRate = { Pickupvans: 4, MiniTrucks: 8, Trucks: 15, ContainerTrucks: 20 };

export const getFare = async (pickupAddress, destinationAddress, vehicleType) => {
  try {
      console.log(`Fetching coordinates for: ${pickupAddress} → ${destinationAddress}`);

      const pickupELOC = await getCoordinates(pickupAddress);
      const destinationELOC = await getCoordinates(destinationAddress);

      console.log(`Pickup eLoc: ${JSON.stringify(pickupELOC)}`); // Changed to properly stringify
      console.log(`Destination eLoc: ${JSON.stringify(destinationELOC)}`);

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
          vehicleType, // Added missing vehicleType
          fare,
          status: "pending",
      });

      // Get pickup coordinates
      const pickupCoordinates = await getCoordinates(pickup);
      
      // Ensure coordinates are valid numbers before searching for captains
      if (!pickupCoordinates.lat || !pickupCoordinates.lng) {
          throw new Error("Invalid pickup coordinates");
      }

      // Convert string coordinates to numbers
      const latitude = parseFloat(pickupCoordinates.lat);
      const longitude = parseFloat(pickupCoordinates.lng);

      // Search for captains with numeric coordinates
      const captainsInRadius = await getCaptainsInTheRadius(
          latitude,
          longitude,
          2 // 2km radius
      );

      const bookingWithUser = await Booking.findOne({ _id: booking._id }).populate("user");

      // Only notify if we found captains and they have socketIds
      if (captainsInRadius && captainsInRadius.length > 0) {
          captainsInRadius.forEach((captain) => {
              if (captain.socketId) {
                  sendMessageToSocketId(captain.socketId, {
                      event: "new-booking",
                      data: bookingWithUser,
                  });
              }
          });
      }

      return booking;
  } catch (error) {
      console.error("Booking creation failed:", error.message);
      throw new Error("Failed to create booking: " + error.message);
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
      ).populate("user");

      if (!booking) {
          throw new Error("Booking not found");
      }

      if (booking.user && booking.user.socketId) {
          sendMessageToSocketId(booking.user.socketId, {
              event: "booking-confirmed",
              data: booking,
          });
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

      const booking = await Booking.findById(bookingId).populate("user");
      if (!booking) {
          throw new Error("Booking not found");
      }
      if (booking.status !== "accepted") {
          throw new Error("Booking is not accepted yet");
      }

      booking.status = "ongoing";
      await booking.save();

      if (booking.user && booking.user.socketId) {
          sendMessageToSocketId(booking.user.socketId, {
              event: "booking-started",
              data: booking,
          });
      }

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

      const booking = await Booking.findById(bookingId).populate("user");
      if (!booking) {
          throw new Error("Booking not found");
      }
      if (booking.status !== "ongoing") {
          throw new Error("Booking is not ongoing");
      }

      booking.status = "completed";
      await booking.save();

      if (booking.user && booking.user.socketId) {
          sendMessageToSocketId(booking.user.socketId, {
              event: "booking-ended",
              data: booking,
          });
      }

      return booking;
  } catch (error) {
      console.error("Error ending ride:", error);
      throw new Error("Failed to end ride");
  }
};

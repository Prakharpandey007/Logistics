import mongoose from "mongoose";

const driverDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicleOwnerName: {
    type: String,
    required: true,
    trim:true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    match: /^[A-Z]{2}-\d{2}\s[A-Z]{1,2}-\d{4}$/,
    unique: true,
    trim:true,
   
  },

  driverName: {
    type: String,
    required: true,
    trim:true,
  },
  driverPhoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[7-9]\d{9}$/,
    trim:true,
  },
  driverLicenseNumber: {
    type: String,
    required: true,
    match: /^[A-Z]{2}\d{2}-\d{10,13}$/,
    unique: true,
    trim:true,
    sparse:true,
  },
  vehicleType: {
    type: String,
    enum: [ "Pickupvans", "MiniTrucks", "Trucks", "ContainerTrucks"],
    required: true,
    trim:true,
  },
  travelPermit: {
     type: String, 
     enum: ["Zonal", "State", "All India"], 
     required: true,
     trim:true,
     },
});
const Driverdetails = mongoose.model("DriverDetails", driverDetailsSchema);
export default Driverdetails;

import mongoose from "mongoose";

const driverDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehcileOwnerName: {
    type: String,
    required: true,
  },
  vehcileNumber: {
    type: String,
    required: true,
    match: /^[A-Z]{2}-\d{2}\s[A-Z]{1,2}-\d{4}$/,
    unique: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverPhoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[7-9]\d{9}$/,
  },
  driverLicenseNumber: {
    type: String,
    required: true,
    match: /^[A-Z]{2}\d{2}-\d{11,13}$/,
    unique: true,
  },
  vehicleType: {
    type: String,
    enum: ["LMV", "HMV", "Commercial", "International", "Permanent"],
    required: true,
  },
  travelPermit: {
     type: String, 
     enum: ["Zonal", "State", "All India"], 
     required: true
     },
});
const Driverdetails = mongoose.model("DriverDetails", driverDetailsSchema);
export default Driverdetails;

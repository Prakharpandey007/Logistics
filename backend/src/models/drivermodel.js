import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDriverDetailsFilled: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    location: {
      ltd: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;

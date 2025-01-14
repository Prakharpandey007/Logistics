import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["user", "driver", "admin"],
      required: true,
    },
    isDriverDetailsFilled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const user = mongoose.model("User", userSchema);
export default user;

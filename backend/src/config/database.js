import mongoose from "mongoose";

const connectTomongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect to Mongodb");
  } catch (error) {
    console.log("Not connected to the mongodb", error.message);
  }
};
export default connectTomongoDb;

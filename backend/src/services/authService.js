import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";
import User from "../models/user.js";

export const signup = async (name, email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await redisClient.set(`session:${user._id}`, token, { EX: 86400 });

    return { message: "User registered successfully", user, token };
  } catch (error) {
    console.log("Error in signup function in authservice");
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw { message: "No User found" };
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw { message: "Password is incorrect" };
    }

    const cachedToken = await redisClient.get(`session:${user._id}`);
    if (cachedToken) {
      return { token: cachedToken, user, message: "Logged in using cached token" };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await redisClient.set(`session:${user._id}`, token, { EX: 86400 });

    return { token, user, message: "Logged in successfully" };
  } catch (error) {
    console.log("Error in authservice login");
    throw error;
  }
};


export const GetCachedLogin=async(userId)=>{
 const cachedtoken=await redisClient.get(`session:${userId}`);
 return cachedtoken ?{token:cachedtoken}:null;

};


export const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return { user };
  } catch (error) {
    console.log("Error in getUserProfile function in authservice", error);
    throw error;
  }
};

/**
 * Logs out a user by deleting the session token from Redis.
 */
export const logout = async (userId) => {
  try {
    await redisClient.del(`session:${userId}`);
    return { message: "User logged out successfully" };
  } catch (error) {
    console.log("Error in logout function in authservice", error);
    throw error;
  }
};
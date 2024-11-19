import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";
import User from "../models/user.js";

// sign up logic and password hash
export const signup = async (name, email, password, role) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // save data in the database
    const user = new User({
      name,
      email,
      password: hashedpassword,
      role,
    });
    await user.save();

    // generate the jwt and store in the redis for fast response
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await redisClient.set(`session:${user._id}`, token, { EX: 86400 });

    return {
      message: "user registered successfully",
      user,
      token,
      role: user.role,
    };
  } catch (error) {
    console.log("Error in signup function in authservice");
    throw error;
  }
};

 export const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        message: "No User found",
      };
    }
    const comparepassword = await bcrypt.compare(password, user.password);
    if (!comparepassword) {
      throw {
        message: "Password is Incorrect",
      };
    }
    // Now check redis for this existing token
    const cachedtoken = await redisClient.get(`session:${user._id}`);
    // login using cached token
    if (cachedtoken) {
      return {
        token: cachedtoken,
        user,
        role: user.role,

        message: "Loged in using cachetoken",
      };
    }
    // else generate a new jwt token and store it
    const token = jwt.sign(
      {
         id: user._id, role: user.role 
        },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await redisClient.set(`session:${user._id}`, token, { EX: 86400 });
    return {
      token,
      role: user.role,
      user,
      message: "Logged in successfully",
    };
  } catch (error) {
    console.log(error);
    console.log("Something went wrong is authserivce login");

    throw error;
  }
};

export const GetCachedLogin=async(userId)=>{
 const cachedtoken=await redisClient.get(`session:${userId}`);
 return cachedtoken ?{token:cachedtoken}:null;

};

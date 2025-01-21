import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";
import User from "../models/user.js";

// sign up logic and password hash
// export const signup = async (name, email, password, role) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedpassword = await bcrypt.hash(password, salt);

//     // save data in the database
//     const user = new User({
//       name,
//       email,
//       password: hashedpassword,
//       role,
//     });
//     await user.save();

//     // generate the jwt and store in the redis for fast response
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );
//     await redisClient.set(`session:${user._id}`, token, { EX: 86400 });

//     return {
//       message: "user registered successfully",
//       user,
//       token,
//       role: user.role,
//     };
//   } catch (error) {
//     console.log("Error in signup function in authservice");
//     throw error;
//   }
// };

//  export const login = async (email, password) => {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw {
//         message: "No User found",
//       };
//     }
//     const comparepassword = await bcrypt.compare(password, user.password);
//     if (!comparepassword) {
//       throw {
//         message: "Password is Incorrect",
//       };
//     }
//     // Now check redis for this existing token
//     const cachedtoken = await redisClient.get(`session:${user._id}`);
//     // login using cached token
//     if (cachedtoken) {
//       return {
//         token: cachedtoken,
//         user,
//         role: user.role,

//         message: "Loged in using cachetoken",
//       };
//     }
//     // else generate a new jwt token and store it
//     const token = jwt.sign(
//       {
//          id: user._id, role: user.role 
//         },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );
//     await redisClient.set(`session:${user._id}`, token, { EX: 86400 });
//     return {
//       token,
//       role: user.role,
//       user,
//       message: "Logged in successfully",
//     };
//   } catch (error) {
//     console.log(error);
//     console.log("Something went wrong is authserivce login");

//     throw error;
//   }
// };
export const signup = async (name, email, password, role) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // Save data in the database
    const user = new User({
      name,
      email,
      password: hashedpassword,
      role,
    });
    await user.save();

    // Generate the JWT and store it in Redis for fast response
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await redisClient.set(`session:${user._id}`, token, { EX: 86400 });

    return {
      message: "User registered successfully",
      user,
      token,
      role: user.role,
    };
  } catch (error) {
    console.log("Error in signup function in authservice");
    throw error;
  }
};

export const login = async (email, password, role) => {
  
  try {
    console.log("Login attempt with:", { email, role }); // Debug log
    if (!role) {
      throw { message: "Role is required for login" };
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        message: "No User found",
      };
    }

    // Check if the role matches
    if (user.role !== role) {
      throw {
        message: `Invalid role. This email is registered as a ${user.role}.`,
      };
    }

    const comparepassword = await bcrypt.compare(password, user.password);
    if (!comparepassword) {
      throw {
        message: "Password is incorrect",
      };
    }

    // Now check Redis for this existing token
    const cachedtoken = await redisClient.get(`session:${user._id}`);
    if (cachedtoken) {
      return {
        token: cachedtoken,
        user,
        role: user.role,
        message: "Logged in using cached token",
      };
    }

    // Generate a new JWT token and store it
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await redisClient.set(`session:${user._id}`, token, { EX: 86400 });

    return {
      token,
      role: user.role,
      user,
      message: "Logged in successfully",
    };
  } catch (error) {
    console.log("Error in authservice login");
    throw error;
  }
};


export const GetCachedLogin=async(userId)=>{
 const cachedtoken=await redisClient.get(`session:${userId}`);
 return cachedtoken ?{token:cachedtoken}:null;

};

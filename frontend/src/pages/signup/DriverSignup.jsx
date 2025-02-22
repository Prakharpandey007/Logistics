import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../../context/CaptainContext";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
     name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/driver/signup`,
        captainData
      );

      if (response.status === 201) {
        navigate("/driver/login"); // Redirect to login page after signup
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Captain Sign Up</h2>
        <form onSubmit={submitHandler}>
          <label className="block text-gray-700 font-medium">Full Name</label>
          <input
            required
            type="text"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-gray-700 font-medium">Email</label>
          <input
            required
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-gray-700 font-medium">Password</label>
          <input
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-6 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/driver/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;

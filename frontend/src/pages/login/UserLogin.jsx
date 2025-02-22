import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext.jsx";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/user/home"); // Redirect to home after login
      }
    } catch (error) {
      console.error("Login error:", error);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-center mb-6">User Login</h2>
        <form onSubmit={submitHandler}>
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
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          New here?{" "}
          <Link to="/user/signup" className="text-blue-500 hover:underline">
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;

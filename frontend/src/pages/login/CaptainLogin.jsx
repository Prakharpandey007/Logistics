import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/driver/login`,
        { email, password }
      );

      const { success, data } = response.data;
      
      if (success && data) {
        const { driver, token } = data;
        
        // Store driver data and token
        setCaptain(driver);
        localStorage.setItem("token", token);
        localStorage.setItem("driverId", driver._id);

        // Check if driver details are filled
        if (!driver.isDriverDetailsFilled) {
          navigate("/driverdetails");
        } else {
          navigate("/driver/home");
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Captain Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              required
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              required
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          New here?{" "}
          <Link to="/driver/signup" className="text-blue-500 hover:underline">
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainLogin;
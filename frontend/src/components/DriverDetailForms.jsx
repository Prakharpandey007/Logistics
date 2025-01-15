import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const DriverDetailsForm = () => {
  const [details, setDetails] = useState({
    vehicleOwnerName: "",
    vehicleNumber: "",
    driverName: "",
    driverPhoneNumber: "",
    driverLicenseNumber: "",
    vehicleType: "",
    travelPermit: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Session expired. Please login again.");
      return;
    }
    setToken(authToken);
  }, []);

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/driver/details/sendOtp", {
        driverPhoneNumber: details.driverPhoneNumber,
      });
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/driver/details/verifyOtp", {
        driverPhoneNumber: details.driverPhoneNumber,
        otp: details.otp,
      });
      alert("OTP Verified!");
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to verify OTP");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }
  
    if (!details.vehicleNumber || details.vehicleNumber.trim() === "") {
      alert("Vehicle Number is required.");
      return;
    }
    
    try {
      await axios.post("http://localhost:3000/api/v1/driver/details", details, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Details Submitted!");
      navigate("/home/driver"); // ✅ Navigate to driver homepage after success
    } catch (error) {
      console.error("Error submitting details:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit details");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Driver Details Form
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Vehicle Owner Name"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, vehicleOwnerName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, vehicleNumber: e.target.value })}
          />
          <input
            type="text"
            placeholder="Driver Name"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, driverName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Driver Phone Number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, driverPhoneNumber: e.target.value })}
          />
          {otpSent && (
            <input
              type="text"
              placeholder="OTP"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => setDetails({ ...details, otp: e.target.value })}
            />
          )}
          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            onClick={otpSent ? verifyOtp : sendOtp}
          >
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
          <input
            type="text"
            placeholder="Driver License Number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, driverLicenseNumber: e.target.value })}
          />
          <input
            type="text"
            placeholder="Vehicle Type"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, vehicleType: e.target.value })}
          />
          <input
            type="text"
            placeholder="Travel Permit"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setDetails({ ...details, travelPermit: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverDetailsForm;

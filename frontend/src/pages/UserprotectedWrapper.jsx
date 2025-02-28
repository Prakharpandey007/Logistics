import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/user/login");
      return;
    }
  
    // Ensure user._id is available before making the request
    if (!user?._id) {
      console.error("User ID is missing, unable to fetch profile.");
      return;
    }
  
    console.log("Fetching profile for user ID:", user._id); // Debugging log
  
    axios.get(`${import.meta.env.VITE_BASE_URL}/user/getprofile`, {
      params: { userId: user._id }, // Pass userId as a query param
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("User profile fetched successfully:", response.data); // Debugging log
        setUser(response.data);
      } else {
        console.error("Unexpected response:", response);
      }
    })
    .catch((err) => {
      console.error("Error fetching user profile:", err.response?.data || err.message);
      localStorage.removeItem("token");
      navigate("/user/login");
    })
    .finally(() => {
      setIsLoading(false);
    });
  
  }, [navigate, user?._id, setUser]);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
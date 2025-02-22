import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
        // if (window.location.pathname === "/driver/logout") return;
      navigate("/driver/login");
      return;
    }
  
    if (!captain?._id) return; // Prevents unnecessary API calls
  
    axios.get(
      `${import.meta.env.VITE_BASE_URL}/driver/getdriverprofile?driverId=${captain?._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        setCaptain(response.data);
        setIsLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("token");
      navigate("/driver/login");
    });
  }, [token, captain?._id]);// Added `captain?._id` to dependencies

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;

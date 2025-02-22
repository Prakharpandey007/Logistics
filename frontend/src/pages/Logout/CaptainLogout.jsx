import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CaptainLogout = () => {
    const token = localStorage.getItem('captain-token');
    const driverId = localStorage.getItem('driverId'); 
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            if (!token) {
                console.warn("No token found, redirecting to login...");
                localStorage.removeItem('captain-token'); 
                localStorage.removeItem('driverId');  
                navigate('/driver/login');
                return;
            }

            if (!driverId) {
                console.warn("No driverId found, removing token and redirecting...");
                localStorage.removeItem('captain-token'); 
                navigate('/driver/login');
                return;
            }

            try {
                console.log("Logging out driver:", driverId);

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/driver/logout`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { driverId },
                    }
                );
                
                if (response.status === 200) {
                    console.log("Logout successful");
                    localStorage.removeItem('captain-token');
                    localStorage.removeItem('driverId');
                    navigate('/driver/login');
                }
            } catch (error) {
                console.error("Logout request failed:", error);
                localStorage.removeItem('captain-token');  
                localStorage.removeItem('driverId');  
                navigate('/driver/login');
            }
        };

        logout();
    }, [navigate, token, driverId]);

    return <div>Logging out...</div>;
};

export default CaptainLogout;

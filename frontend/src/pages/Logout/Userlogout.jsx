import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserLogout = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            if (!token) {
                console.warn("No token found, redirecting to login...");
                navigate('/user/login');
                return;
            }

            try {
                console.log("Logging out user...");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/logout`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    console.log("Logout successful");
                    localStorage.removeItem('token');
                    navigate('/user/login');
                }
            } catch (error) {
                console.error("Logout request failed:", error);
                navigate('/user/login');
            }
        };

        logout();
    }, [navigate, token]);

    return <div>Logging out...</div>;
};

export default UserLogout;

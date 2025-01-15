import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/login", credentials);
      
      console.log("Raw API Response:", response.data); // Debugging
      
      // Ensure the response has expected structure
      if (!response.data || !response.data.data || !response.data.data.user || !response.data.data.token || !response.data.data.role) {
        console.error("Unexpected API Response Format:", response.data);
        throw new Error("Incomplete API response.");
      }
  
      const { user, token, role } = response.data.data;
  
      // Store token for authentication
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
  
      return { user, token, role };
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  };
  
  

  const signup = async (credentials) => {
    const { data } = await axios.post("http://localhost:3000/api/v1/signup", credentials);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { useAuth } from "../context/authcontext";

const useLogin = () => {
  const { login } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);

      // Log the full response to debug its structure
      console.log("API Login Response:", response);

      // Ensure response has expected properties
      if (!response || !response.user || !response.token || !response.role) {
        throw new Error("Invalid login response.");
      }

      return response.user; // Return user object for further use
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  return { handleLogin };
};

export default useLogin;

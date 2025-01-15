import { useAuth } from "../context/authcontext";

const useSignup = () => {
  const { signup } = useAuth();

  const handleSignup = async (credentials) => {
    try {
      await signup(credentials);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return { handleSignup };
};

export default useSignup;
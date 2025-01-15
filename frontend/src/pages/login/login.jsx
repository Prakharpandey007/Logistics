import { useState } from "react";
import useLogin from "../../hooks/uselogin";
import { useNavigate, useParams, Link } from "react-router-dom";

const Login = () => {
  const { role } = useParams();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { handleLogin } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await handleLogin(credentials);

      if (role === "driver" && !user.isDriverDetailsFilled) {
        navigate("/driver/details");
      } else {
        navigate(`/home/${role}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/src/assets/pic1.png')" }}
    >
      <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <Link
            to={`/signup/${role}`}
            className="text-blue-500 hover:underline"
          >
            Please Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

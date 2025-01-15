import { useState } from "react";
import useSignup from "../../hooks/usesignup";
import { useNavigate, useParams } from "react-router-dom";

const Signup = () => {
  const { role } = useParams();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const { handleSignup } = useSignup();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSignup({ ...credentials, role });
    navigate(`/login/${role}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/src/assets/pic1.png')" }}
    >
      <div className="bg-white/50 backdrop-blur-md p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          {role.charAt(0).toUpperCase() + role.slice(1)} Signup
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            />
          </div>
          <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Signup
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate(`/login/${role}`)}
          >
            Please Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

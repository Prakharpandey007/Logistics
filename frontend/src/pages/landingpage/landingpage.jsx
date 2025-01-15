import { useNavigate } from "react-router-dom";
import pic1 from "../../assets/pic1.png"; // Correctly importing the image

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar/Header */}
      <header className="bg-black text-white py-4 px-8 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold tracking-wide">Cargoware</h1>
        <div className="flex space-x-4">
          <button
            className="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black transition"
            onClick={() => navigate("/login/user")}
          >
            User Login
          </button>
          <button
            className="bg-transparent border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black transition"
            onClick={() => navigate("/login/driver")}
          >
            Driver Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center bg-gray-100 w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Welcome to the Logistic App
        </h1>
        <img
          src={pic1} // Using the imported image
          alt="Logistics representation"
          className="w-full h-auto shadow-lg"
        />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 px-4 text-center w-full">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm md:text-base">&copy; 2025 Cargoware. All rights reserved.</div>
          <div className="text-sm md:text-base">
            Made with <span className="text-red-500">&#9829;</span> at IIIT-Ranchi
          </div>
          <div className="flex space-x-6">
            <button className="hover:underline">Contact Us</button>
            <button className="hover:underline">About Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import React, { useEffect, useRef, useState, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';

import LocationSearchPanel from '../../components/LocationSearchPanel';
import VehiclePanel from '../../components/VehcilePanel';
import ConfirmRide from '../../components/ConfirmRide';
import LookingForDriver from '../../components/Lookingfordriver';
import WaitingForDriver from '../../components/Waitingfordriver';
import LiveTracking from '../../components/LiveTracking';
import { SocketContext } from '../../context/SocketContext';
import { UserDataContext } from '../../context/UserContext';

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    socket.emit('join', { userType: 'user', userId: user._id });

    socket.on('ride-confirmed', (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    });

    socket.on('ride-started', (ride) => {
      setWaitingForDriver(false);
      navigate('/riding', { state: { ride } });
    });
  }, [user, socket, navigate]);

  const fetchSuggestions = async (query, setSuggestions) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/map/autosuggestions`,
        {
          params: { input: query },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions', error);
    }
  };

  const handlePickupChange = (e) => {
    setPickup(e.target.value);
    fetchSuggestions(e.target.value, setPickupSuggestions);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchSuggestions(e.target.value, setDestinationSuggestions);
  };

  const findTrip = async () => {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      console.log('Fetching fare for:', pickup, destination);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found, please log in again.');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/bookings/getfare`,
        {
          params: {
            pickup: pickup.trim(),
            destination: destination.trim(),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFare(response.data);
    } catch (error) {
      console.error('Error fetching fare', error.response?.data || error.message);
    }
  };

  const createRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/bookings/createbooking`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
    } catch (error) {
      console.error('Error creating ride', error);
    }
  };

  // GSAP animations with checks for ref existence
  useGSAP(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        height: panelOpen ? '70%' : '0%',
        padding: panelOpen ? 24 : 0,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanelRef.current) {
      gsap.to(vehiclePanelRef.current, {
        transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)',
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanelRef.current) {
      gsap.to(confirmRidePanelRef.current, {
        transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)',
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFoundRef.current) {
      gsap.to(vehicleFoundRef.current, {
        transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)',
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriverRef.current) {
      gsap.to(waitingForDriverRef.current, {
        transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)',
      });
    }
  }, [waitingForDriver]);

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Map container - fixed position, takes full screen */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <LiveTracking />
      </div>

      {/* Logo - absolute positioned on top of map */}
      <div className="absolute left-5 top-5 z-20">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />
      </div>
      
      {/* UI Panel Container - fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Main Panel */}
        <div className="bg-white rounded-t-3xl shadow-lg">
          <div className="p-6 relative">
            {panelOpen && (
              <button
                ref={panelCloseRef}
                onClick={() => setPanelOpen(false)}
                className="absolute right-6 top-6 text-2xl cursor-pointer"
                aria-label="Close panel"
              >
                <i className="ri-arrow-down-wide-line"></i>
              </button>
            )}
            <h4 className="text-2xl font-semibold mb-3">Find a trip</h4>
            <form className="relative">
              <input
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField('pickup');
                }}
                value={pickup}
                onChange={handlePickupChange}
                className="bg-gray-200 px-4 md:px-12 py-3 text-lg rounded-lg w-full focus:outline-none mb-3"
                type="text"
                placeholder="Add a pick-up location"
              />
              <input
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField('destination');
                }}
                value={destination}
                onChange={handleDestinationChange}
                className="bg-gray-200 px-4 md:px-12 py-3 text-lg rounded-lg w-full focus:outline-none"
                type="text"
                placeholder="Enter your destination"
              />
            </form>
            <button
              onClick={findTrip}
              className="bg-black text-white px-4 py-3 rounded-lg mt-4 w-full transition-colors duration-300 hover:bg-gray-800 font-medium"
            >
              Find Trip
            </button>
          </div>
          
          {/* Animated search panel */}
          <div 
            ref={panelRef} 
            className="bg-white overflow-y-auto transition-all duration-300 ease-in-out"
            style={{ height: panelOpen ? '70vh' : '0', padding: panelOpen ? '24px' : '0' }}
          >
            <LocationSearchPanel
              suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
              setPanelOpen={setPanelOpen}
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
            />
          </div>
        </div>
      </div>
  
      {/* Bottom sliding panels - fixed position, appear when needed */}
      <div className="fixed bottom-0 left-0 w-full z-30">
        {/* Vehicle selection panel */}
        <div 
          ref={vehiclePanelRef} 
          className="w-full transform translate-y-full transition-transform duration-300 ease-in-out"
        >
          {vehiclePanel && (
            <VehiclePanel
              fare={fare}
              setVehicleType={setVehicleType}
              setVehiclePanel={setVehiclePanel}
              setConfirmRidePanel={setConfirmRidePanel}
            />
          )}
        </div>
        
        {/* Confirm ride panel */}
        <div 
          ref={confirmRidePanelRef} 
          className="w-full transform translate-y-full transition-transform duration-300 ease-in-out"
        >
          {confirmRidePanel && (
            <ConfirmRide
              pickup={pickup}
              destination={destination}
              createRide={createRide}
              setConfirmRidePanel={setConfirmRidePanel}
              setVehicleFound={setVehicleFound}
            />
          )}
        </div>
        
        {/* Looking for driver panel */}
        <div 
          ref={vehicleFoundRef} 
          className="w-full transform translate-y-full transition-transform duration-300 ease-in-out"
        >
          {vehicleFound && <LookingForDriver />}
        </div>
        
        {/* Waiting for driver panel */}
        <div 
          ref={waitingForDriverRef} 
          className="w-full transform translate-y-full transition-transform duration-300 ease-in-out"
        >
          {waitingForDriver && <WaitingForDriver ride={ride} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
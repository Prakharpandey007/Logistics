import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const VehiclePanel = ({ setVehiclePanel, setConfirmRidePanel, selectVehicle, fare, userLocation }) => {
  useEffect(() => {
    if (!userLocation) return; // Ensure userLocation is available

    const map = L.map('map').setView(userLocation, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(userLocation).addTo(map).bindPopup("Your Location").openPopup();

    return () => map.remove();
  }, [userLocation]);

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md">
      {/* Close Button */}
      <h5 className="p-1 text-center w-[93%] absolute top-0 cursor-pointer" onClick={() => setVehiclePanel(false)}>
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>
      
      <h3 className='text-2xl font-semibold mb-5 text-center'>Choose a Vehicle</h3>
      
      {/* Map UI */}
      <div id="map" className="h-60 w-full rounded-md mb-4"></div>
      
      {/* Vehicle Options */}
      {['Pickupvans', 'MiniTrucks', 'Trucks', 'ContainerTrucks'].map((type) => (
        <div 
          key={type} 
          onClick={() => {
            setConfirmRidePanel(true);
            selectVehicle(type);
          }}
          className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between cursor-pointer hover:bg-gray-100 transition'
        >
          <img className='h-10' 
            src={
              type === 'Pickupvans' ? "https://dvhmanandvan.co.uk/wp-content/uploads/2018/04/luton-van-hire.jpg" :
              type === 'MiniTrucks' ? "https://image.made-in-china.com/226f3j00dHTBvnjCkbqQ/Best-Chinese-Electric-Mini-Lorry-Trucks-Kama-EV-Mini-Trucks-210km-1-5t-Pickup-Cargo-Lorry-Truck-Vehicle-Car.webp" :
              type === 'Trucks' ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWaEuQDkGwtq3aE2GE0v64JSpBzMNRfeH67XsU4Eu7vhNmd-uFxjiRr25AvTeWjq1_nkU&usqp=CAU" :
              type === 'ContainerTrucks' ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGYE39nXpsyFymIGkGS6bMJzv3fgGS3LdOWQ&s" : ""
            } 
            alt={type}
          />
          
          <div className='ml-2 w-1/2'>
            <h4 className='font-medium text-base capitalize'>
              {type} <span><i className="ri-user-3-fill"></i> {type === 'Pickupvans' ? 4 : type === 'MiniTrucks' ? 2 : type === 'Trucks' ? 2 : 4}</span>
            </h4>
            <h5 className='font-medium text-sm'>2 mins away</h5>
            <p className='font-normal text-xs text-gray-600'>Affordable {type} Bookings</p>
          </div>
          
          <h2 className='text-lg font-semibold'>₹{fare[type] || 'N/A'}</h2>
        </div>
      ))}
    </div>
  );
};

export default VehiclePanel;

import React from 'react';

const ConfirmRide = ({ setConfirmRidePanel, pickup, destination, fare, vehicleType, setVehicleFound, createRide }) => {
  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md">
      {/* Close Button */}
      <h5
        className="p-2 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => setConfirmRidePanel(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold text-center mb-5">Confirm Your Ride</h3>

      {/* Vehicle Image */}
      <div className="flex flex-col items-center gap-3">
        <img
          className="h-20 rounded-md shadow-md"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Vehicle"
        />

        {/* Ride Details */}
        <div className="w-full bg-gray-100 p-4 rounded-lg">
          {/* Pickup Location */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-xl text-blue-500 ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickup || 'N/A'}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-xl text-red-500 ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Drop-off Location</h3>
              <p className="text-sm -mt-1 text-gray-600">{destination || 'N/A'}</p>
            </div>
          </div>

          {/* Fare Details */}
          <div className="flex items-center gap-5 p-3">
            <i className="text-xl text-green-500 ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare?.[vehicleType] || '0.00'}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        {/* Confirm Ride Button */}
        <button
          onClick={() => {
            setVehicleFound(true);
            setConfirmRidePanel(false);
            createRide();
          }}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition"
        >
          Confirm Ride
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;

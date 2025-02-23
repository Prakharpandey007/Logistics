import React from 'react';

const WaitingForDriver = ({ ride, waitingForDriver }) => {
  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md">
      {/* Close Button */}
      <h5
        className="p-2 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => waitingForDriver(false)}
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      {/* Driver Info */}
      <div className="flex items-center justify-between">
        <img
          className="h-12 rounded-md shadow-md"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Driver's Car"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {ride?.captain?.fullname?.firstname || 'Driver'}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {ride?.captain?.vehicle?.plate || 'XXX-0000'}
          </h4>
          <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          <h1 className="text-lg font-semibold">{ride?.otp || '0000'}</h1>
        </div>
      </div>

      {/* Ride Details */}
      <div className="w-full mt-5 bg-gray-100 p-4 rounded-lg">
        {/* Pickup Location */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-xl text-blue-500 ri-map-pin-user-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Pickup Location</h3>
            <p className="text-sm -mt-1 text-gray-600">{ride?.pickup || 'N/A'}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="text-xl text-red-500 ri-map-pin-2-fill"></i>
          <div>
            <h3 className="text-lg font-medium">Drop-off Location</h3>
            <p className="text-sm -mt-1 text-gray-600">{ride?.destination || 'N/A'}</p>
          </div>
        </div>

        {/* Fare Details */}
        <div className="flex items-center gap-5 p-3">
          <i className="text-xl text-green-500 ri-currency-line"></i>
          <div>
            <h3 className="text-lg font-medium">₹{ride?.fare || '0.00'}</h3>
            <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;

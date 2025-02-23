import React from 'react';

const LookingForDriver = (props) => {
    return (
        <div className="relative bg-white p-4 rounded-lg shadow-md">
            {/* Close Button */}
            <h5
                className="p-2 text-center w-[93%] absolute top-0 cursor-pointer"
                onClick={() => props.setVehicleFound(false)}
            >
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>

            {/* Title */}
            <h3 className="text-2xl font-semibold mb-5 text-center">
                Looking for a Driver
            </h3>

            <div className="flex flex-col items-center gap-4">
                {/* Vehicle Image */}
                <img
                    className="h-20 rounded-md shadow-lg"
                    src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                    alt="Car"
                />

                {/* Ride Information */}
                <div className="w-full mt-5 bg-gray-100 p-4 rounded-lg">
                    {/* Pickup Location */}
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-xl text-blue-500 ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Pickup Location</h3>
                            <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-xl text-red-500 ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Drop-off Location</h3>
                            <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
                        </div>
                    </div>

                    {/* Fare Details */}
                    <div className="flex items-center gap-5 p-3">
                        <i className="text-xl text-green-500 ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">
                                ₹{props.fare?.[props.vehicleType] || "N/A"}
                            </h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LookingForDriver;

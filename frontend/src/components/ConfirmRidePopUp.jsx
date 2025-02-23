// otp functionality add here 
// navigate to change captaing-riding 
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ConfirmRidePopUp = (props) => {
    const navigate = useNavigate();

    const position = props.ride
        ? [props.ride.pickup.lat, props.ride.pickup.lng]
        : [0, 0]; // Default position in case data is missing

    const confirmRideHandler = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/bookings/startbooking`,
                {
                    bookingId: props.ride?._id // Use bookingId from ride data
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
                navigate('/captain-riding', { state: { ride: props.ride } });
            }
        } catch (error) {
            console.error('Error starting booking:', error);
        }
    };

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => props.setRidePopupPanel(false)}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>

            {/* Leaflet Map */}
            <div className="h-60 w-full rounded-lg overflow-hidden">
                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={position}>
                        <Popup>Pickup Location</Popup>
                    </Marker>
                </MapContainer>
            </div>

            <div className='mt-6 w-full'>
                <button
                    onClick={confirmRideHandler}
                    className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'
                >
                    Confirm
                </button>
                <button
                    onClick={() => {
                        props.setConfirmRidePopupPanel(false);
                        props.setRidePopupPanel(false);
                    }}
                    className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmRidePopUp;


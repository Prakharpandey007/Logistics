import React, { useEffect, useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
})

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    const [driverLocation, setDriverLocation] = useState({
        lat: ride?.captain?.location?.lat || 23.3441, // Default Ranchi lat
        lng: ride?.captain?.location?.lng || 85.3096, // Default Ranchi lng
    })

    useEffect(() => {
        if (!ride) {
            navigate('/user/home') // Redirect if ride data is missing
        }

        socket.on("driver-location-update", (data) => {
            setDriverLocation({ lat: data.lat, lng: data.lng })
        })

        socket.on("ride-ended", () => {
            navigate('/user/home')
        })

        return () => {
            socket.off("driver-location-update")
            socket.off("ride-ended")
        }
    }, [socket, ride, navigate])

    return (
        <div className='h-screen'>
            <Link to='/user/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-lg'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>

            {/* Leaflet Map */}
            <div className='h-1/2'>
                <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={13} className="h-full w-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[driverLocation.lat, driverLocation.lng]} icon={customIcon}>
                        <Popup>Your driver is here</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Ride Details */}
            <div className='h-1/2 p-4 bg-white shadow-lg rounded-t-3xl'>
                <div className='flex items-center justify-between'>
                    <img className='h-12 rounded-full' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Driver" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain?.fullname?.firstname || 'Unknown'}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain?.vehicle?.plate || 'N/A'}</h4>
                        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                    </div>
                </div>

                {/* Ride Information */}
                <div className='flex flex-col gap-3 mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm text-gray-600'>{ride?.pickup || 'Not available'}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Drop-off</h3>
                            <p className='text-sm text-gray-600'>{ride?.destination || 'Not available'}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{ride?.fare || '0'}</h3>
                            <p className='text-sm text-gray-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>

                <button className='w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg shadow-md'>
                    Make a Payment
                </button>
            </div>
        </div>
    )
}

export default Riding;


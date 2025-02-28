import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
})

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext)

    const [driverLocation, setDriverLocation] = useState({
        lat: rideData?.captain?.location?.lat || 23.3441, // Default Ranchi lat
        lng: rideData?.captain?.location?.lng || 85.3096, // Default Ranchi lng
    })

    useGSAP(() => {
        gsap.to(finishRidePanelRef.current, {
            transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)'
        })
    }, [finishRidePanel])

    useEffect(() => {
        if (!rideData) {
            navigate('/captain-home')
        }

        socket.on("driver-location-update", (data) => {
            setDriverLocation({ lat: data.lat, lng: data.lng })
        })

        socket.on("ride-ended", () => {
            navigate('/captain-home')
        })

        return () => {
            socket.off("driver-location-update")
            socket.off("ride-ended")
        }
    }, [socket, rideData, navigate])

    return (
        <div className='h-screen relative flex flex-col justify-end'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10' onClick={() => setFinishRidePanel(true)}>
                <h5 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-semibold'>{'4 KM away'}</h4>
                <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
            </div>

            <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-screen top-0 z-[-1]'>
                <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={13} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[driverLocation.lat, driverLocation.lng]} icon={customIcon}>
                        <Popup>You're here</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    )
}

export default CaptainRiding

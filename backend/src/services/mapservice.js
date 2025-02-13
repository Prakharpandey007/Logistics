import axios from "axios";
import User from '../models/user.js';
// OpenStreetMap uses Nominatim for geocoding and OSRM for distance calculation.
const OSM_API_BASE_URL = process.env.OSM_API_BASE_URL;
const OSRM_API_BASE_URL = process.env.OSRM_API_BASE_URL;

export const getCoordinates = async (address) => {
    try {
        console.log(`Fetching coordinates for: ${address}`);

        // Geocoding with Nominatim (OpenStreetMap)
        const url = `${OSM_API_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`;
        console.log(`Geocoding API URL: ${url}`);

        const response = await axios.get(url);

        console.log("Geocode API Response:", JSON.stringify(response.data, null, 2));

        // Check if we have results
        if (!response.data?.[0]) {
            throw new Error("No location found for the given address");
        }

        const location = response.data[0];
        return {
            lat: location.lat,
            lng: location.lon,
            placeName: location.display_name,
            address: location.address
        };
    } catch (error) {
        console.error("Error fetching coordinates:", error.response?.data || error.message);
        throw new Error("Failed to get coordinates: " + (error.response?.data?.message || error.message));
    }
};

export const getDistanceTime = async (pickup, destination) => {
    try {
        if (!pickup?.lat || !pickup?.lng || !destination?.lat || !destination?.lng) {
            throw new Error("Invalid location coordinates");
        }

        console.log("Using coordinates for distance API:", pickup, destination);

        // Distance and time calculation with OSRM (Open Source Routing Machine)
        const distanceApiUrl = `${OSRM_API_BASE_URL}/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=false&geometries=polyline&steps=true`;

        console.log("Distance API URL:", distanceApiUrl);

        const response = await axios.get(distanceApiUrl);

        if (!response.data?.routes?.[0]?.legs?.[0]) {
            throw new Error("Invalid distance API response");
        }

        const leg = response.data.routes[0].legs[0];
        return {
            distance: leg.distance,  // Distance in meters
            duration: leg.duration,  // Duration in seconds
        };
    } catch (error) {
        console.error("Error fetching distance and time:", error.response?.data || error.message);
        throw new Error("Failed to fetch distance and time: " + (error.response?.data?.message || error.message));
    }
};

export const getAutoCompleteSuggestions = async (input) => {
    try {
        if (!input) {
            throw new Error("Query is required");
        }

        // Autocomplete using Nominatim search API (OpenStreetMap)
        const url = `${OSM_API_BASE_URL}/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1&limit=5`;
        const response = await axios.get(url);

        if (!response.data) {
            throw new Error("Invalid autocomplete data");
        }

        return response.data.map(location => ({
            placeName: location.display_name,
            lat: location.lat,
            lng: location.lon,
            address: location.address
        }));
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
        throw new Error("Failed to get autocomplete suggestions");
    }
};

// Function to get captains within a given radius
export const getCaptainsInTheRadius = async (lat, lng, radius) => {
    try {
        const captains = await User.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lat, lng], radius / 6371],
                },
            },
        });
        return captains;
    } catch (error) {
        console.error("Error fetching captains:", error.message);
        throw new Error("Failed to fetch captains in the radius");
    }
};

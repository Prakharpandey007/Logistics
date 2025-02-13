import {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCaptainsInTheRadius,
} from "../services/mapservice.js";

export const getLocation = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
        data: {},
        err: {},
      });
    }
    const coordinates = await getCoordinates(address);
    return res.status(200).json({
      success: true,
      message: "Get coordinates is successfull",
      data:coordinates,
      err: {},
    });
  } catch (error) {
    console.error("Error in getLocation controller :", error);
    return res.status(500).json({
      message: "Something went wrong in getLocation controller",
      success: false,
      err: error,
    });
  }
};

export const getdistime = async (req, res) => {
  try {
    const { pickupLat, pickupLng, destLat, destLng } = req.query;
    if (!pickupLat || !pickupLng || !destLat || !destLng) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
        data: {},
        err: {},
      });
    }
    const pickup = { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) };
    const destination = { lat: parseFloat(destLat), lng: parseFloat(destLng) };

    const distanceTime = await getDistanceTime(pickup, destination);

    return res.status(200).json({
      success: true,
      message: "Get distancetime is successfull",
      data:distanceTime,
      err: {},
    });
  } catch (error) {
    console.error("Error in getdistancetime controller :", error);
    return res.status(500).json({
      message: "Something went wrong in getdistime controller",
      success: false,
      err: error,
    });
  }
};

export const getAutocompletesuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
        data: {},
        err: {},
      });
    }
    const suggestions = await getAutoCompleteSuggestions(query);
    return res.status(200).json({
      success: true,
      message: "Get suggestion is successfull",
      data: suggestions,
      err: {},
    });
  } catch (error) {
    console.error("Error in getAutocompletesuggestion controller :", error);
    return res.status(500).json({
      message: "Something went wrong in getautocompletesuggestion controller",
      success: false,
      err: error,
    });
  }
};

export const captainInRadius = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
        data: {},
        err: {},
      });
    }
    const captains = await getCaptainsInTheRadius(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius)
    );
    return res.status(200).json({
      success: true,
      message: "Get captain in radius is successfull",
      data: captains,
      err: {},
    });
  } catch (error) {
    console.error("Error in captaininradius controller :", error);
    return res.status(500).json({
      message: "Something went wrong in captaininradius controller",
      success: false,
      err: error,
    });
  }
};

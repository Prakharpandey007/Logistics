import express from 'express';
import { signupController, loginController,getCachedLoginController,getUserProfileController,logoutController} from '../../controllers/authcontroller.js';
import {driverLoginController,driverSignupController,getCachedDriverLoginController,getDriverProfileController,logoutDriverController} from '../../controllers/driverauthcontroller.js'
import { fillDriverDetailsController,sendOtpController,verifyOtpContrller } from '../../controllers/drivercontroller.js';
import {createRide,confirmRide,startRide,endRide,getFareController} from '../../controllers/bookingcontroller.js'
import{getLocation,getdistime,getAutocompletesuggestions,captainInRadius} from '../../controllers/mapcontroller.js'
import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();
//User routes
router.post("/user/signup", signupController);
router.post("/user/login", loginController);
router.get("/user/logout",authenticate,logoutController);
router.get("/user/getprofile",authenticate,getUserProfileController);
router.get("/cachedlogin/:userId",getCachedLoginController); 

//driver routes 
router.post("/driver/signup",driverSignupController);
router.post("/driver/login",driverLoginController);
router.get("/cachedlogin/:driverId",getCachedDriverLoginController);
router.get("/driver/logout",authenticate,logoutDriverController);
router.get("/driver/getdriverprofile",authenticate,getDriverProfileController);
router.post("/driver/details/sendOtp", sendOtpController);
router.post("/driver/details/verifyOtp", verifyOtpContrller);
router.post("/driver/details",authenticate,fillDriverDetailsController);


// booking routes 
router.post("/bookings/createbooking", authenticate, createRide);
router.post("/bookings/confirmbooking", authenticate, confirmRide);
router.post("/bookings/startbooking", authenticate, startRide);
router.post("/bookings/endbooking", authenticate, endRide);
router.get('/bookings/getfare',authenticate,getFareController);
router.get("/map/geolocation",authenticate,getLocation);
router.get('/map/distime',authenticate,getdistime);

router.get('/map/autosuggestions',authenticate,getAutocompletesuggestions);
router.get('/map/captaininradius',authenticate,captainInRadius);
export default router;

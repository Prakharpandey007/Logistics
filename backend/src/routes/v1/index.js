import express from 'express';
import { signupController, loginController,getCachedLoginController} from '../../controllers/authcontroller.js';
import {driverLoginController,driverSignupController,getCachedDriverLoginController} from '../../controllers/driverauthcontroller.js'
import { fillDriverDetailsController,sendOtpController,verifyOtpContrller } from '../../controllers/drivercontroller.js';
import {createRide,confirmRide,startRide,endRide} from '../../controllers/bookingcontroller.js'
import{getLocation,getdistime,getAutocompletesuggestions,captainInRadius} from '../../controllers/mapcontroller.js'
import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();
router.post("/user/signup", signupController);
router.post("/user/login", loginController);
router.post("/driver/signup",driverSignupController);
router.post("/driver/login",driverLoginController);
router.get("/cachedlogin/:userId",getCachedLoginController); 
router.get("/cachedlogin/:driverId",getCachedDriverLoginController);
router.post("/driver/details/sendOtp", sendOtpController);
router.post("/driver/details/verifyOtp", verifyOtpContrller);
router.post("/driver/details",authenticate,fillDriverDetailsController);
router.post("/bookings/createbooking", authenticate, createRide);
router.post("/bookings/confirmbooking", authenticate, confirmRide);
router.post("/bookings/startbooking", authenticate, startRide);
router.post("/bookings/endbooking", authenticate, endRide);
router.get("/user/geolocation",authenticate,getLocation);
router.get('/user/distime',authenticate,getdistime);
router.get('/user/autosuggestions',authenticate,getAutocompletesuggestions);
router.get('/user/captaininradius',authenticate,captainInRadius);
export default router;

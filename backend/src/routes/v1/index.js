import express from 'express';
import { signupController, loginController, cachedlogin } from '../../controllers/authcontroller.js';
import { fillDriverDetailsController,sendOtpController,verifyOtpContrller } from '../../controllers/drivercontroller.js';
import {createRide,confirmRide,startRide,endRide} from '../../controllers/bookingcontroller.js'
import {authenticate} from '../../middlewares/authenticate.js';

const router = express.Router();
router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/cachedlogin/:userId", cachedlogin); 
router.post("/driver/details/sendOtp", sendOtpController);
router.post("/driver/details/verifyOtp", verifyOtpContrller);
router.post("/driver/details",authenticate,fillDriverDetailsController);
router.post("/bookings/createbooking", authenticate, createRide);
router.post("/bookings/confirmbooking", authenticate, confirmRide);
router.post("/bookings/startbooking", authenticate, startRide);
router.post("/bookings/endbooking", authenticate, endRide);
export default router;

import express from 'express';
import { signupController, loginController, cachedlogin } from '../../controllers/authcontroller.js';

const router = express.Router();
router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/cachedlogin/:userId", cachedlogin); 
export default router;

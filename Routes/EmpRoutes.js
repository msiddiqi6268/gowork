import express from 'express'
const router = express.Router();
import { get_pricing, save_profile,send_profile } from '../Controllers/EmpController.js';


router.get('/get-pricing',get_pricing)
router.post('/send-employer-profile',save_profile)
router.get('/get-employer-profile',send_profile)


export default router;
import express from 'express'
const router = express.Router();
import { get_pricing,set_pricing, set_profile_image } from '../Controllers/generalController.js';


router.get('/get-pricing',get_pricing)
router.post('/set-pricing',set_pricing)
router.post('/profile-image',set_profile_image)



export default router;
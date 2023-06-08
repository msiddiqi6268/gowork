import express from 'express'
const router = express.Router();
import { get_pricing, save_profile,send_profile,get_candidates,get_candidate_details,send_offer,send_dashboard_data, send_offers_data,get_candidate_full_details } from '../Controllers/EmpController.js';


router.get('/get-pricing',get_pricing)
router.post('/send-employer-profile',save_profile)
router.get('/get-employer-profile',send_profile)
router.get('/get-candidates',get_candidates)
router.post('/get-candidates-details',get_candidate_details)
router.post('/get-candidates-full-details',get_candidate_full_details)
router.post('/send-offer',send_offer)
router.get('/dashboard-data',send_dashboard_data)
router.get('/offers',send_offers_data)

export default router;
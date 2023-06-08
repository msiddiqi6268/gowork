import express from 'express'
const router = express.Router();
import { get_pricing,set_pricing, set_profile_image, logout, getBlog,getAllBlogs,reset_password_link,reset_password} from '../Controllers/generalController.js';


router.get('/get-pricing',get_pricing)
router.post('/set-pricing',set_pricing)
router.post('/profile-image',set_profile_image)
router.post('/logout',logout)
router.get('/getblog/:slug',getBlog)
router.get('/getblogs',getAllBlogs)
router.post('/email-exists',reset_password_link)
router.post('/reset-password',reset_password)

export default router;
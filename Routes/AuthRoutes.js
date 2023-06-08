import express from 'express'
import { login, register, getOtp, verify, resend_verification_email , adminLogin,
refreshToken, logout, access_token} from '../Controllers/AuthController.js';
import { verifyRefreshToken } from '../helpers/JwtHelper.js';
const router = express.Router();


router.post('/login',login)
router.post('/register',register)
router.post('/refresh-token',  refreshToken)
router.post('/access-token',access_token)
router.delete('/logout',logout)
router.post('/verify',verify)
router.get('/resend-verification-email',resend_verification_email)



// ----------ADMIN------------

router.post('/admin-login',adminLogin)

export default router
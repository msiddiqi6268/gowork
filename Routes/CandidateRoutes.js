import express from 'express'
import { send_personal_info,get_personal_info,
    send_education_info,get_education_info,
    send_experience_info ,get_experience_info,
    send_about_info ,get_about_info,
    send_skills_info ,get_skills_info,
    send_dashboard_data
} 
    from '../Controllers/CandidateController.js';
const router = express.Router();


router.post('/send-personal-info',send_personal_info)
router.get('/get-personal-info',get_personal_info)

router.post('/send-education-info',send_education_info)
router.get('/get-education-info',get_education_info)

router.post('/send-experience-info',send_experience_info)
router.get('/get-experience-info',get_experience_info)


router.post('/send-skills-info',send_skills_info)
router.get('/get-skills-info',get_skills_info)

router.post('/send-about-info',send_about_info)
router.get('/get-about-info',get_about_info)

router.get('/dashboard_data',send_dashboard_data)


export default router
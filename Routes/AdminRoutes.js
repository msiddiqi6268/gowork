import express from 'express'
const router = express.Router();
import { set_pricing, admin_dashboard, getEmployerList,getBlogs,addBlogs,updateBlogs } from '../Controllers/AdminController.js';


router.post('/set-pricing',set_pricing)
router.get('/dashboard-data',admin_dashboard)
router.get('/employers_list',getEmployerList)
router.get('/blogs/getlist',getBlogs)
router.post('/blogs/add',addBlogs)
router.post('/blogs/update',updateBlogs)


export default router;
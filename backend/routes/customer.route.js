import addCustomerController from '../controllers/customer.controller.js';
import { Router } from 'express';

const router =  Router();


router.route('/').post(addCustomerController) 
 

export default router

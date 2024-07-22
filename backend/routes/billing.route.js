import  { addBillingData, allbills } from '../controllers/billing.controller.js';
import { Router } from 'express';

const router =  Router();


router.route('/').post(addBillingData) 
router.route('/allbills').get(allbills) 

 

export default router

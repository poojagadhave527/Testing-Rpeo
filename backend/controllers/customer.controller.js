import { Customer } from "../models/Customer.model.js";
 

const addCustomerController = async (req, res) => {
    try {
      const { name, contactNumber } = req.body;
      const existing=await Customer.findOne({ contactNumber: contactNumber });
      if (existing) {
        res.status(201).send(existing);
        
      }else{
        const customer = new Customer(req.body);
         
        await customer.save();
         
        
        res.status(201).send(customer);
        
      }
      
       
       
      } catch (error) {
         
        res.status(400).send(error);
      }
}
export default addCustomerController;


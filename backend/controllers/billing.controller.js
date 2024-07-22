import { Billing } from "../models/Billing.model.js";

const addBillingData = async (req, res) => {
  try {
    const billing = new Billing(req.body);
    await billing.save();
    res.status(201).send(billing);
  } catch (error) {
    res.status(400).send(error);
  }
}

const allbills = async (req, res) => {
  console.log('@@@@@ 111111');
  try {
    const billing = await Billing.find().populate('customerId');
    res.status(200).send(billing);
    console.log('@@@@@@@@ complated');
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
export {addBillingData,allbills} ;


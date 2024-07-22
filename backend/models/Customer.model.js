import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
});


export const Customer = mongoose.model("Customer", customerSchema)


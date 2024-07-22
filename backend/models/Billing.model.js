import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
         required: true
    },
    items: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
    paymentMode: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    discountAmount: {
        type: Number,
        require: true
        
    },
    tax: {
        type: Number,
        require: true
        
    },
    netTotal: {
        type: Number,
        require: true
        
    },
    totalWithTax: {
        type: Number,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
   
});

export const Billing = mongoose.model("Billing", billingSchema)

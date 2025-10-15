import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User' , required:true},
    carId: {type:mongoose.Schema.Types.ObjectId, ref: 'Car' , required:true},
    paymentId: {type: String, required: true},
    amount: {type: Number, required: true},
    type : {type: String, enum :['Seller-Details','Add-cars'],required:true},
    status: {type: String, enum: ['Pending', 'Completed'], default: 'Pending'},
},{ timestamps:true });

export default mongoose.model('Payment', paymentSchema);

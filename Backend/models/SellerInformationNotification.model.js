import mongoose from "mongoose";

const SellerIformationNotificationSchema = new mongoose.Schema({
    buyerId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    carId : {type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true},
    sellerId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    sellerName : {type:String},
    sellerEmail : {type:String},
    sellerPhone : {type:String},
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // link to chat
    type: { type: String, default: "interested" }, // can have values like 'interested', 'message'
    createdAt : {type: Date, default: Date.now},
    viewed : {type: Boolean, default: false}

});

export default mongoose.model('SellerInformationNotification', SellerIformationNotificationSchema);
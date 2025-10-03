import SellerInformationNotificationModel from "../models/SellerInformationNotification.model.js";

export const addSellerInformationNotification = async (req, res) => {
  try {
    const seller = new SellerInformationNotificationModel(req.body);
    await seller.save();
    res.status(201).json(seller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSellerInformationNotificationByBuyerId = async (req, res) => {
  try {
    const seller = await SellerInformationNotificationModel.find({ buyerId: req.params.id });

    if (!seller || seller.length === 0) {
      return res.status(404).json({ message: "No notifications found for this buyer." });
    }

    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Check if notification already exists
export const checkSellerNotification = async (req, res) => {
  try {
    const { buyerId, carId } = req.params;

    const exists = await SellerInformationNotificationModel.findOne({
      buyerId,
      carId
    });

    res.status(200).json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const checkview = async (req,res) => {
    try {
        const {userId} = req.params;
        const count = await SellerInformationNotificationModel.countDocuments({ buyerId: userId, viewed:false });
        res.json({ count });
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};


export const markAsViewed = async (req,res) => {
    try {
        const {userId} = req.params;
        await SellerInformationNotificationModel.updateMany({ buyerId: userId, viewed:false }, { viewed: true });
        res.status(200).json({message: "Notifications marked as viewed"});  
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
};
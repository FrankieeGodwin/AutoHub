import UserActivity from '../models/UserActivity.model.js';

export const createUserActivity = async (req,res) => {
    try{
        const {userId,carId,role} = req.body;

        const activity = new UserActivity({userId,carId,role});
        await activity.save();

        res.status(201).json(activity);
    }
    catch(err){
        res.status(404).json({message:err.message});
    }
};

export const getAllActivities = async(req,res) => {
    try {
        const activity=await UserActivity.find()
            .populate('userId','fullName emailId')
            .populate('carId','make model');
        
        res.status(200).json(activity);
    }
    catch(err){
        res.status(404).json({message:err.message});
    }
}


export const getActivityById = async(req,res) => {
    try{
    const acivityById = await UserActivity.findById(req.params.id)
        .populate('userId','fullName emailId')
        .populate('carId','make model');

    if(!activityById) return res.status(404).json({message:"User not found"});

    res.status(201).json(activityById);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

export const getActivityByUserId = async(req,res) =>{
    try{
        const activities = await UserActivity.find({userId : req.params.userId});
        if(!activities) return res.status(404).json({message:"No Activities"});
        return res.status(200).json(activities);
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
}

export const updateActivity = async (req, res) => {
  try {
    const { userId, carId, role } = req.body;

    const updatedActivity = await UserActivity.findByIdAndUpdate(
      req.params.id,
      { userId, carId, role },
      { new: true, runValidators: true }
    )
      .populate('userId', 'fullName emailId')
      .populate('carId', 'make model');

    if (!updatedActivity)
      return res.status(404).json({ message: 'Activity not found' });

    res.status(200).json(updatedActivity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteActivity = async(req,res) => {
    try{
        const deletedActivity = await UserActivity.findByIdAndDelete(req.params.id);

        if(!deletedActivity) return res.status(404).json({message:"Activity not found"});

        res.status(200).json({message:"Activity is deleted"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

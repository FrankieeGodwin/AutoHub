import mongoose from 'mongoose';

const UserActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    role: { type: String, enum: ['User', 'Dealer'], required: true }
}, { timestamps: true });

export default mongoose.model('UserActivity', UserActivitySchema);

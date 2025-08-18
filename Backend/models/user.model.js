import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  passwordHash: { type: String, required: true }
},{ timestamps : true });

export default mongoose.model('User', userSchema);
import mongoose from 'mongoose';
import UserDetails from './userDetails.model.js'; 

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

userSchema.pre('findOneAndDelete', async function(next) {
  const userId = this.getQuery()["_id"];
  if (userId) {
    await UserDetails.deleteOne({ userId });
  }
  next();
});

export default mongoose.model('User', userSchema);

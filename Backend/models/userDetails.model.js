import mongoose from 'mongoose';

const userDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carsBought: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  carsSold: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
});

export default mongoose.model('UserDetails', userDetailsSchema);

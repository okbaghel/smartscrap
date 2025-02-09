import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk User ID
  name: String,
  email: String,
  creditPoints: { type: Number, default: 0 }, // Add Credit Points
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

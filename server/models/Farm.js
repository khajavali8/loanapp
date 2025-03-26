import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  farmType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  images: [{
    type: String,
  }],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document", 
    },
  ],
  status: {
    type: String,
    enum: ['active', 'funded', 'completed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
export default mongoose.model('Farm', farmSchema); 
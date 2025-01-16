import mongoose from 'mongoose';

const veterinarianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  availableDays: {
    type: [String],
    required: true,
  },
  availableHours: {
    type: [String],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

export const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema);

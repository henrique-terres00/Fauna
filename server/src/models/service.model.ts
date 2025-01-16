import { Schema, model } from 'mongoose';
import { IService } from '../types/service.types';

const serviceSchema = new Schema<IService>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // duração em minutos
    required: true,
    min: 15
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Atualiza o updatedAt antes de salvar
serviceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default model<IService>('Service', serviceSchema);

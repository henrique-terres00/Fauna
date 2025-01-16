import mongoose from 'mongoose';

export interface ITestimonial {
  _id: string;
  name: string;
  pet: string;
  petType: string;
  image: string;
  text: string;
  rating: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new mongoose.Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    pet: { type: String, required: true },
    petType: { type: String, required: true },
    image: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

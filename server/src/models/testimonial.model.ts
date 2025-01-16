import { Schema, model } from 'mongoose';

interface ITestimonial {
  name: string;
  pet: string;
  text: string;
  rating: number;
  image?: string;
  active: boolean;
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  pet: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<ITestimonial>('Testimonial', testimonialSchema);

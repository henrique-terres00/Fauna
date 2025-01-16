import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import appointmentRoutes from './routes/appointment.routes';
import veterinarianRoutes from './routes/veterinarian.routes';
import servicesRoutes from './routes/services.routes';
import testimonialRoutes from './routes/testimonial.routes';
import authRoutes from './routes/auth.routes';
import { createInitialAdmin } from './controllers/auth.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fauna')
  .then(async () => {
    console.log('Connected to MongoDB');
    // Criar usuário admin inicial
    await createInitialAdmin();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Basic route for testing
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Fauna API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Frontend URL: ${corsOrigin}`);
});

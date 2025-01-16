import { Router } from 'express';
import appointmentRoutes from './appointment.routes';
import serviceRoutes from './services.routes';
import veterinarianRoutes from './veterinarian.routes';
import testimonialRoutes from './testimonial.routes';
import contactRoutes from './contact.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/veterinarians', veterinarianRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact', contactRoutes);
router.use('/auth', authRoutes);

export default router;

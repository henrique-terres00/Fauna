import { Router } from 'express';
import { 
  listTestimonials, 
  createTestimonial, 
  updateTestimonialStatus,
  deleteTestimonial
} from '../controllers/testimonial.controller';

const router = Router();

router.get('/', listTestimonials);
router.post('/', createTestimonial);
router.patch('/:id/status', updateTestimonialStatus);
router.delete('/:id', deleteTestimonial);

export default router;

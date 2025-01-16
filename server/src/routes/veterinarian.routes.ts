import express from 'express';
import {
  createVeterinarian,
  getVeterinarians,
  getVeterinarianById,
  updateVeterinarian,
  deleteVeterinarian,
} from '../controllers/veterinarian.controller';

const router = express.Router();

router.post('/', createVeterinarian);
router.get('/', getVeterinarians);
router.get('/:id', getVeterinarianById);
router.put('/:id', updateVeterinarian);
router.delete('/:id', deleteVeterinarian);

export default router;

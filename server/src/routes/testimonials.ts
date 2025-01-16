import express from 'express';
import { Testimonial } from '../models/Testimonial';

const router = express.Router();

// Listar todos os depoimentos ativos
router.get('/', async (_req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar depoimentos' });
  }
});

// Criar novo depoimento
router.post('/', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    const savedTestimonial = await testimonial.save();
    return res.status(201).json(savedTestimonial);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao criar depoimento' });
  }
});

// Atualizar depoimento
router.put('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Depoimento não encontrado' });
    }
    return res.json(testimonial);
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao atualizar depoimento' });
  }
});

// Deletar depoimento (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Depoimento não encontrado' });
    }
    return res.json({ message: 'Depoimento removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao remover depoimento' });
  }
});

export default router;

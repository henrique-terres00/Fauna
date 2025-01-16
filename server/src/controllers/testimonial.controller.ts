import { Request, Response } from 'express';
import Testimonial from '../models/testimonial.model';

// Listar todos os depoimentos
export const listTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find()
      .sort('-createdAt')
      .limit(20);
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Criar um novo depoimento
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = new Testimonial({
      name: req.body.name,
      pet: req.body.pet,
      text: req.body.text,
      rating: req.body.rating,
      image: req.body.image
    });

    const newTestimonial = await testimonial.save();
    return res.status(201).json(newTestimonial);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

// Atualizar status do depoimento (ativar/desativar)
export const updateTestimonialStatus = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Depoimento não encontrado' });
    }

    testimonial.active = req.body.active;
    await testimonial.save();
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Deletar um depoimento
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Depoimento não encontrado' });
    }
    return res.status(200).json({ message: 'Depoimento removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

import { Request, Response } from 'express';
import { Veterinarian } from '../models/veterinarian.model';

export const createVeterinarian = async (req: Request, res: Response): Promise<void> => {
  try {
    const veterinarian = new Veterinarian(req.body);
    await veterinarian.save();
    res.status(201).json(veterinarian);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Erro ao criar veterinário' });
  }
};

export const getVeterinarians = async (_req: Request, res: Response): Promise<void> => {
  try {
    const veterinarians = await Veterinarian.find();
    res.json(veterinarians);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao buscar veterinários' });
  }
};

export const getVeterinarianById = async (req: Request, res: Response): Promise<void> => {
  try {
    const veterinarian = await Veterinarian.findById(req.params.id);
    if (!veterinarian) {
      res.status(404).json({ message: 'Veterinário não encontrado' });
      return;
    }
    res.json(veterinarian);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao buscar veterinário' });
  }
};

export const updateVeterinarian = async (req: Request, res: Response): Promise<void> => {
  try {
    const veterinarian = await Veterinarian.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!veterinarian) {
      res.status(404).json({ message: 'Veterinário não encontrado' });
      return;
    }
    res.json(veterinarian);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Erro ao atualizar veterinário' });
  }
};

export const deleteVeterinarian = async (req: Request, res: Response): Promise<void> => {
  try {
    const veterinarian = await Veterinarian.findByIdAndDelete(req.params.id);
    if (!veterinarian) {
      res.status(404).json({ message: 'Veterinário não encontrado' });
      return;
    }
    res.json({ message: 'Veterinário removido com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao remover veterinário' });
  }
};

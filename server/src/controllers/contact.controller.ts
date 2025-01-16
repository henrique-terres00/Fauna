import { Request, Response } from 'express';
import { Contact } from '../models/contact.model';

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ message: 'Erro ao criar contato' });
  }
};

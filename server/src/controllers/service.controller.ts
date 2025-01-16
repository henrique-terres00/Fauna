import { Request, Response } from 'express';
import Service from '../models/service.model';
import { ServiceInput } from '../types/service.types';

// Listar todos os serviços ativos
export const listServices = async (_req: Request, res: Response) => {
  try {
    const services = await Service.find({ active: true }).sort('title');
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Obter um serviço específico
export const getService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Criar um novo serviço
export const createService = async (req: Request<{}, {}, ServiceInput>, res: Response) => {
  const serviceData: ServiceInput = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    duration: req.body.duration,
    icon: req.body.icon
  };

  try {
    const service = new Service(serviceData);
    const newService = await service.save();
    return res.status(201).json(newService);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

// Atualizar um serviço
export const updateService = async (req: Request<{ id: string }, {}, Partial<ServiceInput>>, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Atualiza apenas os campos fornecidos
    Object.assign(service, req.body);

    const updatedService = await service.save();
    return res.json(updatedService);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

// Deletar um serviço
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    return res.status(200).json({ message: 'Serviço removido com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

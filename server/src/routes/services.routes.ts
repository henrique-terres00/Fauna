import { Router } from 'express';
import {
  listServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/service.controller';

const router = Router();

// Listar todos os serviços ativos
router.get('/', listServices);

// Obter um serviço específico
router.get('/:id', getService);

// Criar um novo serviço
router.post('/', createService);

// Atualizar um serviço
router.put('/:id', updateService);

// Deletar um serviço (soft delete)
router.delete('/:id', deleteService);

export default router;

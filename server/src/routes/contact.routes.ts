import { Router } from 'express';
import * as contactController from '../controllers/contact.controller';

const router = Router();

router.post('/', contactController.createContact);

export default router;

import { Router } from 'express';
import {
  getAllBoletas,
  getBoletaById,
  createBoleta,
  updateBoleta,
  deleteBoleta
} from '../controllers/boletaController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { boletaValidator, idValidator } from '../middleware/validators.js';

const router = Router();

router.get('/', authenticate, getAllBoletas);
router.get('/:id', authenticate, idValidator, getBoletaById);
router.post('/', authenticate, boletaValidator, createBoleta);
router.put('/:id', authenticate, authorize('Administrador', 'Vendedor'), idValidator, updateBoleta);
router.delete('/:id', authenticate, authorize('Administrador'), idValidator, deleteBoleta);

export default router;

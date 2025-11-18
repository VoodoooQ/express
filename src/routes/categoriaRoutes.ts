import { Router } from 'express';
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoriaController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { categoryValidator, idValidator } from '../middleware/validators.js';

const router = Router();

router.get('/', getAllCategorias);
router.get('/:id', idValidator, getCategoriaById);
router.post('/', authenticate, authorize('Administrador', 'Vendedor'), categoryValidator, createCategoria);
router.put('/:id', authenticate, authorize('Administrador', 'Vendedor'), idValidator, updateCategoria);
router.delete('/:id', authenticate, authorize('Administrador'), idValidator, deleteCategoria);

export default router;

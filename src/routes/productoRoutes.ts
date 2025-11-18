import { Router } from 'express';
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/productoController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { productValidator, idValidator } from '../middleware/validators.js';

const router = Router();

router.get('/', getAllProductos);
router.get('/:id', idValidator, getProductoById);
router.post('/', authenticate, authorize('Administrador', 'Vendedor'), productValidator, createProducto);
router.put('/:id', authenticate, authorize('Administrador', 'Vendedor'), idValidator, updateProducto);
router.delete('/:id', authenticate, authorize('Administrador'), idValidator, deleteProducto);

export default router;

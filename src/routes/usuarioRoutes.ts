import { Router } from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuarioController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { idValidator } from '../middleware/validators.js';

const router = Router();

router.get('/', authenticate, authorize('Administrador'), getAllUsuarios);
router.get('/:id', authenticate, idValidator, getUsuarioById);
router.put('/:id', authenticate, idValidator, updateUsuario);
router.delete('/:id', authenticate, authorize('Administrador'), idValidator, deleteUsuario);

export default router;

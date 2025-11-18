import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../middleware/validators.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', getMe);

export default router;

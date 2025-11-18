import { body, param, ValidationChain } from 'express-validator';

export const registerValidator: ValidationChain[] = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['Cliente', 'Vendedor', 'Administrador']).withMessage('Rol inválido')
];

export const loginValidator: ValidationChain[] = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

export const productValidator: ValidationChain[] = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('categoria_id').isInt().withMessage('La categoría es requerida')
];

export const categoryValidator: ValidationChain[] = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido')
];

export const boletaValidator: ValidationChain[] = [
  body('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('detalles.*.producto_id').isInt().withMessage('ID de producto inválido'),
  body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0')
];

export const idValidator: ValidationChain[] = [
  param('id').isInt().withMessage('ID inválido')
];

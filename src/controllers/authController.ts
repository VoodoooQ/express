import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { Usuario } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 días en segundos

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [Cliente, Vendedor, Administrador]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { nombre, email, password, rol = 'Cliente' } = req.body;

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      res.status(400).json({ message: 'El email ya está registrado' });
      return;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password: hashedPassword, rol }])
      .select()
      .single();

    if (error) throw error;

    // Generar token
    const token = jwt.sign(
      { userId: data.id, email: data.email, rol: data.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_SECONDS }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_SECONDS }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, created_at')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
};

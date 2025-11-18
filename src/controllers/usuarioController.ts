import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
export const getAllUsuarios = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error en getAllUsuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 */
export const getUsuarioById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *       200:
 *         description: Usuario actualizado
 */
export const updateUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    // Solo admin puede cambiar roles, o el mismo usuario puede editar su info
    if (req.user?.userId !== parseInt(id) && req.user?.rol !== 'Administrador') {
      res.status(403).json({ message: 'No autorizado' });
      return;
    }

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (rol && req.user?.rol === 'Administrador') updateData.rol = rol;

    const { data, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select('id, nombre, email, rol')
      .single();

    if (error) throw error;

    res.json({ message: 'Usuario actualizado exitosamente', user: data });
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario (solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
export const deleteUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

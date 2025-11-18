import { Response } from 'express';
import { validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
export const getAllCategorias = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error en getAllCategorias:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 */
export const getCategoriaById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Error en getCategoriaById:', error);
    res.status(500).json({ message: 'Error al obtener categoría' });
  }
};

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría (Admin/Vendedor)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
export const createCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { nombre, descripcion } = req.body;

    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nombre, descripcion }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Categoría creada exitosamente', categoria: data });
  } catch (error) {
    console.error('Error en createCategoria:', error);
    res.status(500).json({ message: 'Error al crear categoría' });
  }
};

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría (Admin/Vendedor)
 *     tags: [Categorias]
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
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
export const updateCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;

    const { data, error } = await supabase
      .from('categorias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Categoría actualizada exitosamente', categoria: data });
  } catch (error) {
    console.error('Error en updateCategoria:', error);
    res.status(500).json({ message: 'Error al actualizar categoría' });
  }
};

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría (Admin)
 *     tags: [Categorias]
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
 *         description: Categoría eliminada
 */
export const deleteCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteCategoria:', error);
    res.status(500).json({ message: 'Error al eliminar categoría' });
  }
};

import { Response } from 'express';
import { validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de productos
 */
export const getAllProductos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoria_id } = req.query;

    // Intentar con JOIN primero, si falla, intentar sin JOIN
    let query = supabase
      .from('productos')
      .select('*, categorias(id, nombre)')
      .order('created_at', { ascending: false });

    if (categoria_id) {
      query = query.eq('categoria_id', categoria_id);
    }

    let { data, error } = await query;

    // Si el JOIN falla, intentar sin JOIN (puede ser que la relación no esté configurada)
    if (error && (error.message?.includes('relation') || error.message?.includes('foreign key'))) {
      console.warn('⚠️ JOIN con categorias falló, intentando sin JOIN:', error.message);
      
      // Intentar sin JOIN
      query = supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoria_id) {
        query = query.eq('categoria_id', categoria_id);
      }

      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('❌ Error en getAllProductos:', error);
      res.status(500).json({ 
        message: 'Error al obtener productos',
        error: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : undefined
      });
      return;
    }

    res.json(data || []);
  } catch (error: any) {
    console.error('❌ Error en getAllProductos:', error);
    res.status(500).json({ 
      message: 'Error al obtener productos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 */
export const getProductoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Intentar con JOIN primero
    let { data, error } = await supabase
      .from('productos')
      .select('*, categorias(id, nombre)')
      .eq('id', id)
      .single();

    // Si el JOIN falla, intentar sin JOIN
    if (error && (error.message?.includes('relation') || error.message?.includes('foreign key'))) {
      console.warn('⚠️ JOIN con categorias falló, intentando sin JOIN');
      const result = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      console.error('❌ Error en getProductoById:', error);
      res.status(404).json({ 
        message: 'Producto no encontrado',
        error: process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : undefined
      });
      return;
    }

    res.json(data);
  } catch (error: any) {
    console.error('❌ Error en getProductoById:', error);
    res.status(500).json({ 
      message: 'Error al obtener producto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto (Admin/Vendedor)
 *     tags: [Productos]
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
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 */
export const createProducto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

    const { data, error } = await supabase
      .from('productos')
      .insert([{ nombre, descripcion, precio, stock, categoria_id, imagen_url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Producto creado exitosamente', producto: data });
  } catch (error) {
    console.error('Error en createProducto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto (Admin/Vendedor)
 *     tags: [Productos]
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
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
export const updateProducto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (precio !== undefined) updateData.precio = precio;
    if (stock !== undefined) updateData.stock = stock;
    if (categoria_id) updateData.categoria_id = categoria_id;
    if (imagen_url !== undefined) updateData.imagen_url = imagen_url;

    const { data, error } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Producto actualizado exitosamente', producto: data });
  } catch (error) {
    console.error('Error en updateProducto:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto (Admin)
 *     tags: [Productos]
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
 *         description: Producto eliminado
 */
export const deleteProducto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteProducto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

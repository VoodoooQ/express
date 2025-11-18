import { Response } from 'express';
import { validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { AuthRequest } from '../types/index.js';

/**
 * @swagger
 * /api/boletas:
 *   get:
 *     summary: Obtener todas las boletas
 *     tags: [Boletas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de boletas
 */
export const getAllBoletas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query = supabase
      .from('boletas')
      .select('*, usuarios(id, nombre, email)')
      .order('created_at', { ascending: false });

    // Si es cliente, solo ver sus propias boletas
    if (req.user?.rol === 'Cliente') {
      query = query.eq('usuario_id', req.user.userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error en getAllBoletas:', error);
    res.status(500).json({ message: 'Error al obtener boletas' });
  }
};

/**
 * @swagger
 * /api/boletas/{id}:
 *   get:
 *     summary: Obtener una boleta por ID con sus detalles
 *     tags: [Boletas]
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
 *         description: Boleta encontrada
 */
export const getBoletaById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: boleta, error: boletaError } = await supabase
      .from('boletas')
      .select('*, usuarios(id, nombre, email)')
      .eq('id', id)
      .single();

    if (boletaError || !boleta) {
      res.status(404).json({ message: 'Boleta no encontrada' });
      return;
    }

    // Verificar permisos
    if (req.user?.rol === 'Cliente' && boleta.usuario_id !== req.user.userId) {
      res.status(403).json({ message: 'No autorizado' });
      return;
    }

    const { data: detalles, error: detallesError } = await supabase
      .from('detalle_boletas')
      .select('*, productos(id, nombre, precio, imagen_url)')
      .eq('boleta_id', id);

    if (detallesError) throw detallesError;

    res.json({ ...boleta, detalles });
  } catch (error) {
    console.error('Error en getBoletaById:', error);
    res.status(500).json({ message: 'Error al obtener boleta' });
  }
};

/**
 * @swagger
 * /api/boletas:
 *   post:
 *     summary: Crear una nueva boleta
 *     tags: [Boletas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Boleta creada
 */
export const createBoleta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { detalles } = req.body;
    const usuario_id = req.user!.userId;

    // Calcular total y verificar stock
    let total = 0;
    const detallesConPrecio = [];

    for (const detalle of detalles) {
      const { data: producto, error } = await supabase
        .from('productos')
        .select('precio, stock')
        .eq('id', detalle.producto_id)
        .single();

      if (error || !producto) {
        res.status(404).json({ message: `Producto ${detalle.producto_id} no encontrado` });
        return;
      }

      if (producto.stock < detalle.cantidad) {
        res.status(400).json({ message: `Stock insuficiente para producto ${detalle.producto_id}` });
        return;
      }

      const subtotal = producto.precio * detalle.cantidad;
      total += subtotal;

      detallesConPrecio.push({
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: producto.precio,
        subtotal
      });
    }

    // Crear boleta
    const { data: boleta, error: boletaError } = await supabase
      .from('boletas')
      .insert([{
        usuario_id,
        fecha: new Date().toISOString(),
        total,
        estado: 'Pendiente'
      }])
      .select()
      .single();

    if (boletaError) throw boletaError;

    // Crear detalles
    const detallesConBoletaId = detallesConPrecio.map(d => ({
      ...d,
      boleta_id: boleta.id
    }));

    const { error: detallesError } = await supabase
      .from('detalle_boletas')
      .insert(detallesConBoletaId);

    if (detallesError) throw detallesError;

    // Actualizar stock
    for (const detalle of detalles) {
      const { data: producto } = await supabase
        .from('productos')
        .select('stock')
        .eq('id', detalle.producto_id)
        .single();

      await supabase
        .from('productos')
        .update({ stock: producto!.stock - detalle.cantidad })
        .eq('id', detalle.producto_id);
    }

    res.status(201).json({ message: 'Boleta creada exitosamente', boleta });
  } catch (error) {
    console.error('Error en createBoleta:', error);
    res.status(500).json({ message: 'Error al crear boleta' });
  }
};

/**
 * @swagger
 * /api/boletas/{id}:
 *   put:
 *     summary: Actualizar estado de una boleta (Vendedor/Admin)
 *     tags: [Boletas]
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
 *               estado:
 *                 type: string
 *                 enum: [Pendiente, Completada, Cancelada]
 *     responses:
 *       200:
 *         description: Boleta actualizada
 */
export const updateBoleta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const { data, error } = await supabase
      .from('boletas')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Boleta actualizada exitosamente', boleta: data });
  } catch (error) {
    console.error('Error en updateBoleta:', error);
    res.status(500).json({ message: 'Error al actualizar boleta' });
  }
};

/**
 * @swagger
 * /api/boletas/{id}:
 *   delete:
 *     summary: Eliminar una boleta (Admin)
 *     tags: [Boletas]
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
 *         description: Boleta eliminada
 */
export const deleteBoleta = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Eliminar detalles primero
    await supabase.from('detalle_boletas').delete().eq('boleta_id', id);

    // Eliminar boleta
    const { error } = await supabase.from('boletas').delete().eq('id', id);

    if (error) throw error;

    res.json({ message: 'Boleta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteBoleta:', error);
    res.status(500).json({ message: 'Error al eliminar boleta' });
  }
};

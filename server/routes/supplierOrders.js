import express from 'express';
import supplierOrderController from '../controllers/supplierOrderController.js';

const router = express.Router();

// GET /api/supplier-orders - get all supplier orders (optionally by supplier or admin)
router.get('/', supplierOrderController.getAll);

// GET /api/supplier-orders/:id - get a single supplier order with items
router.get('/:id', supplierOrderController.getById);

// POST /api/supplier-orders - create a new supplier order (admin)
router.post('/', supplierOrderController.create);

// PATCH /api/supplier-orders/:id/status - update status (supplier/admin)
router.patch('/:id/status', supplierOrderController.updateStatus);

export default router; 
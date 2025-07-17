import SupplierOrder from '../models/supplierOrder.js';
import SupplierOrderItem from '../models/supplierOrderItem.js';

const supplierOrderController = {
  // GET all supplier orders (optionally by supplier or admin)
  async getAll(req, res) {
    try {
      const { supplierId, adminId } = req.query;
      const orders = await SupplierOrder.getAll({ supplierId, adminId });
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch supplier orders.' });
    }
  },

  // GET a single supplier order with items
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await SupplierOrder.getById(id);
      if (!order) return res.status(404).json({ error: 'Order not found.' });
      const items = await SupplierOrderItem.getBySupplierOrderId(id);
      res.json({ order, items });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch supplier order.' });
    }
  },

  // POST create a new supplier order (with items)
  async create(req, res) {
    try {
      const { supplier_id, ordered_by_admin_id, notes, items } = req.body;
      if (!supplier_id || !ordered_by_admin_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      const supplierOrderId = await SupplierOrder.create({ supplier_id, ordered_by_admin_id, notes });
      for (const item of items) {
        await SupplierOrderItem.create({
          supplier_order_id: supplierOrderId,
          variant_id: item.variant_id,
          quantity_ordered: item.quantity_ordered,
        });
      }
      res.status(201).json({ supplier_order_id: supplierOrderId });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create supplier order.' });
    }
  },

  // PATCH update status (Shipped, Cancelled, Delivered)
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }
      const updated = await SupplierOrder.updateStatus(id, status);
      if (!updated) return res.status(404).json({ error: 'Order not found.' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update status.' });
    }
  },
};

export default supplierOrderController; 
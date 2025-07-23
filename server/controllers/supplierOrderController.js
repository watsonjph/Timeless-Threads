import SupplierOrder from '../models/supplierOrder.js';
import SupplierOrderItem from '../models/supplierOrderItem.js';
import Supplier from '../models/supplier.js';
import ProductVariant from '../models/productVariant.js';
import { sendEmail } from '../utils/email.js';

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
      let { supplier_id, ordered_by_admin_id, notes, items } = req.body;
      supplier_id = Number(supplier_id);
      ordered_by_admin_id = Number(ordered_by_admin_id);
      items = (Array.isArray(items) ? items : []).filter(item =>
        item && Number(item.variant_id) && Number(item.quantity_ordered) > 0
      );
      if (!supplier_id || !ordered_by_admin_id || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or invalid items.' });
      }
      // Calculate total_amount
      let total_amount = 0;
      for (const item of items) {
        const variant = await ProductVariant.getById(item.variant_id);
        if (!variant) {
          return res.status(400).json({ error: `Product variant not found: ${item.variant_id}` });
        }
        if (variant.supplier_id !== supplier_id && variant.product_id) {
          const [productRows] = await ProductVariant.pool.query(
            'SELECT supplier_id FROM products WHERE product_id = ?',
            [variant.product_id]
          );
          if (!productRows.length || productRows[0].supplier_id !== supplier_id) {
            return res.status(400).json({ error: `Variant ${item.variant_id} does not belong to supplier ${supplier_id}` });
          }
        }
        // Get product price
        const [productRows] = await ProductVariant.pool.query(
          'SELECT price FROM products WHERE product_id = ?',
          [variant.product_id]
        );
        const price = productRows.length ? Number(productRows[0].price) : 0;
        total_amount += price * Number(item.quantity_ordered);
      }
      const supplierOrderId = await SupplierOrder.create({ supplier_id, ordered_by_admin_id, notes, total_amount });
      for (const item of items) {
        await SupplierOrderItem.create({
          supplier_order_id: supplierOrderId,
          variant_id: item.variant_id,
          quantity_ordered: item.quantity_ordered,
        });
      }
      // Fetch supplier email and order details for notification
      const supplier = await Supplier.getById(supplier_id);
      if (supplier && supplier.contact_email) {
        // Get product/variant details for the order
        const itemDetails = await Promise.all(items.map(async (item) => {
          const variant = await ProductVariant.getById(item.variant_id);
          return `- ${variant.product_name} (${variant.size || ''} ${variant.color || ''}) x ${item.quantity_ordered}`;
        }));
        const emailSubject = `New Order from Timeless Threads`;
        const emailText = `Hello ${supplier.contact_person || supplier.name},\n\nYou have received a new order from the admin.\n\nOrder Details:\n${itemDetails.join('\n')}\n\nPlease log in to your supplier portal to view and process this order.\n\nThank you!`;
        await sendEmail({
          to: supplier.contact_email,
          subject: emailSubject,
          text: emailText,
          html: `<p>Hello ${supplier.contact_person || supplier.name},</p><p>You have received a new order from the admin.</p><ul>${itemDetails.map(d => `<li>${d}</li>`).join('')}</ul><p>Please log in to your supplier portal to view and process this order.</p><p>Thank you!</p>`
        });
      }
      res.status(201).json({ supplier_order_id: supplierOrderId });
    } catch (err) {
      console.error('Supplier order creation error:', err);
      res.status(500).json({ error: 'Failed to create supplier order.', details: err.message });
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

  async delete(req, res) {
    try {
      const { id } = req.params;
      // Delete related supplier_order_items first
      await SupplierOrderItem.deleteBySupplierOrderId(id);
      // Then delete the supplier order
      const deleted = await SupplierOrder.remove(id);
      if (!deleted) return res.status(404).json({ error: 'Order not found.' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete supplier order.' });
    }
  },
};

export default supplierOrderController; 
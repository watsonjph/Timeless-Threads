import Order from '../models/order.js';
import User from '../models/user.js';
import ProductVariant from '../models/productVariant.js';
import SupplierOrder from '../models/supplierOrder.js';

const orderController = {
  async getUserOrders(req, res) {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    try {
      const orders = await Order.getOrdersByUserId(userId);
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  },

  async getOrderById(req, res) {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required.' });
    }
    try {
      const order = await Order.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      res.json({ order });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch order.' });
    }
  },

  async createOrder(req, res) {
    const { userId, items, shipping, payment, totalAmount } = req.body;
    
    if (!userId || !items || !shipping || !payment || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
      // Validate stock availability
      for (const item of items) {
        let variant;
        let variantId = item.variantId;
        
        // If variantId is not provided, look it up by SKU
        if (!variantId && item.sku) {
          variant = await ProductVariant.getBySku(item.sku);
          if (variant) {
            variantId = variant.variant_id;
            item.variantId = variantId; // Update the item with the found variantId
          }
        } else {
          variant = await ProductVariant.getById(variantId);
        }
        
        if (!variant) {
          return res.status(400).json({ error: `Product variant not found for SKU: ${item.sku || variantId}` });
        }
        
        const stock = await ProductVariant.getStockByVariantId(variantId);
        if (stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${variant.product_name}. Available: ${stock}, Requested: ${item.quantity}` 
          });
        }
      }

      // Create order
      const orderId = await Order.create({
        userId,
        totalAmount,
        shipping,
        payment
      });

      // Create order fulfillment entry
      await Order.createFulfillment(orderId);

      // Create order items and decrement stock
      for (const item of items) {
        await Order.createOrderItem({
          orderId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity
        });

        // Decrement stock
        await ProductVariant.decrementStock(item.variantId, item.quantity);
      }

      // Create payment record
      await Order.createPayment({
        orderId,
        amount: totalAmount,
        status: 'pending',
        referenceNumber: payment.referenceNumber || null
      });

      res.status(201).json({ 
        message: 'Order created successfully',
        orderId 
      });
    } catch (err) {
      console.error('Order creation error:', err);
      res.status(500).json({ error: 'Failed to create order.' });
    }
  },

  async markOrderCompleted(req, res) {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required.' });
    }
    try {
      // Check fulfillment status
      const [fulfillmentRows] = await Order.pool.query(
        `SELECT status FROM order_fulfillment WHERE order_id = ? ORDER BY order_fulfillment_id DESC LIMIT 1`,
        [orderId]
      );
      if (!fulfillmentRows.length || fulfillmentRows[0].status !== 'Delivered') {
        return res.status(400).json({ error: 'Order cannot be completed until it is delivered.' });
      }
      // Update order status
      const updated = await Order.updateStatus(orderId, 'Completed');
      if (!updated) {
        return res.status(404).json({ error: 'Order not found or could not be updated.' });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to mark order as completed.' });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await Order.getAllOrders();
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch all orders.' });
    }
  },

  async updateOrder(req, res) {
    const orderId = req.params.orderId;
    const fields = req.body;
    try {
      const updated = await Order.updateOrder(orderId, fields);
      if (!updated) return res.status(404).json({ error: 'Order not found or no fields updated.' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order.' });
    }
  },

  async updateFulfillmentStatus(req, res) {
    const orderId = req.params.orderId;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });
    try {
      const updated = await Order.updateFulfillmentStatus(orderId, status);
      if (!updated) return res.status(404).json({ error: 'Order fulfillment not found.' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update fulfillment status.' });
    }
  },

  async deleteOrder(req, res) {
    const orderId = req.params.orderId;
    try {
      const deleted = await Order.deleteOrder(orderId);
      if (!deleted) return res.status(404).json({ error: 'Order not found.' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete order.' });
    }
  },

  // Admin dashboard stats
  async adminDashboardStats(req, res) {
    try {
      console.log('Admin dashboard stats request received');
      
      const [totalUsers, totalOrders, completedOrders, lowStock] = await Promise.all([
        User.getTotal(),
        Order.getTotalOrders(),
        Order.getCompletedOrders(),
        ProductVariant.getLowStock(),
      ]);
      
      console.log('Admin dashboard stats calculated:', { totalUsers, totalOrders, completedOrders, lowStockCount: lowStock.length });
      
      // lowStock now includes stock_quantity and restock_threshold
      res.json({ totalUsers, totalOrders, completedOrders, lowStock });
    } catch (err) {
      console.error('Admin dashboard stats error:', err);
      res.status(500).json({ error: 'Failed to fetch dashboard stats.', details: err.message });
    }
  },

  // Supplier dashboard stats
  async supplierDashboardStats(req, res) {
    const supplierId = req.query.supplierId;
    if (!supplierId) return res.status(400).json({ error: 'Supplier ID required' });
    try {
      const [activeOrders, completedOrders] = await Promise.all([
        SupplierOrder.getActiveCount(supplierId),
        SupplierOrder.getCompletedCount(supplierId),
      ]);
      res.json({ activeOrders, completedOrders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch supplier dashboard stats.' });
    }
  },
};

export default orderController; 
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
        status: 'pending'
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
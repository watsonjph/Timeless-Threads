import Order from '../models/order.js';
import User from '../models/user.js';
import ProductVariant from '../models/productVariant.js';
import SupplierOrder from '../models/supplierOrder.js';
import { sendEmail } from '../utils/email.js';

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

      // Fetch user email and order details for confirmation email
      const user = await User.findById(userId);
      const orderDetails = await Order.getOrderById(orderId);
      const orderItemsList = orderDetails.items.map(item =>
        `<li><b>${item.product_name}</b> (SKU: ${item.sku}) &times; ${item.quantity} - ₱${Number(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</li>`
      ).join('');
      const orderInfoHtml = `
        <p><b>Order #:</b> ${orderDetails.order_id}</p>
        <p><b>Order Date:</b> ${new Date(orderDetails.order_date).toLocaleString()}</p>
        <p><b>Payment Method:</b> ${orderDetails.payment_method}</p>
        <p><b>Shipping Name:</b> ${orderDetails.shipping_full_name}</p>
        <p><b>Shipping Contact:</b> ${orderDetails.shipping_contact_number}</p>
        <p><b>Shipping Address:</b> ${orderDetails.shipping_street_address}, ${orderDetails.shipping_barangay}, ${orderDetails.shipping_city}, ${orderDetails.shipping_province}, ${orderDetails.shipping_postal_code}</p>
      `;
      const emailHtml = `
        <h2>Order Confirmed!</h2>
        <p>Your order has been placed successfully.</p>
        <hr/>
        <h3>Order Information</h3>
        ${orderInfoHtml}
        <h3>Checkout List</h3>
        <ul>${orderItemsList}</ul>
        <hr/>
        <h3>Payment Pending Verification</h3>
        <p>Your order has been placed successfully, but payment verification is pending. Our team will review your payment and update the order status within 24 hours.</p>
        <h4>What happens next?</h4>
        <ul>
          <li>We'll verify your payment within 24 hours</li>
          <li>You'll receive an email confirmation once verified</li>
          <li>Your order will be processed and shipped</li>
          <li>You can track your order status in your account</li>
        </ul>
      `;
      await sendEmail({
        to: user.email,
        subject: `Order Confirmation - Timeless Threads (Order #${orderDetails.order_id})`,
        text: 'Your order has been placed successfully. Payment verification is pending.',
        html: emailHtml
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
      // Send email if delivered
      if (status === 'Delivered') {
        // Get order and user info
        const order = await Order.getOrderById(orderId);
        const user = await User.findById(order.user_id);
        await sendEmail({
          to: user.email,
          subject: `Order Delivered - Timeless Threads (Order #${order.order_id})`,
          text: 'Your order has been delivered. Please check your delivery and mark your order as received in Order History to complete the order.',
          html: `
            <h2>Order Delivered!</h2>
            <p>Your order has been delivered. Please check your delivery and ensure everything is correct.</p>
            <p>To complete your order, please log in to your account and go to <b>Order History</b>, then click <b>Mark as Received</b> for this order.</p>
            <p>Thank you for shopping with Timeless Threads!</p>
          `
        });
      }
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

  async getPendingOrdersForApproval(req, res) {
    try {
      const orders = await Order.getPendingOrdersWithPayment();
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch pending orders.' });
    }
  },

  async verifyPayment(req, res) {
    const paymentId = req.params.paymentId;
    const { amount_received, verification_notes, status } = req.body;
    if (!amount_received || !status) return res.status(400).json({ error: 'Amount received and status are required.' });
    try {
      const updated = await Order.updatePaymentVerification(paymentId, { amount_received, verification_notes, status });
      if (!updated) return res.status(404).json({ error: 'Payment not found or not updated.' });
      // If payment is verified, update order and fulfillment statuses
      if (status === 'verified') {
        const orderInfo = await Order.getOrderAndUserByPaymentId(paymentId);
        if (orderInfo && orderInfo.order_id) {
          await Order.updateStatus(orderInfo.order_id, 'Verified');
          await Order.updateFulfillmentStatus(orderInfo.order_id, 'Confirmed');
          await Order.updateOrder(orderInfo.order_id, { payment_verified: true });
        }
        await sendEmail({
          to: orderInfo.email,
          subject: `Order Approved - Timeless Threads (Order #${orderInfo.order_id})`,
          text: 'Your payment was approved. We are preparing to ship your products.',
          html: `
            <h2>Order Approved!</h2>
            <p>Your payment was approved. We are preparing to ship your products to:</p>
            <p><b>${orderInfo.shipping_full_name}</b><br/>
            ${orderInfo.shipping_street_address}, ${orderInfo.shipping_barangay}, ${orderInfo.shipping_city}, ${orderInfo.shipping_province}, ${orderInfo.shipping_postal_code}<br/>
            Contact: ${orderInfo.shipping_contact_number}</p>
            <p>You can monitor your order progress in your account's Order History.</p>
          `
        });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to verify payment.' });
    }
  },

  async updatePaymentStatusAndDisputed(req, res) {
    const paymentId = req.params.paymentId;
    const { payment_status, disputed } = req.body;
    if (!payment_status || typeof disputed === 'undefined') return res.status(400).json({ error: 'Payment status and disputed are required.' });
    try {
      const updated = await Order.updatePaymentStatusAndDisputed(paymentId, { payment_status, disputed });
      if (!updated) return res.status(404).json({ error: 'Payment not found or not updated.' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update payment status/disputed.' });
    }
  },

  async cancelOrder(req, res) {
    const orderId = req.params.orderId;
    const { verification_notes } = req.body;
    try {
      // Set order status to Cancelled
      await Order.updateStatus(orderId, 'Cancelled');
      // Set order_fulfillment status to Cancelled
      await Order.updateFulfillmentStatus(orderId, 'Cancelled');
      // Set payment status to failed
      const [payments] = await Order.pool.query('SELECT payment_id FROM payments WHERE order_id = ?', [orderId]);
      if (payments.length > 0) {
        await Order.updatePaymentVerification(payments[0].payment_id, { amount_received: null, verification_notes: verification_notes || null, status: 'failed' });
        // Send cancellation email
        const orderInfo = await Order.getOrderAndUserByPaymentId(payments[0].payment_id);
        await sendEmail({
          to: orderInfo.email,
          subject: `Order Cancelled - Timeless Threads (Order #${orderInfo.order_id})`,
          text: 'Your payment was rejected and your order has been cancelled.',
          html: `
            <h2>Order Cancelled</h2>
            <p>Your payment was <b>rejected</b> and your order has been cancelled.</p>
            <p><b>Reason:</b> ${orderInfo.verification_notes || verification_notes || 'No notes provided.'}</p>
            <p>If you have questions, please contact support.</p>
          `
        });
      }
      // Restore inventory for all order items
      const [items] = await Order.pool.query('SELECT variant_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
      for (const item of items) {
        await ProductVariant.incrementStock(item.variant_id, item.quantity);
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to cancel order.' });
    }
  },

  // Admin dashboard stats
  async adminDashboardStats(req, res) {
    try {
      console.log('Admin dashboard stats request received');
      
      const [totalUsers, totalOrders, completedOrders, lowStock, newOrdersCount] = await Promise.all([
        User.getTotal(),
        Order.getTotalOrders(),
        Order.getCompletedOrders(),
        ProductVariant.getLowStock(),
        Order.getPendingOrdersCount(),
      ]);
      
      console.log('Admin dashboard stats calculated:', { totalUsers, totalOrders, completedOrders, lowStockCount: lowStock.length });
      
      //
      res.json({ totalUsers, totalOrders, completedOrders, lowStock, newOrdersCount });
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
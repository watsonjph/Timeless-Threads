import express from 'express';
import db from '../config/db.config.js';

const router = express.Router();

// Get product stock by SKU
router.get('/stock/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    
    const query = `
      SELECT 
        pv.variant_id,
        pv.sku,
        pv.size,
        pv.color,
        pi.stock_quantity,
        p.name as product_name,
        p.price
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN product_inventory pi ON pv.variant_id = pi.variant_id
      WHERE pv.sku = ? AND pv.is_active = 1
    `;
    
    const [variants] = await db.query(query, [sku]);
    
    if (variants.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Format the response
    const stockData = {
      product_name: variants[0].product_name,
      price: variants[0].price,
      variants: variants.map(variant => ({
        variant_id: variant.variant_id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        stock_quantity: variant.stock_quantity || 0,
        in_stock: (variant.stock_quantity || 0) > 0
      }))
    };
    
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching product stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products (for admin/supplier use)
router.get('/', async (req, res) => {
  try {
    // Fetch all products
    const [products] = await db.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.is_active,
        p.supplier_id,
        c.name as category_name,
        s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      WHERE p.is_active = 1
    `);

    // Fetch all variants
    const [variants] = await db.query(`
      SELECT 
        pv.variant_id,
        pv.product_id,
        pv.size,
        pv.color,
        pv.sku,
        pv.is_active,
        pi.stock_quantity
      FROM product_variants pv
      LEFT JOIN product_inventory pi ON pv.variant_id = pi.variant_id
      WHERE pv.is_active = 1
    `);

    // Group variants by product_id
    const variantsByProduct = {};
    for (const v of variants) {
      if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
      variantsByProduct[v.product_id].push(v);
    }

    // Attach variants to products
    const productsWithVariants = products.map(p => ({
      ...p,
      variants: variantsByProduct[p.product_id] || []
    }));

    res.json({ products: productsWithVariants });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 
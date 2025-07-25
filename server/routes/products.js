import express from 'express';
import db from '../config/db.config.js';

const router = express.Router();

// Get product stock by SKU
router.get('/stock/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    // First, find the product_id for the given SKU
    const productIdQuery = `
      SELECT product_id FROM product_variants WHERE sku = ? LIMIT 1
    `;
    const [productRows] = await db.query(productIdQuery, [sku]);
    if (!productRows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const product_id = productRows[0].product_id;
    // Now, get all variants for this product
    const variantsQuery = `
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
      WHERE pv.product_id = ? AND pv.is_active = 1
    `;
    const [variants] = await db.query(variantsQuery, [product_id]);
    if (variants.length === 0) {
      return res.status(404).json({ error: 'No variants found for this product' });
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
        p.category_id,
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

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT category_id, name FROM categories ORDER BY name ASC');
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Add a new product
router.post('/', async (req, res) => {
  const { name, description, category_id, price, is_active, supplier_id } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO products (name, description, category_id, price, is_active, supplier_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category_id, price, is_active ? 1 : 0, supplier_id]
    );
    const product_id = result.insertId;
    res.json({ product_id });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product.' });
  }
});

// Update a product and its variants
router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { name, description, category_id, price, is_active, supplier_id, variants } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Update product
    await conn.query(
      `UPDATE products SET name=?, description=?, category_id=?, price=?, is_active=?, supplier_id=? WHERE product_id=?`,
      [name, description, category_id, price, is_active ? 1 : 0, supplier_id, productId]
    );
    // Update variants
    if (Array.isArray(variants)) {
      for (const v of variants) {
        await conn.query(
          `UPDATE product_variants SET size=?, color=?, sku=?, is_active=? WHERE variant_id=? AND product_id=?`,
          [v.size, v.color, v.sku, v.is_active ? 1 : 0, v.variant_id, productId]
        );
      }
    }
    await conn.commit();
    res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  } finally {
    conn.release();
  }
});

// Add a new variant to a product
router.post('/:productId/variants', async (req, res) => {
  const { productId } = req.params;
  const { size, color, sku, is_active } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Insert variant
    const [result] = await conn.query(
      `INSERT INTO product_variants (product_id, size, color, sku, is_active) VALUES (?, ?, ?, ?, ?)`,
      [productId, size || null, color || null, sku || null, is_active ? 1 : 0]
    );
    const variant_id = result.insertId;
    // Insert inventory entry for this variant
    await conn.query(
      `INSERT INTO product_inventory (variant_id, stock_quantity, restock_threshold) VALUES (?, 0, 0)`,
      [variant_id]
    );
    await conn.commit();
    res.json({ variant_id });
  } catch (error) {
    await conn.rollback();
    console.error('Error adding variant:', error);
    res.status(500).json({ error: 'Failed to add variant.' });
  } finally {
    conn.release();
  }
});

// Delete a product and all its variants and inventory entries
router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Get all variant_ids for this product
    const [variants] = await conn.query('SELECT variant_id FROM product_variants WHERE product_id = ?', [productId]);
    const variantIds = variants.map(v => v.variant_id);
    if (variantIds.length > 0) {
      // Delete inventory entries for these variants
      await conn.query('DELETE FROM product_inventory WHERE variant_id IN (?)', [variantIds]);
      // Delete variants
      await conn.query('DELETE FROM product_variants WHERE variant_id IN (?)', [variantIds]);
    }
    // Delete the product
    await conn.query('DELETE FROM products WHERE product_id = ?', [productId]);
    await conn.commit();
    res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  } finally {
    conn.release();
  }
});

// Update the variant delete endpoint to also delete its inventory entry
router.delete('/variants/:variantId', async (req, res) => {
  const { variantId } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM product_inventory WHERE variant_id = ?', [variantId]);
    await conn.query('DELETE FROM product_variants WHERE variant_id = ?', [variantId]);
    await conn.commit();
    res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    console.error('Error deleting variant:', error);
    res.status(500).json({ error: 'Failed to delete variant.' });
  } finally {
    conn.release();
  }
});

// Get all product inventory entries with product name
router.get('/inventory', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        pi.pd_inventory_id,
        pi.variant_id,
        p.name as product_name,
        pi.stock_quantity,
        pi.restock_threshold,
        pi.last_restocked
      FROM product_inventory pi
      JOIN product_variants pv ON pi.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      ORDER BY pi.pd_inventory_id DESC
    `);
    res.json({ inventory: rows });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory.' });
  }
});

// Update a product_inventory entry
router.put('/inventory/:pdInventoryId', async (req, res) => {
  const { pdInventoryId } = req.params;
  const { stock_quantity, restock_threshold, last_restocked } = req.body;
  try {
    await db.query(
      `UPDATE product_inventory SET stock_quantity=?, restock_threshold=?, last_restocked=? WHERE pd_inventory_id=?`,
      [stock_quantity, restock_threshold, last_restocked, pdInventoryId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory.' });
  }
});

// Delete a product_inventory entry
router.delete('/inventory/:pdInventoryId', async (req, res) => {
  const { pdInventoryId } = req.params;
  try {
    await db.query('DELETE FROM product_inventory WHERE pd_inventory_id = ?', [pdInventoryId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ error: 'Failed to delete inventory.' });
  }
});

// Fetch reviews for a product by product_id
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const [reviews] = await db.query(`
      SELECT r.review_id, r.rating, r.review_text, r.review_date, r.user_id,
             u.username, u.profile_pic_url, u.firstName, u.lastName
      FROM product_reviews r
      LEFT JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = ?
      ORDER BY r.review_date DESC
    `, [productId]);
    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching product reviews:', err);
    res.status(500).json({ error: 'Failed to fetch product reviews' });
  }
});

// POST /api/products/:productId/reviews - submit a review for a product
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { user_id, rating, review_text } = req.body;
    if (!user_id || !rating || !review_text) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    await db.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)`,
      [productId, user_id, rating, review_text]
    );
    res.json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error('Error in POST /products/:productId/reviews:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

export default router; 
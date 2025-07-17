import express from 'express';
import Supplier from '../models/supplier.js';

const router = express.Router();

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.getAll();
    res.json({ suppliers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suppliers.' });
  }
});
// POST create supplier
router.post('/', async (req, res) => {
  try {
    const id = await Supplier.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create supplier.' });
  }
});
// PUT update supplier
router.put('/:id', async (req, res) => {
  try {
    const updated = await Supplier.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Supplier not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update supplier.' });
  }
});
// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Supplier.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Supplier not found.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete supplier.' });
  }
});

export default router; 
import express from 'express';
import Client from '../models/clientModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clients = await Client.getAll(); // This returns a list of clients
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

export default router;




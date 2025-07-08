import { getAllClients, getClientById } from '../models/clientModel.js';

export const fetchAllClients = async (req, res, next) => {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

export const fetchClientById = async (req, res, next) => {
  try {
    const client = await getClientById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    next(error);
  }
};





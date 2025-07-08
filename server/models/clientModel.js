import db from '../config/db.config.js';

const Client = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM clients');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [id]);
    return rows[0];
  }
};

export default Client;

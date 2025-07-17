import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import supplierOrderRoutes from './routes/supplierOrders.js';
import suppliersRoutes from './routes/suppliers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve uploaded images statically (for profile pictures)
app.use('/api/auth/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/supplier-orders', supplierOrderRoutes);
app.use('/api/suppliers', suppliersRoutes);

app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend connected!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


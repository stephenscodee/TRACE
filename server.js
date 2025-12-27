import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import opportunityRoutes from './routes/opportunities.js';
import interactionRoutes from './routes/interactions.js';
import emailRoutes from './routes/email.js';
import reminderRoutes from './routes/reminders.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Trace CRM API is running' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/opportunities', authenticateToken, opportunityRoutes);
app.use('/api/interactions', authenticateToken, interactionRoutes);
app.use('/api/email', authenticateToken, emailRoutes);
app.use('/api/reminders', authenticateToken, reminderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Trace CRM API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});


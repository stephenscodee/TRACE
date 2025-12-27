const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let db;

async function startServer() {
    db = await initDB();
    console.log('Connected to SQLite Database');

    // Basic Auth Middleware (Mock for MVP)
    const authenticate = (req, res, next) => {
        // In a real app, verify JWT here
        req.user = { id: 1, name: 'Admin Trace', role: 'admin' };
        next();
    };

    // Routes
    app.get('/api/clients', authenticate, async (req, res) => {
        const clients = await db.all('SELECT * FROM clients ORDER BY created_at DESC');
        res.json(clients);
    });

    app.post('/api/clients', authenticate, async (req, res) => {
        const { name, company, email, phone, status, potential_value } = req.body;
        const result = await db.run(
            'INSERT INTO clients (name, company, email, phone, status, potential_value) VALUES (?, ?, ?, ?, ?, ?)',
            [name, company, email, phone, status || 'lead', potential_value || 0]
        );
        res.json({ id: result.lastID });
    });

    app.get('/api/clients/:id', authenticate, async (req, res) => {
        const client = await db.get('SELECT * FROM clients WHERE id = ?', [req.params.id]);
        const interactions = await db.all('SELECT * FROM interactions WHERE client_id = ? ORDER BY created_at DESC', [req.params.id]);
        res.json({ ...client, interactions });
    });

    app.post('/api/interactions', authenticate, async (req, res) => {
        const { client_id, type, content } = req.body;
        const result = await db.run(
            'INSERT INTO interactions (client_id, type, content, user_id) VALUES (?, ?, ?, ?)',
            [client_id, type, content, req.user.id]
        );
        res.json({ id: result.lastID });
    });

    app.get('/api/stats', authenticate, async (req, res) => {
        const totalClients = await db.get('SELECT COUNT(*) as count FROM clients');
        const activeOps = await db.get('SELECT COUNT(*) as count FROM opportunities WHERE stage NOT LIKE "closed%"');
        const totalValue = await db.get('SELECT SUM(potential_value) as sum FROM clients');
        res.json({
            clients: totalClients.count,
            opportunities: activeOps.count,
            pipelineValue: totalValue.sum || 0
        });
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    }).on('error', (err) => {
        console.error('Express listen error:', err);
    });
    console.log('App listen called');
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
});

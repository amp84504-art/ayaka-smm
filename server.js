const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./src/routes/api');
const authRoutes = require('./src/routes/auth');
const TursoService = require('./src/services/tursoService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files dari folder public & folder asset
app.use(express.static(path.join(__dirname, 'public')));
app.use('/asset', express.static(path.join(__dirname, 'asset'))); // <-- Menghubungkan folder asset

// API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Fallback index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Init DB & Start Server
TursoService.initTables();

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`AYAKA STORE Server berjalan di http://localhost:${PORT}`);
    console.log(`=================================`);
});

const express = require('express');
const router = express.Router();
const IndosmmService = require('../services/indosmmService');
const TursoService = require('../services/tursoService');

// Fetch Layanan Indosmm
router.get('/smm/services', async (req, res) => {
    const customApiKey = req.headers['x-indosmm-key'];
    const services = await IndosmmService.getServices(customApiKey);
    res.json({ success: true, data: services });
});

// Fetch Stats Marketplace
router.get('/stats', async (req, res) => {
    const stats = await TursoService.getStats();
    res.json({ success: true, data: stats });
});

module.exports = router;

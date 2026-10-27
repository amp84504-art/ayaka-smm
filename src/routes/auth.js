const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { email } = req.body;
    const role = email && email.includes('admin') ? 'admin' : 'user';
    const username = email ? email.split('@')[0] : 'User';

    res.json({
        success: true,
        user: { name: username, email: email, role: role }
    });
});

router.post('/register', (req, res) => {
    const { name, email } = req.body;
    res.json({
        success: true,
        user: { name: name, email: email, role: 'user' }
    });
});

module.exports = router;

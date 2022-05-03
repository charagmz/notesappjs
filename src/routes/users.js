const express = require('express');
const router = express.Router();

router.get('/users/signin', (req, res) => {
    res.send('SignIn');
});

router.get('/users/signup', (req, res) => {
    res.send('Formulario de auth');
});

module.exports = router;

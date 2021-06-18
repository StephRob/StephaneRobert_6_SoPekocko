// Import des packages
const express = require('express');
// Création d'un router
const router = express.Router();
// Import du controller user
const userCtrl = require('../controllers/user');

// On crée les routes relatives aux users
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// On export le router
module.exports = router;
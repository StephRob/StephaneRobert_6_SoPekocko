// Import des packages
const express = require('express');
// Création d'un router
const router = express.Router();
// Import des middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Import du controller sauce
const sauceCtrl = require('../controllers/sauce');

// On crée les routes relatives aux sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

// On export le router
module.exports = router;

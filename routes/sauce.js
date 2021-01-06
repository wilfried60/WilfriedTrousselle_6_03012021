const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/sauce');

// on fait une authentification et on récupère les information des sauces dans le controllers  
router.get('/', auth, stuffCtrl.getAllSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifyOneSauce);
router.delete('/:id', auth, stuffCtrl.deleteOneSauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce);


module.exports = router;
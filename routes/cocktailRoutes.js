const router = require('express').Router();
const cocktailController = require('../controllers/cocktailController');

router.get('/', cocktailController.showMenu);

module.exports = router;

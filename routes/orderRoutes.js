const router = require('express').Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.queue);
router.post('/', orderController.create);
router.get('/:id/edit', orderController.editForm);
router.post('/:id/edit', orderController.update);
router.post('/:id/status', orderController.updateStatus);

module.exports = router;

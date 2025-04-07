const router = require('express').Router();
const { createSavings, getSavings, updateSavings, deleteSavings } = require('../../controllers/savings.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/create', protect, createSavings);
router.get('/', protect, getSavings);
router.put('/:id', protect, updateSavings);
router.delete('/:id', protect, deleteSavings);

module.exports = router;

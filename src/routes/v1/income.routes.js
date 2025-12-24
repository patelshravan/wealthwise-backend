const router = require('express').Router();
const { createIncome, getIncome, updateIncome, deleteIncome } = require('../../controllers/income.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/create', protect, createIncome);
router.get('/', protect, getIncome);
router.put('/:id', protect, updateIncome);
router.delete('/:id', protect, deleteIncome);

module.exports = router;


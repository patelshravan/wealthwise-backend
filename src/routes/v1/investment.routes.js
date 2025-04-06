const router = require('express').Router();
const { createInvestment, getInvestments, updateInvestment, deleteInvestment } = require('../../controllers/investment.controller');
const { protect } = require('../../middleware/auth.middleware');

// All investment routes are protected
router.post('/create', protect, createInvestment);
router.get('/', protect, getInvestments);
router.put('/:id', protect, updateInvestment);
router.delete('/:id', protect, deleteInvestment);

module.exports = router;

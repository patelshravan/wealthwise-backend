const router = require('express').Router();
const { createExpense, getExpenses, deleteExpense, updateExpense } = require('../../controllers/expense.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/create', protect, createExpense);
router.get('/', protect, getExpenses);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;

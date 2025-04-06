const router = require('express').Router();
const { createPolicy, getPolicies, updatePolicy, deletePolicy } = require('../../controllers/lic.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/create', protect, createPolicy);
router.get('/', protect, getPolicies);
router.put('/:id', protect, updatePolicy);
router.delete('/:id', protect, deletePolicy);

module.exports = router;

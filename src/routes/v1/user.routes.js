const router = require('express').Router();
const userController = require('../../controllers/user.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserProfile);
router.put('/:id', protect, userController.updateUserProfile);
router.delete('/:id', protect, userController.deleteUserProfile);

module.exports = router;

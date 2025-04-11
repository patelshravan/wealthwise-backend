const router = require('express').Router();
const userController = require('../../controllers/user.controller');
const authController = require('../../controllers/auth/auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload');

router.get("/login-activity", protect, authController.getLoginActivity);
router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserProfile);
router.put("/preferences", protect, userController.updateUserPreferences);
router.put('/:id', protect, upload.single('profileImage'), userController.updateUserProfile);
router.post("/verify-password", protect, userController.verifyPasswordBeforeDelete);
router.delete("/account/delete", protect, userController.deleteAccount);
router.delete('/:id', protect, userController.deleteUserProfile);

module.exports = router;

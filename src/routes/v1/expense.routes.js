const router = require("express").Router();
const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require("../../controllers/expense.controller");
const { protect } = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload");

router.post("/create", upload.single("image"), protect, createExpense);
router.get("/", protect, getExpenses);
router.put("/:id", upload.single("image"), protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;

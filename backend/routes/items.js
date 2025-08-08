const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getUserItems
} = require('../controllers/itemController');

// Define routes
router.route('/')
  .post(protect, createItem)
  .get(getAllItems);

router.route('/my-items')
  .get(protect, getUserItems);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;

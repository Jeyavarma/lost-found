const db = require('../models');

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, date, location } = req.body;
    const newItem = await db.Item.create({
      title,
      description,
      category,
      date,
      location,
      userId: req.user.id
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating item.', error: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getAllItems = async (req, res) => {
  try {
    const items = await db.Item.findAll({
      include: [{ model: db.User, attributes: ['name', 'email'] }]
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching items.', error: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res) => {
  try {
    const item = await db.Item.findByPk(req.params.id, {
      include: [{ model: db.User, attributes: ['name', 'email'] }]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching item.', error: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    const item = await db.Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the user owns the item
    if (item.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedItem = await item.update(req.body);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating item.', error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
// @desc    Get items for the logged-in user
// @route   GET /api/items/my-items
// @access  Private
exports.getUserItems = async (req, res) => {
  try {
    const items = await db.Item.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.User, attributes: ['name', 'email'] }]
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user items.', error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await db.Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if the user owns the item
    if (item.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await item.destroy();
    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting item.', error: error.message });
  }
};

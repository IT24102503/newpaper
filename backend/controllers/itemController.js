const Item = require("../models/Item");
const { isDatabaseConnected } = require("../config/db");
const itemStore = require("../store/itemStore");

// GET all items
const getItems = async (req, res) => {
  try {
    const items = isDatabaseConnected()
      ? await Item.find().sort({ createdAt: -1 })
      : itemStore.getItems();

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single item
const getItemById = async (req, res) => {
  try {
    const item = isDatabaseConnected()
      ? await Item.findById(req.params.id)
      : itemStore.getItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create item
const createItem = async (req, res) => {
  try {
    const { name, category, price, quantity, discountPercentage, description } = req.body;
    const itemPayload = { name, category, price, quantity, discountPercentage, description };
    const item = isDatabaseConnected()
      ? await Item.create(itemPayload)
      : itemStore.createItem(itemPayload);

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update item
const updateItem = async (req, res) => {
  try {
    const item = isDatabaseConnected()
      ? await Item.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        })
      : itemStore.updateItem(req.params.id, req.body);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE item
const deleteItem = async (req, res) => {
  try {
    const item = isDatabaseConnected()
      ? await Item.findByIdAndDelete(req.params.id)
      : itemStore.deleteItem(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };

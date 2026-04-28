const Item = require("../models/Item");

const items = new Map();

const normalizeItem = (item) => {
  const normalized = item.toObject ? item.toObject() : { ...item };

  return {
    ...normalized,
    _id: normalized._id.toString(),
  };
};

const getItems = () => {
  return Array.from(items.values()).sort(
    (firstItem, secondItem) => new Date(secondItem.createdAt) - new Date(firstItem.createdAt)
  );
};

const getItemById = (id) => {
  return items.get(id) || null;
};

const createItem = (payload) => {
  const draftItem = new Item(payload);
  const validationError = draftItem.validateSync();

  if (validationError) {
    throw validationError;
  }

  const now = new Date();
  const item = {
    ...normalizeItem(draftItem),
    createdAt: now,
    updatedAt: now,
  };

  items.set(item._id, item);

  return item;
};

const updateItem = (id, payload) => {
  const existingItem = items.get(id);

  if (!existingItem) {
    return null;
  }

  const draftItem = new Item({
    ...existingItem,
    ...payload,
    _id: existingItem._id,
    createdAt: existingItem.createdAt,
  });
  const validationError = draftItem.validateSync();

  if (validationError) {
    throw validationError;
  }

  const updatedItem = {
    ...normalizeItem(draftItem),
    createdAt: existingItem.createdAt,
    updatedAt: new Date(),
  };

  items.set(id, updatedItem);

  return updatedItem;
};

const deleteItem = (id) => {
  const existingItem = items.get(id);

  if (!existingItem) {
    return null;
  }

  items.delete(id);

  return existingItem;
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

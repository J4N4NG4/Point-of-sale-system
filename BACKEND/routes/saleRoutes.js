const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// Create Sale
router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Recalculate total server-side for safety
    const normalizedItems = items.map((it) => ({
      itemId: it.itemId,
      itemName: it.itemName,
      price: Number(it.price),
      quantity: Number(it.quantity),
      subtotal: Number(it.price) * Number(it.quantity),
    }));
    const computedTotal = normalizedItems.reduce((sum, it) => sum + it.subtotal, 0);

    const sale = new Sale({ items: normalizedItems, total: computedTotal });
    const saved = await sale.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List Sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
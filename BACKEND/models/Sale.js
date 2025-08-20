const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
}, { _id: false });

const saleSchema = new mongoose.Schema({
  items: { type: [saleItemSchema], required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema); 
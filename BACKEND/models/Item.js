// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // URL or base64 string
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);

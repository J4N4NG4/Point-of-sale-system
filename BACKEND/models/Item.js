const mongoose = require('mongoose');

const categories = [
  'Beverages',
  'Snacks',
  'Dairy Products',
  'Bakery',
  'Frozen Foods',
  'Household Items',
  'Personal Care',
  'Meat & Seafood',
  'Fruits & Vegetables',
  'Canned Goods'
];

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
    enum: categories, // restrict to predefined categories
  }
}, {
  timestamps: true
});

module.exports = {
  Item: mongoose.model('Item', itemSchema),
  categories
};

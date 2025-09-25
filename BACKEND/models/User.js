const mongoose = require('mongoose');

const USER_ROLES = ['Cashier', 'Manager', 'Admin'];

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    // Username or Employee ID
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: USER_ROLES,
    required: true,
    default: 'Cashier',
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

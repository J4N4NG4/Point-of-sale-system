// components/AddItemForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddItemForm.css';

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    price: '',
    image: '',
    quantity: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    axios.get('http://localhost:8070/api/items/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData); // Replace with actual API call
    alert('Item added!');
  };

  return (
    <div className="form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required />

        <label>Item Code</label>
        <input type="text" name="itemCode" value={formData.itemCode} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Image URL</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} />

        <label>Quantity</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItemForm;

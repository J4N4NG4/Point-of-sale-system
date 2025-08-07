// components/AddItemForm.js
import React, { useState } from 'react';
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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData); // Replace with API call
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
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItemForm;

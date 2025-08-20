import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddItemForm.css';

const AddItemForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    buyPrice: '',
    sellPrice: '',
    image: '',
    quantity: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8070/api/items/categories'); // adjust port if needed
        console.log('Categories fetched:', res.data);
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setMessage('Failed to load categories. Please check backend.');
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new item
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate prices
    const buyPrice = Number(formData.buyPrice);
    const sellPrice = Number(formData.sellPrice);

    if (buyPrice < 0 || sellPrice < 0) {
      setMessage('Prices cannot be negative.');
      setLoading(false);
      return;
    }

    if (sellPrice < buyPrice) {
      setMessage('Sell price should be greater than or equal to buy price.');
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      buyPrice: buyPrice,
      sellPrice: sellPrice,
      quantity: Number(formData.quantity),
    };

    try {
      const res = await axios.post('http://localhost:8070/api/items', payload);
      setMessage('Item added successfully!');
      setFormData({
        itemName: '',
        itemCode: '',
        buyPrice: '',
        sellPrice: '',
        image: '',
        quantity: '',
        category: '',
      });
    } catch (err) {
      console.error('Error adding item:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`Failed to add item: ${err.response.data.error}`);
      } else {
        setMessage('Failed to add item. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Item</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          required
        />

        <label>Item Code</label>
        <input
          type="text"
          name="itemCode"
          value={formData.itemCode}
          onChange={handleChange}
          required
        />

        <label>Buy Price</label>
        <input
          type="number"
          name="buyPrice"
          value={formData.buyPrice}
          min="0"
          step="0.01"
          onChange={handleChange}
          required
        />

        <label>Sell Price</label>
        <input
          type="number"
          name="sellPrice"
          value={formData.sellPrice}
          min="0"
          step="0.01"
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          min="0"
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))
          ) : (
            <option value="" disabled>Loading categories...</option>
          )}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;

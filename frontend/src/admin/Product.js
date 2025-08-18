import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Product.css";

const Product = () => {
  const [items, setItems] = useState([]);

  // Fetch all items
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/items");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/items/${id}`);
      fetchItems(); // refresh table
    } catch (err) {
      console.error(err);
    }
  };

  // Edit item (redirect to edit page or show alert for now)
  const handleEdit = (id) => {
    alert(`Edit feature coming soon for item ID: ${id}`);
  };

  return (
    <div className="product-container">
      <h2>Items List</h2>

      {/* Items Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Price ($)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.image ? (
                    <img src={item.image} alt={item.itemName} className="item-img" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{item.itemCode}</td>
                <td>{item.itemName}</td>
                <td>{item.category}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item._id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No items found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Product;

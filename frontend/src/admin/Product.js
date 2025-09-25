import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/Product.css";

const Product = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // current item object
  const [form, setForm] = useState({ itemName: '', itemCode: '', category: '', buyPrice: '', sellPrice: '', quantity: '', image: '' });
  const [saving, setSaving] = useState(false);

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
      fetchItems(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // Start edit
  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      itemName: item.itemName || '',
      itemCode: item.itemCode || '',
      category: item.category || '',
      buyPrice: item.buyPrice ?? '',
      sellPrice: item.sellPrice ?? '',
      quantity: item.quantity ?? '',
      image: item.image || ''
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ itemName: '', itemCode: '', category: '', buyPrice: '', sellPrice: '', quantity: '', image: '' });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      const payload = {
        itemName: form.itemName,
        itemCode: form.itemCode,
        category: form.category,
        buyPrice: Number(form.buyPrice),
        sellPrice: Number(form.sellPrice),
        quantity: Number(form.quantity),
        image: form.image,
      };
      await axios.put(`http://localhost:8070/api/items/${editing._id}`, payload);
      await fetchItems();
      cancelEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to safely format price
  const formatPrice = (price) => {
    if (price === undefined || price === null || price === '') {
      return 'N/A';
    }
    return Number(price).toFixed(2);
  };

  const filteredItems = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return items;
    return items.filter((it) =>
      (it.itemName || '').toLowerCase().includes(text) ||
      (it.itemCode || '').toLowerCase().includes(text) ||
      (it.category || '').toLowerCase().includes(text)
    );
  }, [items, search]);

  return (
    <div className="product-container">
      <h2>Items</h2>

      <div className="product-toolbar">
        <input
          className="product-search"
          type="text"
          placeholder="Search by name, code, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="product-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} className="product-card">
              <div className="product-thumb">
                {item.image ? (
                  <img src={item.image} alt={item.itemName} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="product-info">
                <div className="product-name">{item.itemName}</div>
                <div className="product-meta">
                  <span className="code">{item.itemCode}</span>
                  <span className="category">{item.category}</span>
                </div>
                <div className="price-row">
                  <span className="buy">Buy: ${formatPrice(item.buyPrice)}</span>
                  <span className="sell">Sell: ${formatPrice(item.sellPrice)}</span>
                </div>
                <div className="stock">Stock: {item.quantity}</div>
              </div>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No items found</div>
        )}
      </div>

      {editing && (
        <div className="product-modal">
          <div className="product-modal-content">
            <h3>Edit Item</h3>
            <div className="form-grid">
              <div className="form-row">
                <label>Item Name</label>
                <input value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Item Code</label>
                <input value={form.itemCode} onChange={(e) => setForm({ ...form, itemCode: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Category</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Buy Price</label>
                <input type="number" step="0.01" value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Sell Price</label>
                <input type="number" step="0.01" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Quantity</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="delete-btn" onClick={cancelEdit}>Cancel</button>
              <button className="edit-btn" onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

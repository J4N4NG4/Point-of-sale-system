import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../styles/POS.css';

const POS = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [cart, setCart] = useState([]); // [{ _id, itemName, price, quantity, stock, image }]
  const [message, setMessage] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const API_BASE = 'http://localhost:8070';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [itemsRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/api/items`),
          axios.get(`${API_BASE}/api/items/categories`),
        ]);
        setItems(itemsRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load items. Please check backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return items.filter((it) => {
      const matchesText = text === '' ||
        it.itemName.toLowerCase().includes(text) ||
        it.itemCode.toLowerCase().includes(text);
      const matchesCategory = !selectedCategory || it.category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [items, searchText, selectedCategory]);

  const addToCart = (item) => {
    setMessage('');
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        const nextQty = existing.quantity + 1;
        if (nextQty > item.quantity) {
          setMessage('Not enough stock for this item.');
          return prev;
        }
        return prev.map((c) => (c._id === item._id ? { ...c, quantity: nextQty } : c));
      }
      if (item.quantity <= 0) {
        setMessage('Item is out of stock.');
        return prev;
      }
      return [
        ...prev,
        {
          _id: item._id,
          itemName: item.itemName,
          price: item.price,
          quantity: 1,
          stock: item.quantity,
          image: item.image,
        },
      ];
    });
  };

  const setCartQty = (id, qty) => {
    setCart((prev) => prev.map((c) => (c._id === id ? { ...c, quantity: qty } : c)));
  };

  const incQty = (line) => {
    if (line.quantity + 1 > line.stock) {
      setMessage('Not enough stock for this item.');
      return;
    }
    setCartQty(line._id, line.quantity + 1);
  };

  const decQty = (line) => {
    const next = line.quantity - 1;
    if (next <= 0) {
      removeFromCart(line._id);
      return;
    }
    setCartQty(line._id, next);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('Cart is empty.');
      return;
    }

    try {
      setCheckingOut(true);
      setMessage('');

      // Refresh latest stock before updating
      const itemsRes = await axios.get(`${API_BASE}/api/items`);
      const latestItems = itemsRes.data || [];

      // Validate stock and prepare updates
      const updates = [];
      for (const line of cart) {
        const latest = latestItems.find((it) => it._id === line._id);
        if (!latest) {
          throw new Error(`Item not found: ${line.itemName}`);
        }
        if (line.quantity > latest.quantity) {
          throw new Error(`Insufficient stock for ${line.itemName}. Available: ${latest.quantity}`);
        }
        const newQuantity = latest.quantity - line.quantity;
        updates.push({ id: line._id, newQuantity });
      }

      // Perform updates sequentially to keep it simple
      for (const u of updates) {
        await axios.put(`${API_BASE}/api/items/${u.id}`, { quantity: u.newQuantity });
      }

      // Refresh items, clear cart
      const refreshed = await axios.get(`${API_BASE}/api/items`);
      setItems(refreshed.data || []);
      setCart([]);
      setMessage('Sale completed successfully. Stock updated.');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err.message || 'Checkout failed.';
      setMessage(msg);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="pos-container">
        <div className="pos-content">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pos-container">
        <div className="pos-content error">{error}</div>
      </div>
    );
  }

  return (
    <div className="pos-container">
      <div className="pos-content">
        <div className="pos-left">
          <div className="pos-toolbar">
            <input
              className="pos-search"
              type="text"
              placeholder="Search by name or code..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              className="pos-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="product-grid">
            {filteredItems.map((it) => (
              <div key={it._id} className={`product-card ${it.quantity === 0 ? 'out' : ''}`}>
                <div className="product-thumb">
                  {it.image ? (
                    <img src={it.image} alt={it.itemName} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-name">{it.itemName}</div>
                  <div className="product-meta">
                    <span className="code">{it.itemCode}</span>
                    <span className="price">${it.price.toFixed(2)}</span>
                  </div>
                  <div className="product-stock">In stock: {it.quantity}</div>
                </div>
                <button
                  className="add-btn"
                  disabled={it.quantity === 0}
                  onClick={() => addToCart(it)}
                >
                  {it.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pos-right">
          <h3>Cart</h3>
          {message && <div className="pos-message">{message}</div>}

          <div className="cart-lines">
            {cart.length === 0 ? (
              <div className="empty">Cart is empty</div>
            ) : (
              cart.map((line) => (
                <div key={line._id} className="cart-line">
                  <div className="line-main">
                    <div className="line-title">{line.itemName}</div>
                    <div className="line-meta">${line.price.toFixed(2)}</div>
                  </div>
                  <div className="line-actions">
                    <button className="qty-btn" onClick={() => decQty(line)}>-</button>
                    <input
                      className="qty-input"
                      type="number"
                      min="1"
                      max={line.stock}
                      value={line.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 1;
                        const clamped = Math.max(1, Math.min(val, line.stock));
                        setCartQty(line._id, clamped);
                      }}
                    />
                    <button className="qty-btn" onClick={() => incQty(line)}>+</button>
                    <button className="remove-btn" onClick={() => removeFromCart(line._id)}>Remove</button>
                  </div>
                  <div className="line-subtotal">${(line.price * line.quantity).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="total-row">
              <span>Total</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <div className="cart-actions">
              <button className="clear-btn" onClick={clearCart} disabled={cart.length === 0}>Clear</button>
              <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0 || checkingOut}>
                {checkingOut ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS; 
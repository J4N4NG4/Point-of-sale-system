import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({}); // id -> boolean

  const API_BASE = 'http://localhost:8070';

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/api/sales`);
        setSales(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load sales.');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="sales-container">Loading...</div>;
  if (error) return <div className="sales-container error">{error}</div>;

  return (
    <div className="sales-container">
      <h2>Sales</h2>

      <table className="sales-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Time</th>
            <th>Items</th>
            <th>Total ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr><td colSpan="6">No sales yet</td></tr>
          ) : (
            sales.map((sale, idx) => {
              const created = new Date(sale.createdAt);
              const id = sale._id;
              const isOpen = !!expanded[id];
              return (
                <React.Fragment key={id}>
                  <tr className="sale-row">
                    <td>{idx + 1}</td>
                    <td>{created.toLocaleDateString()}</td>
                    <td>{created.toLocaleTimeString()}</td>
                    <td>{sale.items?.length || 0}</td>
                    <td>{Number(sale.total).toFixed(2)}</td>
                    <td>
                      <button className="expand-btn" onClick={() => toggleExpand(id)}>
                        {isOpen ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="items-row">
                      <td colSpan="6">
                        <table className="items-table">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Price</th>
                              <th>Qty</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sale.items?.map((it, i) => (
                              <tr key={i}>
                                <td>{it.itemName}</td>
                                <td>${Number(it.price).toFixed(2)}</td>
                                <td>{it.quantity}</td>
                                <td>${Number(it.subtotal ?? (it.price * it.quantity)).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Sales; 
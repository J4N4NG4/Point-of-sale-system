import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, year

  const API_BASE = 'http://localhost:8070';

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await axios.get(`${API_BASE}/api/dashboard/summary?period=${selectedPeriod}`);
      setDashboardData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content error">{error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">No data available</div>
      </div>
    );
  }

  const { 
    totalBuyValue, 
    totalSellValue, 
    profit, 
    profitMargin, 
    topSellingItems, 
    cashbookData,
    totalItems,
    totalSales 
  } = dashboardData;

  // Simple chart data
  const chartData = {
    labels: ['Buy Value', 'Sell Value', 'Profit'],
    datasets: [{
      data: [totalBuyValue, totalSellValue, profit],
      backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
      borderColor: ['#ff5252', '#26a69a', '#1976d2'],
      borderWidth: 2
    }]
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="period-selector">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Upper Section - Charts and Metrics */}
      <div className="dashboard-upper">
        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon buy">💰</div>
            <div className="metric-content">
              <h3>Total Buy Value</h3>
              <p className="metric-value">${totalBuyValue.toFixed(2)}</p>
              <p className="metric-label">Inventory Cost</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon sell">💵</div>
            <div className="metric-content">
              <h3>Total Sell Value</h3>
              <p className="metric-value">${totalSellValue.toFixed(2)}</p>
              <p className="metric-label">Revenue</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon profit">📈</div>
            <div className="metric-content">
              <h3>Profit</h3>
              <p className={`metric-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                ${profit.toFixed(2)}
              </p>
              <p className="metric-label">Net Income</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon margin">📊</div>
            <div className="metric-content">
              <h3>Profit Margin</h3>
              <p className={`metric-value ${profitMargin >= 0 ? 'positive' : 'negative'}`}>
                {profitMargin.toFixed(1)}%
              </p>
              <p className="metric-label">Margin %</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Financial Overview</h3>
            <div className="simple-chart">
              <div className="chart-bars">
                {chartData.datasets[0].data.map((value, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{
                        height: `${(value / Math.max(...chartData.datasets[0].data)) * 200}px`,
                        backgroundColor: chartData.datasets[0].backgroundColor[index]
                      }}
                    >
                      <span className="bar-value">${value.toFixed(2)}</span>
                    </div>
                    <span className="bar-label">{chartData.labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="top-items-container">
            <h3>Top Selling Items</h3>
            <div className="top-items-list">
              {topSellingItems.length > 0 ? (
                topSellingItems.map((item, index) => (
                  <div key={index} className="top-item">
                    <span className="item-rank">#{index + 1}</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">{item.quantity} sold</span>
                  </div>
                ))
              ) : (
                <p className="no-data">No sales data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Cashbook */}
      <div className="dashboard-lower">
        <div className="cashbook-container">
          <div className="cashbook-header">
            <h2>Cashbook</h2>
            <div className="cashbook-summary">
              <span>Total Transactions: {totalSales}</span>
              <span>Total Income: ${totalSellValue.toFixed(2)}</span>
            </div>
          </div>

          <div className="cashbook-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {cashbookData.length > 0 ? (
                  cashbookData.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span className={`transaction-type ${transaction.type}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.items}</td>
                      <td className="amount">${transaction.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No transactions in this period</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

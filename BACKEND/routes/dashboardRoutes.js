const express = require('express');
const router = express.Router();
const { Item } = require('../models/Item');
const Sale = require('../models/Sale');

// Get Dashboard Summary Data
router.get('/summary', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get all items for inventory calculation
    const items = await Item.find();
    
    // Get sales for the period
    const sales = await Sale.find({
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Calculate metrics
    const totalBuyValue = items.reduce((sum, item) => {
      const buyPrice = item.buyPrice || 0;
      return sum + (buyPrice * item.quantity);
    }, 0);

    const totalSellValue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const profit = totalSellValue - totalBuyValue;
    const profitMargin = totalSellValue > 0 ? (profit / totalSellValue) * 100 : 0;

    // Calculate top selling items
    const itemSales = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (itemSales[item.itemName]) {
          itemSales[item.itemName] += item.quantity;
        } else {
          itemSales[item.itemName] = item.quantity;
        }
      });
    });

    const topSellingItems = Object.entries(itemSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    // Prepare cashbook data
    const cashbookData = sales.map(sale => ({
      id: sale._id,
      date: sale.createdAt,
      description: `Sale #${sale._id.toString().slice(-6)}`,
      type: 'income',
      amount: sale.total,
      items: sale.items.length
    }));

    res.json({
      totalBuyValue,
      totalSellValue,
      profit,
      profitMargin,
      topSellingItems,
      cashbookData,
      totalItems: items.length,
      totalSales: sales.length,
      period
    });

  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// Get Sales Trend Data
router.get('/sales-trend', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Group sales by date
    const salesByDate = {};
    sales.forEach(sale => {
      const date = sale.createdAt.toISOString().split('T')[0];
      if (salesByDate[date]) {
        salesByDate[date] += sale.total;
      } else {
        salesByDate[date] = sale.total;
      }
    });

    // Fill missing dates with 0
    const trendData = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split('T')[0];
      trendData.push({
        date,
        amount: salesByDate[date] || 0
      });
    }

    res.json(trendData);

  } catch (err) {
    console.error('Sales trend error:', err);
    res.status(500).json({ error: 'Failed to fetch sales trend' });
  }
});

// Get Inventory Summary
router.get('/inventory', async (req, res) => {
  try {
    const items = await Item.find();
    
    const inventorySummary = {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => {
        const sellPrice = item.sellPrice || 0;
        return sum + (sellPrice * item.quantity);
      }, 0),
      lowStockItems: items.filter(item => item.quantity <= 10).length,
      outOfStockItems: items.filter(item => item.quantity === 0).length,
      categories: {}
    };

    // Group by category
    items.forEach(item => {
      if (inventorySummary.categories[item.category]) {
        inventorySummary.categories[item.category]++;
      } else {
        inventorySummary.categories[item.category] = 1;
      }
    });

    res.json(inventorySummary);

  } catch (err) {
    console.error('Inventory summary error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory summary' });
  }
});

module.exports = router;

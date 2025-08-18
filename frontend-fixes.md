# Frontend Fixes for API Port Discrepancy

## Issue
The frontend is trying to access the backend API on port 5000, but the backend is running on port 8070. This causes the "Failed to load categories. Please check backend." error in the AddItemForm component.

## Solution
Update the API endpoint URLs in the frontend to use the correct port (8070).

## File to Modify: `frontend/src/admin/AddItemForm.js`

### Changes Needed:

1. Line 23: Update the categories API endpoint
   FROM:
   ```javascript
   const res = await axios.get('http://localhost:5000/api/items/categories');
   ```
   TO:
   ```javascript
   const res = await axios.get('http://localhost:8070/api/items/categories');
   ```

2. Line 52: Update the items API endpoint
   FROM:
   ```javascript
   const res = await axios.post('http://localhost:5000/api/items', payload);
   ```
   TO:
   ```javascript
   const res = await axios.post('http://localhost:8070/api/items', payload);
   ```

## Additional Recommendations:

1. Consider creating a centralized API configuration file to manage endpoints
2. Consider using environment variables for API URLs to make it easier to change between development and production environments
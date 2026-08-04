const fs = require('fs');
const path = require('path');

// Safely construct file paths relative to this file's folder location
const policyPath = path.join(__dirname, '../data/trendly_policy.md');
const ordersPath = path.join(__dirname, '../data/orders.json');

// Reads and returns the entire policy document as plain text
function getPolicyText() {
    try {
        return fs.readFileSync(policyPath, 'utf8');
    } catch (error) {
        console.error("Error reading policy file:", error);
        return "";
    }
}

// Reads and parses the orders.json file
function getOrdersData() {
    try {
        const rawData = fs.readFileSync(ordersPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading orders file:", error);
        return { customers: [], orders: [] };
    }
}

// Looks up a single order by its ID (case-insensitive)
function getOrderById(orderId) {
    const data = getOrdersData();
    const ordersList = data.orders || [];
    
    // Search for matching order_id (e.g. TR-4521)
    const matchedOrder = ordersList.find(
        (order) => order.order_id.toUpperCase() === orderId.trim().toUpperCase()
    );

    return matchedOrder || null;
}

// Export functions so other backend files can use them
module.exports = {
    getPolicyText,
    getOrdersData,
    getOrderById
};
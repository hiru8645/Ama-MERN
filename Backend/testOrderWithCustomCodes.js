// Test script to verify custom product codes are working
const mongoose = require('mongoose');
const Product = require('./Model/ProductModel');
const Inventory = require('./Model/InventoryModel');
const Order = require('./Model/OrderModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/admin');

const testOrder = async () => {
  try {
    console.log('Testing order creation with custom product codes...');
    
    // First, get the available products to see their codes
    const products = await Product.find();
    
    console.log('Available products:');
    products.forEach(product => {
      console.log(`- ${product.name}: ${product.code} (Stock: ${product.stockCurrent})`);
    });
    
    if (products.length === 0) {
      console.log('No products found!');
      return;
    }
    
    // Check inventory items
    const inventoryItems = await Inventory.find();
    console.log('\nInventory items:');
    inventoryItems.forEach(item => {
      console.log(`- ${item.itemName}: ${item.bookId} (Qty: ${item.quantity})`);
    });
    
    // Try to find a book using custom product code
    const firstProduct = products[0];
    console.log(`\nLooking for inventory item with bookId: ${firstProduct.code}`);
    
    const inventoryItem = await Inventory.findOne({ bookId: firstProduct.code });
    
    if (inventoryItem) {
      console.log('✅ Found inventory item using custom product code!');
      console.log('Inventory item:', inventoryItem);
    } else {
      console.log('❌ Could not find inventory item with custom product code');
      
      // Try to find by MongoDB ID (old way)
      const inventoryByMongoId = await Inventory.findById(firstProduct._id);
      if (inventoryByMongoId) {
        console.log('❌ Found inventory item using MongoDB ID (this is the old way)');
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

testOrder();
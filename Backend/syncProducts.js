const mongoose = require('mongoose');
const Product = require('./Model/ProductModel');
const Inventory = require('./Model/InventoryModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const syncToInventory = async (product) => {
  try {
    const existingInventoryItem = await Inventory.findOne({ bookId: product.code });
    
    if (existingInventoryItem) {
      // Update existing inventory item
      existingInventoryItem.itemName = product.name;
      existingInventoryItem.quantity = product.stockCurrent;
      existingInventoryItem.price = parseFloat(product.price);
      await existingInventoryItem.save();
      console.log(`Updated inventory for: ${product.name} (${product.code})`);
    } else {
      // Create new inventory item
      const inventoryItem = new Inventory({
        bookId: product.code,
        itemName: product.name,
        quantity: product.stockCurrent,
        price: parseFloat(product.price)
      });
      await inventoryItem.save();
      console.log(`Created inventory for: ${product.name} (${product.code})`);
    }
  } catch (error) {
    console.error('Error syncing to inventory:', error);
  }
};

const syncAllProducts = async () => {
  try {
    console.log('Starting product sync...');
    const products = await Product.find();
    console.log(`Found ${products.length} products to sync`);
    
    let syncedCount = 0;
    
    for (const product of products) {
      await syncToInventory(product);
      syncedCount++;
    }
    
    console.log(`Successfully synced ${syncedCount} products to inventory`);
    process.exit(0);
  } catch (err) {
    console.error('Error during sync:', err);
    process.exit(1);
  }
};

syncAllProducts();
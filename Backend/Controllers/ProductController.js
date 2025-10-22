const Product = require('../Model/ProductModel');
const Inventory = require('../Model/InventoryModel');

// Helper function to sync product to inventory
const syncToInventory = async (product) => {
  try {
    const existingInventoryItem = await Inventory.findOne({ bookId: product.code });
    
    if (existingInventoryItem) {
      // Update existing inventory item
      existingInventoryItem.itemName = product.name;
      existingInventoryItem.quantity = product.stockCurrent;
      existingInventoryItem.price = parseFloat(product.price);
      await existingInventoryItem.save();
    } else {
      // Create new inventory item
      const inventoryItem = new Inventory({
        bookId: product.code,
        itemName: product.name,
        quantity: product.stockCurrent,
        price: parseFloat(product.price)
      });
      await inventoryItem.save();
    }
  } catch (error) {
    console.error('Error syncing to inventory:', error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    // Sync to inventory
    await syncToInventory(product);
    
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Sync to inventory
    await syncToInventory(product);
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Remove from inventory as well
    await Inventory.findOneAndDelete({ bookId: product.code });
    
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// One-time sync function to migrate existing products to inventory
exports.syncAllProductsToInventory = async (req, res) => {
  try {
    const products = await Product.find();
    let syncedCount = 0;
    
    for (const product of products) {
      await syncToInventory(product);
      syncedCount++;
    }
    
    res.json({ 
      message: `Successfully synced ${syncedCount} products to inventory`,
      syncedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
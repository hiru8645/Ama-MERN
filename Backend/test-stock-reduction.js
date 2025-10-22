const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Order = require('./Model/OrderModel');
const Book = require('./Model/InventoryModel');
const Product = require('./Model/ProductModel');

// Test order creation and stock reduction
async function testStockReduction() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ama-mern', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Create a test product if it doesn't exist
    let testProduct = await Product.findOne({ code: 'TEST-001' });
    if (!testProduct) {
      testProduct = await Product.create({
        name: 'Test Book',
        code: 'TEST-001',
        category: 'Fiction',
        price: '25.99',
        stockCurrent: 10,
        stockTotal: 20,
        status: 'Available',
        supplier: 'Test Supplier',
        lastUpdated: new Date().toISOString()
      });
      console.log('Created test product:', testProduct);
    }
    
    // Create corresponding inventory item
    let testBook = await Book.findOne({ bookId: 'TEST-001' });
    if (!testBook) {
      testBook = await Book.create({
        bookId: 'TEST-001',
        itemName: 'Test Book',
        quantity: 10,
        price: 25.99
      });
      console.log('Created test inventory item:', testBook);
    }
    
    console.log('\n--- Before Order ---');
    console.log('Product stock:', testProduct.stockCurrent);
    console.log('Inventory quantity:', testBook.quantity);
    
    // Test order creation
    const orderData = {
      items: [
        {
          bookId: 'TEST-001',
          quantity: 3
        }
      ],
      userid: 'test-user-123',
      username: 'Test User',
      customerName: 'John Doe',
      customerContact: '1234567890'
    };
    
    // Simulate order creation logic
    const book = await Book.findOne({ bookId: orderData.items[0].bookId });
    const product = await Product.findOne({ code: orderData.items[0].bookId });
    
    if (book && product) {
      console.log('\n--- Simulating Order Creation ---');
      console.log('Order quantity:', orderData.items[0].quantity);
      
      // Check if enough stock
      if (book.quantity >= orderData.items[0].quantity) {
        // Reduce stock in inventory
        book.quantity -= orderData.items[0].quantity;
        await book.save();
        
        // Reduce stock in products
        product.stockCurrent = Math.max(0, product.stockCurrent - orderData.items[0].quantity);
        await product.save();
        
        console.log('\n--- After Order ---');
        console.log('Product stock:', product.stockCurrent);
        console.log('Inventory quantity:', book.quantity);
        console.log('✓ Stock reduction successful!');
      } else {
        console.log('✗ Insufficient stock!');
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

testStockReduction();
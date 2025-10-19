const mongoose = require("mongoose");
const Book = require("./Model/InventoryModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Connection error:", err));

async function checkBooks() {
  try {
    const books = await Book.find({});
    console.log(`Found ${books.length} books in database:`);
    
    books.forEach((book, index) => {
      console.log(`${index + 1}. ID: ${book._id}`);
      console.log(`   Book ID: ${book.bookId || 'N/A'}`);
      console.log(`   Name: ${book.itemName}`);
      console.log(`   Price: $${book.price}`);
      console.log(`   Quantity: ${book.quantity}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error("Error checking books:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkBooks();
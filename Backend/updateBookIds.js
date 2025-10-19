const mongoose = require("mongoose");
const Book = require("./Model/InventoryModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Connection error:", err));

async function updateBooksWithBookId() {
  try {
    const books = await Book.find({});
    console.log(`Found ${books.length} books. Updating with bookId...`);
    
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const bookId = `BK-${1001 + i}`;
      
      await Book.findByIdAndUpdate(book._id, { bookId: bookId });
      console.log(`Updated ${book.itemName} with bookId: ${bookId}`);
    }
    
    console.log("\nAll books updated successfully!");
    
    // Verify the updates
    const updatedBooks = await Book.find({});
    console.log("\nVerification - Updated books:");
    updatedBooks.forEach((book, index) => {
      console.log(`${index + 1}. ${book.bookId}: ${book.itemName} (MongoDB ID: ${book._id})`);
    });
    
  } catch (error) {
    console.error("Error updating books:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateBooksWithBookId();
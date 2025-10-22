const mongoose = require("mongoose");
const Book = require("./Model/InventoryModel");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Connection error:", err));

const sampleBooks = [
  {
    bookId: "BK-1001",
    itemName: "Introduction to Computer Science",
    quantity: 25,
    price: 45.99
  },
  {
    bookId: "BK-1002", 
    itemName: "Data Structures and Algorithms",
    quantity: 20,
    price: 52.99
  },
  {
    bookId: "BK-1003",
    itemName: "Web Development Fundamentals", 
    quantity: 30,
    price: 39.99
  },
  {
    bookId: "BK-1004",
    itemName: "Database Management Systems",
    quantity: 15,
    price: 48.99
  },
  {
    bookId: "BK-1005",
    itemName: "Software Engineering Principles",
    quantity: 18,
    price: 55.99
  },
  {
    bookId: "BK-1006",
    itemName: "Mobile App Development",
    quantity: 22,
    price: 42.99
  },
  {
    bookId: "BK-1007",
    itemName: "Machine Learning Basics",
    quantity: 12,
    price: 59.99
  },
  {
    bookId: "BK-1008",
    itemName: "Network Security",
    quantity: 16,
    price: 51.99
  }
];

async function addSampleBooks() {
  try {
    // Clear existing books first
    await Book.deleteMany({});
    console.log("Cleared existing books");
    
    // Add sample books
    const result = await Book.insertMany(sampleBooks);
    console.log(`Added ${result.length} sample books to the database`);
    
    console.log("Sample books added:");
    result.forEach(book => {
      console.log(`- ${book.bookId}: ${book.itemName} (Qty: ${book.quantity}, Price: Rs.${book.price})`);
    });
    
  } catch (error) {
    console.error("Error adding sample books:", error);
  } finally {
    mongoose.connection.close();
  }
}

addSampleBooks();
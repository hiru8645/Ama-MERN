// Sample data generator for testing pie charts
const axios = require('axios');

const samplePayments = [
  {
    codeId: "PAY001",
    buyerId: "IT23650534",
    giverId: "IT23650535",
    bookId: "68efa4ca5a19ace783625e99",
    amount: 500
  },
  {
    codeId: "PAY002", 
    buyerId: "IT23650534",
    giverId: "IT23650536",
    bookId: "68efa4ca5a19ace783625e99",
    amount: 750
  },
  {
    codeId: "PAY003",
    buyerId: "IT23650534", 
    giverId: "IT23650537",
    bookId: "68efa4ca5a19ace783625e99",
    amount: 300
  }
];

const sampleRefunds = [
  {
    paymentId: "PAY001",
    buyerId: "IT23650534",
    giverId: "IT23650535", 
    description: "Book was damaged upon delivery"
  },
  {
    paymentId: "PAY002",
    buyerId: "IT23650534",
    giverId: "IT23650536",
    description: "Book not as described"
  }
];

const sampleFines = [
  {
    userId: "IT23650534",
    orderId: "ORD001",
    amount: 100,
    type: "Late Return",
    description: "Book returned 5 days late"
  },
  {
    userId: "IT23650534", 
    orderId: "ORD002",
    amount: 50,
    type: "Damage",
    description: "Minor damage to book cover"
  }
];

async function createSampleData() {
  try {
    console.log('Creating sample payments...');
    for (const payment of samplePayments) {
      try {
        const response = await axios.post('http://localhost:5001/api/payments/create', payment);
        console.log('✅ Payment created:', response.data.message);
      } catch (err) {
        console.log('⚠️ Payment creation error:', err.response?.data?.message || err.message);
      }
    }

    console.log('\nCreating sample refunds...');
    for (const refund of sampleRefunds) {
      try {
        const response = await axios.post('http://localhost:5001/api/refunds/create', refund);
        console.log('✅ Refund created:', response.data.message);
      } catch (err) {
        console.log('⚠️ Refund creation error:', err.response?.data?.message || err.message);
      }
    }

    console.log('\nCreating sample fines...');
    for (const fine of sampleFines) {
      try {
        const response = await axios.post('http://localhost:5001/api/fines/create', fine);
        console.log('✅ Fine created:', response.data.message);
      } catch (err) {
        console.log('⚠️ Fine creation error:', err.response?.data?.message || err.message);
      }
    }

    console.log('\n🎉 Sample data creation completed!');
    console.log('You can now view the pie charts in the Finance Dashboard.');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
}

createSampleData();
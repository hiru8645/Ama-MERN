// Test script to verify order edit API endpoint
const { default: fetch } = await import('node-fetch');

async function testOrderEditAPI() {
  try {
    // First, get the orders to find a pending one
    console.log("Fetching orders...");
    const response = await fetch('http://localhost:5001/api/orders');
    const data = await response.json();
    
    if (!data.success || !data.data || data.data.length === 0) {
      console.log("No orders found");
      return;
    }
    
    // Find a pending order
    const pendingOrder = data.data.find(order => order.status === 'Pending');
    
    if (!pendingOrder) {
      console.log("No pending orders found for testing");
      return;
    }
    
    console.log("Found pending order:", {
      id: pendingOrder._id,
      orderId: pendingOrder.orderId,
      customerName: pendingOrder.customerName,
      customerContact: pendingOrder.customerContact,
      items: pendingOrder.items
    });
    
    // Test updating the order
    const updateData = {
      customerName: "Updated Test Name",
      customerContact: "9999999999",
      items: [{
        bookId: pendingOrder.items[0].bookId,
        quantity: pendingOrder.items[0].quantity + 1
      }]
    };
    
    console.log("\nTesting order update...");
    console.log("Update data:", updateData);
    
    const updateResponse = await fetch(`http://localhost:5001/api/orders/${pendingOrder._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const updateResult = await updateResponse.json();
    
    if (updateResponse.ok && updateResult.success) {
      console.log("\n✅ Order updated successfully!");
      console.log("Updated order:", {
        id: updateResult.data._id,
        customerName: updateResult.data.customerName,
        customerContact: updateResult.data.customerContact,
        items: updateResult.data.items,
        totalPrice: updateResult.data.totalPrice
      });
    } else {
      console.log("\n❌ Order update failed:");
      console.log("Status:", updateResponse.status);
      console.log("Response:", updateResult);
    }
    
  } catch (error) {
    console.error("Error testing order edit API:", error);
  }
}

testOrderEditAPI();
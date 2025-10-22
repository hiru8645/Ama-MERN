import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Default stock threshold
  const DEFAULT_THRESHOLD = 10;

  // Helper function to determine stock status
  const getStockStatus = (stock, threshold = DEFAULT_THRESHOLD) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= threshold / 3) return "critical";
    if (stock <= threshold / 2) return "very-low";
    if (stock <= threshold) return "low";
    return "safe";
  };

  // Function to check and generate alerts
  const checkInventoryAlerts = useCallback(() => {
    const newAlerts = [];
    
    inventory.forEach(item => {
      const threshold = item.threshold || DEFAULT_THRESHOLD;
      const status = getStockStatus(item.stock, threshold);
      
      if (status === "out-of-stock") {
        newAlerts.push({
          id: `out-of-stock-${item.id}`,
          type: 'out-of-stock',
          message: `"${item.name || item.title}" is currently OUT OF STOCK and requires immediate restocking.`,
          item: item,
          priority: 1,
          timestamp: new Date()
        });
      } else if (status === "critical") {
        newAlerts.push({
          id: `critical-${item.id}`,
          type: 'critical',
          message: `"${item.name || item.title}" has reached CRITICAL stock level (${item.stock} units remaining).`,
          item: item,
          priority: 2,
          timestamp: new Date()
        });
      } else if (status === "very-low") {
        newAlerts.push({
          id: `very-low-${item.id}`,
          type: 'very-low',
          message: `"${item.name || item.title}" has very low stock (${item.stock} units remaining).`,
          item: item,
          priority: 3,
          timestamp: new Date()
        });
      } else if (status === "low") {
        newAlerts.push({
          id: `low-${item.id}`,
          type: 'low',
          message: `"${item.name || item.title}" has low stock (${item.stock} units remaining).`,
          item: item,
          priority: 4,
          timestamp: new Date()
        });
      }
    });
    
    // Sort by priority (most critical first)
    newAlerts.sort((a, b) => a.priority - b.priority);
    setAlerts(newAlerts);
    setLastUpdated(new Date());
  }, [inventory]);

  // Update inventory item
  const updateInventoryItem = useCallback((itemId, updates) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, ...updates, lastUpdated: new Date().toISOString() }
          : item
      )
    );
  }, []);

  // Add new inventory item
  const addInventoryItem = useCallback((newItem) => {
    const item = {
      ...newItem,
      id: newItem.id || Date.now(),
      threshold: newItem.threshold || DEFAULT_THRESHOLD,
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    setInventory(prev => [...prev, item]);
  }, []);

  // Remove inventory item
  const removeInventoryItem = useCallback((itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // Sync with products from API
  const syncWithProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      if (response.ok) {
        const products = await response.json();
        
        // Log products data for debugging
        console.log('📦 Syncing with products API:', products.length, 'products found');
        
        const inventoryItems = products.map(product => {
          const currentStock = parseInt(product.stockCurrent) || 0;
          const threshold = product.threshold || DEFAULT_THRESHOLD;
          
          // Log each product's stock for debugging
          console.log(`📊 Product: ${product.name} | Stock: ${currentStock} | Threshold: ${threshold}`);
          
          return {
            id: product._id || product.id,
            name: product.name,
            title: product.name, // For backward compatibility
            author: product.supplier || 'Unknown',
            category: product.category,
            stock: currentStock,
            threshold: threshold,
            price: parseFloat(product.price) || 0,
            supplier: product.supplier,
            status: product.status,
            code: product.code,
            stockTotal: product.stockTotal || 0,
            lastUpdated: new Date().toISOString()
          };
        });
        
        console.log('🔄 Inventory items prepared:', inventoryItems.length);
        
        // Update inventory and trigger alerts check
        setInventory(inventoryItems);
        setLastUpdated(new Date());
        
        // Force alert regeneration after inventory update
        setTimeout(() => {
          const newAlerts = [];
          let alertStats = { outOfStock: 0, critical: 0, veryLow: 0, low: 0, safe: 0 };
          
          console.log('🚨 Generating alerts for', inventoryItems.length, 'items...');
          
          inventoryItems.forEach(item => {
            const threshold = item.threshold || DEFAULT_THRESHOLD;
            const status = getStockStatus(item.stock, threshold);
            
            alertStats[status.replace('-', '').replace('_', '')]++;
            
            console.log(`⚠️  ${item.name}: Stock=${item.stock}, Threshold=${threshold}, Status=${status}`);
            
            if (status === "out-of-stock") {
              newAlerts.push({
                id: `out-of-stock-${item.id}`,
                type: 'out-of-stock',
                message: `"${item.name || item.title}" is currently OUT OF STOCK and requires immediate restocking.`,
                item: item,
                priority: 1,
                timestamp: new Date()
              });
            } else if (status === "critical") {
              newAlerts.push({
                id: `critical-${item.id}`,
                type: 'critical',
                message: `"${item.name || item.title}" has reached CRITICAL stock level (${item.stock} units remaining).`,
                item: item,
                priority: 2,
                timestamp: new Date()
              });
            } else if (status === "very-low") {
              newAlerts.push({
                id: `very-low-${item.id}`,
                type: 'very-low',
                message: `"${item.name || item.title}" has very low stock (${item.stock} units remaining).`,
                item: item,
                priority: 3,
                timestamp: new Date()
              });
            } else if (status === "low") {
              newAlerts.push({
                id: `low-${item.id}`,
                type: 'low',
                message: `"${item.name || item.title}" has low stock (${item.stock} units remaining).`,
                item: item,
                priority: 4,
                timestamp: new Date()
              });
            }
          });
          
          console.log('📊 Alert Statistics:', alertStats);
          console.log('🔔 Generated', newAlerts.length, 'alerts');
          
          // Sort by priority (most critical first)
          newAlerts.sort((a, b) => a.priority - b.priority);
          setAlerts(newAlerts);
        }, 100);
      }
    } catch (error) {
      console.error('Error syncing with products:', error);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (error) {
        console.error('Error loading inventory from localStorage:', error);
        // Fallback to syncing with products
        syncWithProducts();
      }
    } else {
      // Initial sync with products
      syncWithProducts();
    }
  }, [syncWithProducts]);

  // Save to localStorage when inventory changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Check alerts whenever inventory changes - direct implementation to avoid dependency cycles
  useEffect(() => {
    if (inventory.length > 0) {
      console.log('🔍 Inventory changed, recalculating alerts for', inventory.length, 'items');
      
      const newAlerts = [];
      let stockSummary = { total: 0, lowStock: 0, criticalStock: 0, outOfStock: 0 };
      
      inventory.forEach(item => {
        const threshold = item.threshold || DEFAULT_THRESHOLD;
        const status = getStockStatus(item.stock, threshold);
        
        stockSummary.total++;
        if (status === "out-of-stock") stockSummary.outOfStock++;
        else if (status === "critical") stockSummary.criticalStock++;
        else if (status === "very-low" || status === "low") stockSummary.lowStock++;
        
        if (status === "out-of-stock") {
          newAlerts.push({
            id: `out-of-stock-${item.id}`,
            type: 'out-of-stock',
            message: `"${item.name || item.title}" is currently OUT OF STOCK and requires immediate restocking.`,
            item: item,
            priority: 1,
            timestamp: new Date()
          });
        } else if (status === "critical") {
          newAlerts.push({
            id: `critical-${item.id}`,
            type: 'critical',
            message: `"${item.name || item.title}" has reached CRITICAL stock level (${item.stock} units remaining).`,
            item: item,
            priority: 2,
            timestamp: new Date()
          });
        } else if (status === "very-low") {
          newAlerts.push({
            id: `very-low-${item.id}`,
            type: 'very-low',
            message: `"${item.name || item.title}" has very low stock (${item.stock} units remaining).`,
            item: item,
            priority: 3,
            timestamp: new Date()
          });
        } else if (status === "low") {
          newAlerts.push({
            id: `low-${item.id}`,
            type: 'low',
            message: `"${item.name || item.title}" has low stock (${item.stock} units remaining).`,
            item: item,
            priority: 4,
            timestamp: new Date()
          });
        }
      });
      
      // Sort by priority (most critical first)
      newAlerts.sort((a, b) => a.priority - b.priority);
      
      console.log('📈 Stock Summary:', stockSummary);
      console.log('🚨 Alert Summary: Generated', newAlerts.length, 'alerts');
      
      setAlerts(newAlerts);
      setLastUpdated(new Date());
    } else {
      console.log('📦 No inventory items to process');
    }
  }, [inventory]);

  // Dismiss specific alert
  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Force sync when external stock changes occur
  const forceStockSync = useCallback(async () => {
    console.log('🔄 Force stock sync requested');
    try {
      await syncWithProducts();
      return true;
    } catch (error) {
      console.error('Force sync failed:', error);
      return false;
    }
  }, [syncWithProducts]);

  const value = {
    inventory,
    alerts,
    lastUpdated,
    updateInventoryItem,
    addInventoryItem,
    removeInventoryItem,
    syncWithProducts,
    forceStockSync,
    checkInventoryAlerts,
    dismissAlert,
    clearAllAlerts,
    getStockStatus
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

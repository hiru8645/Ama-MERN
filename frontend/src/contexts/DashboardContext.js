// DashboardContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    products: [],
    suppliers: [],
    inventory: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const [refreshing, setRefreshing] = useState(false);

  // API base URL - adjust this to match your backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Fetch data from APIs
  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      console.log('Fetching dashboard data from:', API_BASE_URL);
      
      // Fetch all data concurrently
      const [productsRes, suppliersRes, inventoryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products`).catch((err) => {
          console.warn('Products fetch failed:', err);
          return { ok: false, json: () => [] };
        }),
        fetch(`${API_BASE_URL}/api/suppliers`).catch((err) => {
          console.warn('Suppliers fetch failed:', err);
          return { ok: false, json: () => [] };
        }),
        fetch(`${API_BASE_URL}/api/inventory`).catch((err) => {
          console.warn('Inventory fetch failed:', err);
          return { ok: false, json: () => ({ Items: [] }) };
        })
      ]);

      let products = [];
      let suppliers = [];
      let inventory = [];

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        products = productsData;
        console.log('Products fetched:', products.length, 'items');
      } else {
        console.warn('Products API response not ok:', productsRes.status);
      }

      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        suppliers = suppliersData;
        console.log('Suppliers fetched:', suppliers.length, 'items');
      } else {
        console.warn('Suppliers API response not ok:', suppliersRes.status);
      }

      if (inventoryRes.ok) {
        const inventoryResponse = await inventoryRes.json();
        inventory = inventoryResponse.Items || inventoryResponse || [];
        console.log('Inventory fetched:', inventory.length, 'items');
      } else {
        console.warn('Inventory API response not ok:', inventoryRes.status);
      }

      setDashboardData({
        products: Array.isArray(products) ? products : [],
        suppliers: Array.isArray(suppliers) ? suppliers : [],
        inventory: Array.isArray(inventory) ? inventory : [],
        loading: false,
        error: null,
        lastUpdated: new Date()
      });

      console.log('Dashboard data updated successfully at:', new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message,
        lastUpdated: new Date()
      }));
    } finally {
      setRefreshing(false);
    }
  }, [API_BASE_URL]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Manual refresh function
  const refreshData = () => {
    fetchDashboardData();
  };

  // Update specific data when CRUD operations happen
  const updateProducts = (newProducts) => {
    setDashboardData(prev => ({
      ...prev,
      products: newProducts,
      lastUpdated: new Date()
    }));
  };

  const updateSuppliers = (newSuppliers) => {
    setDashboardData(prev => ({
      ...prev,
      suppliers: newSuppliers,
      lastUpdated: new Date()
    }));
  };

  const updateInventory = (newInventory) => {
    setDashboardData(prev => ({
      ...prev,
      inventory: newInventory,
      lastUpdated: new Date()
    }));
  };

  // Add single item functions
  const addProduct = (product) => {
    setDashboardData(prev => ({
      ...prev,
      products: [...prev.products, product],
      lastUpdated: new Date()
    }));
  };

  const addSupplier = (supplier) => {
    setDashboardData(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, supplier],
      lastUpdated: new Date()
    }));
  };

  const addInventoryItem = (item) => {
    setDashboardData(prev => ({
      ...prev,
      inventory: [...prev.inventory, item],
      lastUpdated: new Date()
    }));
  };

  // Update single item functions
  const updateProduct = (id, updatedProduct) => {
    setDashboardData(prev => ({
      ...prev,
      products: prev.products.map(product => 
        product._id === id ? { ...product, ...updatedProduct } : product
      ),
      lastUpdated: new Date()
    }));
  };

  const updateSupplier = (id, updatedSupplier) => {
    setDashboardData(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(supplier => 
        supplier._id === id ? { ...supplier, ...updatedSupplier } : supplier
      ),
      lastUpdated: new Date()
    }));
  };

  const updateInventoryItem = (id, updatedItem) => {
    setDashboardData(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => 
        item._id === id ? { ...item, ...updatedItem } : item
      ),
      lastUpdated: new Date()
    }));
  };

  // Delete functions
  const deleteProduct = (id) => {
    setDashboardData(prev => ({
      ...prev,
      products: prev.products.filter(product => product._id !== id),
      lastUpdated: new Date()
    }));
  };

  const deleteSupplier = (id) => {
    setDashboardData(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter(supplier => supplier._id !== id),
      lastUpdated: new Date()
    }));
  };

  const deleteInventoryItem = (id) => {
    setDashboardData(prev => ({
      ...prev,
      inventory: prev.inventory.filter(item => item._id !== id),
      lastUpdated: new Date()
    }));
  };

  const value = {
    dashboardData,
    refreshing,
    refreshData,
    // Bulk update functions
    updateProducts,
    updateSuppliers,
    updateInventory,
    // Individual item functions
    addProduct,
    addSupplier,
    addInventoryItem,
    updateProduct,
    updateSupplier,
    updateInventoryItem,
    deleteProduct,
    deleteSupplier,
    deleteInventoryItem
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;

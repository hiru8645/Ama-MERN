// hooks/useAPI.js
import { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    addProduct,
    addSupplier,
    addInventoryItem,
    updateProduct,
    updateSupplier,
    updateInventoryItem,
    deleteProduct,
    deleteSupplier,
    deleteInventoryItem,
    refreshData
  } = useDashboard();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleAPICall = async (apiCall, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Product API functions
  const createProduct = async (productData) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create product');
        }
        
        const newProduct = await response.json();
        return newProduct;
      },
      (product) => addProduct(product)
    );
  };

  const updateProductAPI = async (id, productData) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        
        const updatedProduct = await response.json();
        return updatedProduct;
      },
      (product) => updateProduct(id, product)
    );
  };

  const deleteProductAPI = async (id) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        return { id };
      },
      () => deleteProduct(id)
    );
  };

  // Supplier API functions
  const createSupplier = async (supplierData) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/suppliers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(supplierData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create supplier');
        }
        
        const newSupplier = await response.json();
        return newSupplier;
      },
      (supplier) => addSupplier(supplier)
    );
  };

  const updateSupplierAPI = async (id, supplierData) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(supplierData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update supplier');
        }
        
        const updatedSupplier = await response.json();
        return updatedSupplier;
      },
      (supplier) => updateSupplier(id, supplier)
    );
  };

  const deleteSupplierAPI = async (id) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete supplier');
        }
        
        return { id };
      },
      () => deleteSupplier(id)
    );
  };

  // Inventory API functions
  const createInventoryItem = async (itemData) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/inventory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create inventory item');
        }
        
        const newItem = await response.json();
        return newItem;
      },
      (item) => addInventoryItem(item)
    );
  };

  const updateInventoryItemAPI = async (id, itemData) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update inventory item');
        }
        
        const updatedItem = await response.json();
        return updatedItem;
      },
      (item) => updateInventoryItem(id, item)
    );
  };

  const deleteInventoryItemAPI = async (id) => {
    return handleAPICall(
      async () => {
        const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete inventory item');
        }
        
        return { id };
      },
      () => deleteInventoryItem(id)
    );
  };

  return {
    loading,
    error,
    // Product functions
    createProduct,
    updateProduct: updateProductAPI,
    deleteProduct: deleteProductAPI,
    // Supplier functions
    createSupplier,
    updateSupplier: updateSupplierAPI,
    deleteSupplier: deleteSupplierAPI,
    // Inventory functions
    createInventoryItem,
    updateInventoryItem: updateInventoryItemAPI,
    deleteInventoryItem: deleteInventoryItemAPI,
    // Utility
    refreshData,
    clearError: () => setError(null)
  };
};

export default useAPI;

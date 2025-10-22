import React, { useState } from "react";
import "./Product.css";
import Header from "./Header";
import { useInventory } from '../contexts/InventoryContext';
import {
  FaBook,
  FaPencilAlt,
  FaTrashAlt,
  FaSort,
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

// Backend CRUD API base URL
const API_URL = "http://localhost:5001/api/products";


const Product = ({ setCurrentPage }) => {
  const { syncWithProducts } = useInventory();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    stockCurrent: "",
    stockTotal: "",
    status: "",
    supplier: "",
    // Supplier fields
    supplierContact: "",
    supplierEmail: "",
    supplierPhone: "",
    supplierAddress: "",
    supplierBooks: "",
  });

  // Fetch all products from backend
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        // Add icon and color fields for UI
        setProducts(
          data.map((p) => ({
            ...p,
            icon: <FaBook />,
            stockColor:
              p.stockCurrent / p.stockTotal > 0.5
                ? "#3b82f6"
                : p.stockCurrent > 0
                ? "#f59e0b"
                : "#6b7280",
            statusColor:
              p.status === "IN STOCK"
                ? "#22c55e"
                : p.status === "LOW STOCK"
                ? "#f59e0b"
                : "#ef4444",
          }))
        );
      } catch (error) {
        console.error('Error fetching products:', error);
        alert(`Error loading products: ${error.message}`);
      }
    };
    
    fetchProducts();
  }, []);

  // Default options for dropdowns
  const defaultCategories = [
    "Information Technology",
    "Computer Science",
    "Cyber Security",
    "Mathematics",
    "Engineering",
    "Literature",
    "Other"
  ];
  const defaultStatuses = [
    "IN STOCK",
    "LOW STOCK",
    "OUT OF STOCK"
  ];
  const defaultSuppliers = [
    "MIT Press",
    "Pearson",
    "McGraw-Hill",
    "Oxford",
    "Other"
  ];

  // Merge product values with defaults for dropdowns
  const categories = [
    "All Categories",
    ...Array.from(new Set([...defaultCategories, ...products.map((p) => p.category).filter(Boolean)])),
  ];
  const statuses = [
    "All Status",
    ...Array.from(new Set([...defaultStatuses, ...products.map((p) => p.status).filter(Boolean)])),
  ];
  const suppliers = [
    "All Suppliers",
    ...Array.from(new Set([...defaultSuppliers, ...products.map((p) => p.supplier).filter(Boolean)])),
  ];

  const filteredProducts = products.filter((p) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(lowerSearch) ||
      p.code.toLowerCase().includes(lowerSearch) ||
      p.category.toLowerCase().includes(lowerSearch) ||
      p.supplier.toLowerCase().includes(lowerSearch);
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Status" || p.status === selectedStatus;
    const matchesSupplier = selectedSupplier === "All Suppliers" || p.supplier === selectedSupplier;
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  // -------------------------------
  // Form Handlers
  // -------------------------------
  const handleAddButton = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewProduct({
      name: "",
      code: "",
      category: "",
      price: "",
      stockCurrent: "",
      stockTotal: "",
      status: "",
      supplier: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!newProduct.name || !newProduct.code || !newProduct.category || 
        !newProduct.price || !newProduct.stockCurrent || !newProduct.stockTotal || 
        !newProduct.status || !newProduct.supplier || 
        !newProduct.supplierContact || !newProduct.supplierEmail || !newProduct.supplierPhone || 
        !newProduct.supplierAddress || !newProduct.supplierBooks) {
      alert("All product and supplier fields are required!");
      return;
    }

    const stockCurrent = parseInt(newProduct.stockCurrent);
    const stockTotal = parseInt(newProduct.stockTotal);
    
    // Validate stock numbers
    if (isNaN(stockCurrent) || isNaN(stockTotal) || stockCurrent < 0 || stockTotal < 0) {
      alert("Stock values must be valid positive numbers!");
      return;
    }
    
    if (stockCurrent > stockTotal) {
      alert("Current stock cannot be greater than total stock!");
      return;
    }

    // Validate price format
    const priceRegex = /^Rs\.?\d+(\.\d{2})?$/;
    if (!priceRegex.test(newProduct.price.replace(/[,Rs\.]/g, ''))) {
      alert("Please enter a valid price format (e.g., Rs.49.99 or 49.99)!");
      return;
    }

    // Validate phone number format (Sri Lankan phone numbers)
    const phoneRegex = /^(\+94|0)?[1-9]\d{8}$/;
    if (!phoneRegex.test(newProduct.supplierPhone.replace(/[\s\-\(\)]/g, ''))) {
      alert("Please enter a valid Sri Lankan phone number (e.g., +94771234567, 0771234567, or 771234567)!");
      return;
    }

    const statusText = newProduct.status.toUpperCase();
    
    // Prepare product payload (excluding supplier detail fields)
    const productPayload = {
      name: newProduct.name,
      code: newProduct.code,
      category: newProduct.category,
      price: newProduct.price,
      stockCurrent,
      stockTotal,
      status: statusText,
      supplier: newProduct.supplier,
      lastUpdated: new Date().toLocaleString(),
    };
    
    // Prepare supplier payload
    const supplierPayload = {
      name: newProduct.supplierContact, // Use contact person as supplier name
      contact: newProduct.supplierContact,
      email: newProduct.supplierEmail,
      phone: newProduct.supplierPhone,
      address: newProduct.supplierAddress,
      books: newProduct.supplierBooks,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    
    try {
      // First, create/update the supplier
      const supplierResponse = await fetch("http://localhost:5001/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierPayload),
      });
      
      if (!supplierResponse.ok) {
        throw new Error('Failed to create supplier');
      }
      
      if (isEditing) {
        // Update product
        const response = await fetch(`${API_URL}/${editProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
      } else {
        // Add product
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
      }
      
      // Refresh products
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch updated products');
      }
      
      const data = await response.json();
      setProducts(
        data.map((p) => ({
          ...p,
          icon: <FaBook />,
          stockColor:
            p.stockCurrent / p.stockTotal > 0.5
              ? "#3b82f6"
              : p.stockCurrent > 0
              ? "#f59e0b"
              : "#6b7280",
          statusColor:
            p.status === "IN STOCK"
              ? "#22c55e"
              : p.status === "LOW STOCK"
              ? "#f59e0b"
              : "#ef4444",
        }))
      );
      
      // Sync with inventory context to trigger alerts
      await syncWithProducts();
      
      setShowForm(false);
      setNewProduct({
        name: "",
        code: "",
        category: "",
        price: "",
        stockCurrent: "",
        stockTotal: "",
        status: "",
        supplier: "",
        // Supplier fields
        supplierContact: "",
        supplierEmail: "",
        supplierPhone: "",
        supplierAddress: "",
        supplierBooks: "",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setNewProduct({
      name: "",
      code: "",
      category: "",
      price: "",
      stockCurrent: "",
      stockTotal: "",
      status: "",
      supplier: "",
      // Supplier fields
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierAddress: "",
      supplierBooks: "",
    });
  };

  // -------------------------------
  // Action Handlers
  // -------------------------------
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setNewProduct({
      name: product.name,
      code: product.code,
      category: product.category,
      price: product.price,
      stockCurrent: product.stockCurrent,
      stockTotal: product.stockTotal,
      status: product.status,
      supplier: product.supplier,
      // Supplier fields - initialize empty for edit mode
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierAddress: "",
      supplierBooks: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        // Refresh products
        const refreshResponse = await fetch(API_URL);
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh products after deletion');
        }
        
        const data = await refreshResponse.json();
        setProducts(
          data.map((p) => ({
            ...p,
            icon: <FaBook />,
            stockColor:
              p.stockCurrent / p.stockTotal > 0.5
                ? "#3b82f6"
                : p.stockCurrent > 0
                ? "#f59e0b"
                : "#6b7280",
            statusColor:
              p.status === "IN STOCK"
                ? "#22c55e"
                : p.status === "LOW STOCK"
                ? "#f59e0b"
                : "#ef4444",
          }))
        );
        
        // Sync with inventory context to trigger alerts
        await syncWithProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error deleting product: ${error.message}`);
      }
    }
  };

  return (
    <>
      {setCurrentPage && <Header setCurrentPage={setCurrentPage} />}
      <div className="product-container" style={{ 
        marginLeft: setCurrentPage ? '240px' : '0', 
        marginTop: setCurrentPage ? '80px' : '0' 
      }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Inventory Management</h1>
          <p className="hero-subtitle">
            Seamlessly manage your inventory with intelligent tracking and real-time insights
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search books, categories, suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="action-buttons">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-button ${showFilters ? 'active' : ''}`}
            >
              <FaFilter className="button-icon" />
              Filters
            </button>
            <button onClick={handleAddButton} className="add-button">
              <FaPlus className="button-icon" />
              Add Book & Supplier
            </button>
          </div>
        </div>

        {/* Animated Filter Panel */}
          <div className={`filter-panel${showFilters ? ' show' : ''}`}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="filter-select"
          >
            {suppliers.map((sup) => (
              <option key={sup} value={sup}>{sup}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modern Card-Based Table */}
      <div className="table-container">
        <div className="table-header">
          <div className="header-cell">
            <input type="checkbox" className="checkbox" />
          </div>
          <div className="header-cell">PRODUCT</div>
          <div className="header-cell">
            CATEGORY <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">
            PRICE <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">
            STOCK <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">
            STATUS <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">SUPPLIER</div>
          <div className="header-cell">
            LAST UPDATED <FaSort className="sort-icon" />
          </div>
          <div className="header-cell">ACTIONS</div>
        </div>

        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="table-row"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="table-cell">
              <input type="checkbox" className="checkbox" />
            </div>
            
            <div className="table-cell">
              <div className="product-info">
                <div className="product-icon">{product.icon}</div>
                <div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-code">{product.code}</div>
                </div>
              </div>
            </div>

            <div className="table-cell">
              <span className="category-pill">{product.category}</span>
            </div>

            <div className="table-cell">
              <span className="price">{product.price}</span>
            </div>

            <div className="table-cell">
              <div className="stock-info">
                <div className="stock-text">
                  {product.stockCurrent} / {product.stockTotal}
                </div>
                <div className="stock-bar">
                  <div
                    className="stock-progress"
                    style={{
                      width: `${(product.stockCurrent / product.stockTotal) * 100}%`,
                      backgroundColor: product.stockColor
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="table-cell">
              <span
                className="status-pill"
                style={{ backgroundColor: product.statusColor }}
              >
                {product.status}
              </span>
            </div>

            <div className="table-cell">
              <span className="supplier">{product.supplier}</span>
            </div>

            <div className="table-cell">
              <span className="last-updated">{product.lastUpdated}</span>
            </div>

            <div className="table-cell">
              <div className="actions">
                <div
                  className="action-icon edit-icon"
                  onClick={() => handleEdit(product)}
                >
                  <FaPencilAlt />
                </div>
                <div
                  className="action-icon delete-icon"
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrashAlt />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-backdrop" onClick={handleFormCancel} />
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditing ? "Edit Book" : "Add New Book & Supplier"}
              </h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Book Name</label>
                  <input
                    name="name"
                    placeholder="Enter book name"
                    value={newProduct.name}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Product Code</label>
                  <input
                    name="code"
                    placeholder="Enter product code"
                    value={newProduct.code}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleFormChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== "All Categories").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    name="price"
                    placeholder="e.g., Rs.49.99"
                    value={newProduct.price}
                    onChange={handleFormChange}
                    className="form-input"
                    pattern="^Rs\.?\d+(\.\d{2})?$"
                    title="Please enter a valid price format (e.g., Rs.49.99 or 49.99)"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Current Stock</label>
                  <input
                    name="stockCurrent"
                    type="number"
                    min="0"
                    placeholder="Enter current stock"
                    value={newProduct.stockCurrent}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Total Stock</label>
                  <input
                    name="stockTotal"
                    type="number"
                    min="1"
                    placeholder="Enter total stock"
                    value={newProduct.stockTotal}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={newProduct.status}
                    onChange={handleFormChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Status</option>
                    {statuses.filter(s => s !== "All Status").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Supplier</label>
                  <select
                    name="supplier"
                    value={newProduct.supplier}
                    onChange={handleFormChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.filter(s => s !== "All Suppliers").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Supplier Details Section */}
              <div className="form-section">
                <h3 className="form-section-title">Supplier Details</h3>
                <div className="form-fields-grid">
                  <div className="form-group">
                    <label className="form-label">Contact Person *</label>
                    <input
                      name="supplierContact"
                      placeholder="Enter contact person"
                      value={newProduct.supplierContact}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      name="supplierEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={newProduct.supplierEmail}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input
                      name="supplierPhone"
                      placeholder="e.g., +94771234567 or 0771234567"
                      value={newProduct.supplierPhone}
                      onChange={handleFormChange}
                      className="form-input"
                      pattern="^(\+94|0)?[1-9]\d{8}$"
                      title="Please enter a valid Sri Lankan phone number (e.g., +94771234567, 0771234567, or 771234567)"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <input
                      name="supplierAddress"
                      placeholder="Enter address"
                      value={newProduct.supplierAddress}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Books Supplied *</label>
                    <input
                      name="supplierBooks"
                      placeholder="Enter books supplied"
                      value={newProduct.supplierBooks}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditing ? "Update Book" : "Add Book & Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Product;

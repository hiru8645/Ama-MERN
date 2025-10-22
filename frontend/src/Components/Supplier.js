import React, { useState } from "react";
import "./Supplier.css";
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaTruck,
} from "react-icons/fa";

// Backend CRUD API base URL
const API_URL = "http://localhost:5001/api/suppliers";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
    // Fetch all suppliers from backend
    React.useEffect(() => {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => setSuppliers(data));
    }, []);
    const [filterOpen, setFilterOpen] = useState(false);

    // Filter suppliers based on search term
    const filteredSuppliers = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Keep only the delete handler since suppliers can still be deleted
    const handleEdit = (supplier) => {
      alert('Supplier editing has been moved to the Products page. Please edit supplier details when adding/editing products.');
    };

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        // Refresh suppliers
        fetch(API_URL)
          .then((res) => res.json())
          .then((data) => setSuppliers(data));
      }
    };

    return (
      <>
        <div className="supplier-container">
          {/* Hero Section */}
          <div className="supplier-hero">
            <div className="supplier-hero-content">
              <FaTruck className="hero-icon" />
              <h1 className="supplier-title gradient-text">Suppliers</h1>
              <p className="supplier-subtitle">
                Manage your book suppliers efficiently in one place
              </p>
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="search-section">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search suppliers..."
                  aria-label="Search suppliers"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="action-buttons">
                <button
                  className={`filter-button ${filterOpen ? "active" : ""}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FaFilter className="button-icon" /> Filters
                </button>
                <div className="info-message">
                  <span>📝 Add suppliers through the Products page when adding books</span>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className={`filter-panel ${filterOpen ? "show" : ""}`}>
              <select className="filter-select">
                <option value="">Sort by Name</option>
                <option value="date">Sort by Last Updated</option>
              </select>
              <select className="filter-select">
                <option value="">All Categories</option>
                <option value="cs">Computer Science</option>
                <option value="math">Mathematics</option>
                <option value="eng">Engineering</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <div className="header-cell">#</div>
              <div className="header-cell">Supplier Name</div>
              <div className="header-cell">Contact Person</div>
              <div className="header-cell">Email</div>
              <div className="header-cell">Phone</div>
              <div className="header-cell">Address</div>
              <div className="header-cell">Books Supplied</div>
              <div className="header-cell">Last Updated</div>
              <div className="header-cell">Actions</div>
            </div>

            {filteredSuppliers.map((supplier, index) => (
              <div className="table-row" key={supplier._id}>
                <div className="table-cell">{index + 1}</div>
                <div className="table-cell supplier-name">{supplier.name}</div>
                <div className="table-cell">{supplier.contact}</div>
                <div className="table-cell">{supplier.email}</div>
                <div className="table-cell">{supplier.phone}</div>
                <div className="table-cell">{supplier.address}</div>
                <div className="table-cell books-supplied">
                  {supplier.books}
                </div>
                <div className="table-cell last-updated">{supplier.lastUpdated}</div>
                <div className="table-cell actions">
                  <button className="action-icon edit-icon" onClick={() => handleEdit(supplier)}>
                    <FaEdit />
                  </button>
                  <button className="action-icon delete-icon" onClick={() => handleDelete(supplier._id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

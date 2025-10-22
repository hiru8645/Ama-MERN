import React from "react";
import { NavLink } from "react-router-dom";
import "../../Admin/Sidebar/Sidebar.css";

function OrderAdminSidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">Orders Admin</div><br></br>
      <nav className="sidebar-links"><br></br>
        <NavLink to="/admin" className={({ isActive }) => isActive ? "active-link" : ""}>Dashboard</NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "active-link" : ""}>Orders</NavLink>
      </nav>
    </div>
  );
}

export default OrderAdminSidebar;



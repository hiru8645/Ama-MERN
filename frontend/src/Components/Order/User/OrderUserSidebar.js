import React from "react";
import { NavLink } from "react-router-dom";
import "../../User/UserSidebar/UserSidebar.css";

function OrderUserSidebar() {
  return (
    <div className="sidebarU">
      <div className="sidebarU-logo">Orders</div>
      <nav className="sidebarU-links">
        <NavLink to="/user" className={({ isActive }) => isActive ? "active-link" : ""}>Dashboard</NavLink>
        <NavLink to="/user/books" className={({ isActive }) => isActive ? "active-link" : ""}>Books</NavLink>
        <NavLink to="/user/orders" className={({ isActive }) => isActive ? "active-link" : ""}>My Orders</NavLink>
      </nav>
    </div>
  );
}

export default OrderUserSidebar;



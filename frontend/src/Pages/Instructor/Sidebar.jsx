import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/instructor-dashboard", icon: "bi-grid-1x2-fill" },
    { path: "/instructor/courses", icon: "bi-book" },
    { path: "/instructor/students", icon: "bi-people" },
    
    { path: "/instructor/settings", icon: "bi-gear" },
  ];

  return (
    <div style={sidebarStyle}>
      {/* Logo Area */}
      <div style={{ marginBottom: "50px", color: "#4318FF", fontSize: "1.8rem" }}>
        <i className="bi bi-mortarboard-fill"></i>
      </div>

      {/* Navigation Icons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...iconWrapperStyle,
              backgroundColor: location.pathname === item.path ? "#F4F7FE" : "transparent",
              color: location.pathname === item.path ? "#4318FF" : "#A3AED0",
            }}
          >
            <i className={`bi ${item.icon}`} style={{ fontSize: "1.4rem" }}></i>
          </Link>
        ))}
      </div>

      {/* Logout at bottom */}
      <div style={{ marginTop: "auto", paddingBottom: "30px" }}>
        <Link to="/" style={{ color: "#A3AED0", textDecoration: "none" }}>
          <i className="bi bi-box-arrow-right" style={{ fontSize: "1.4rem" }}></i>
        </Link>
      </div>
    </div>
  );
};

const sidebarStyle = {
  width: "80px",
  height: "100vh",
  backgroundColor: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "30px",
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 1000,
  boxShadow: "4px 0 10px rgba(0,0,0,0.02)",
};

const iconWrapperStyle = {
  width: "50px",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "15px",
  textDecoration: "none",
  transition: "0.3s all ease",
};

export default Sidebar;
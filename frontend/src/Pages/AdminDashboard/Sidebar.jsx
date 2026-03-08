import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItemStyle = ({ isActive }) => ({
    fontSize: "1.4rem",
    marginBottom: "25px",
    width: "54px",
    height: "54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    color: isActive ? "#4318FF" : "#A3AED0",
    backgroundColor: isActive ? "#F4F7FE" : "transparent",
    position: "relative",
    transition: "all 0.3s ease",
    textDecoration: "none",
    filter: isActive ? "drop-shadow(0px 0px 8px rgba(67, 24, 255, 0.3))" : "none"
  });

  return (
    <div style={sidebarContainer}>
      {/* Brand Icon */}
      <div style={logoStyle}>
        <i className="bi bi-grid-1x2-fill"></i>
      </div>

      <div className="d-flex flex-column align-items-center w-100">
        <NavLink to="/admin" end style={navItemStyle}>
          <i className="bi bi-house-door"></i>
        </NavLink>

        <NavLink to="/admin/instructors" style={navItemStyle}>
          <i className="bi bi-people"></i>
        </NavLink>

        <NavLink to="/admin/reports" style={navItemStyle}>
          <i className="bi bi-journal-text"></i>
        </NavLink>
      </div>

      <NavLink to="/admin/settings" style={({ isActive }) => ({ ...navItemStyle({ isActive }), marginTop: "auto", marginBottom: "30px" })}>
        <i className="bi bi-gear"></i>
      </NavLink>
    </div>
  );
};

const sidebarContainer = {
  width: "90px",
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
  boxShadow: "4px 0px 40px rgba(0, 0, 0, 0.04)", // Soft ambient shadow
};

const logoStyle = {
  marginBottom: "50px",
  color: "#4318FF",
  fontSize: "2rem",
  filter: "drop-shadow(0px 4px 10px rgba(67, 24, 255, 0.2))"
};

export default Sidebar;
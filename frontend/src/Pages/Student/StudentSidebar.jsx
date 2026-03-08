import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menuItems = [
    { path: "/student/dashboard", icon: "bi-grid-fill", label: "Dashboard" },
    { path: "/student/my-courses", icon: "bi-book", label: "My Courses" },
    { path: "/student/settings", icon: "bi-gear-wide-connected", label: "Settings" },
  ];

  return (
    <div style={sidebarStyle}>
      {/* Brand Icon - Clean & Floating */}
      <div className="text-center py-4 mb-4">
        <div 
          className="d-inline-flex align-items-center justify-content-center shadow-sm"
          style={{ 
            width: "52px", height: "52px", 
            background: "linear-gradient(135deg, #4318FF 0%, #707EFF 100%)", 
            borderRadius: "18px",
            boxShadow: "0px 8px 16px rgba(67, 24, 255, 0.25)" 
          }}
        >
          <i className="bi bi-mortarboard-fill text-white fs-4"></i>
        </div>
      </div>

      {/* Navigation Icons - With Lighting Effect */}
      <div className="flex-grow-1 d-flex flex-column align-items-center gap-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={navItemStyle(isActive)}
              title={item.label}
              className="text-decoration-none d-flex align-items-center justify-content-center"
            >
              <i className={`bi ${item.icon} fs-4`} style={{ 
                zIndex: 2,
                color: isActive ? "#4318FF" : "#A3AED0",
                filter: isActive ? "drop-shadow(0px 0px 8px rgba(67, 24, 255, 0.6))" : "none"
              }}></i>
              
              {isActive && <div style={activeGlow}></div>}
              {isActive && <div style={activeBar}></div>}
            </Link>
          );
        })}
      </div>

      {/* Logout - Soft & Borderless */}
      <div className="p-4 d-flex justify-content-center">
        <button 
          onClick={handleLogout}
          className="btn d-flex align-items-center justify-content-center border-0"
          style={{ 
            borderRadius: "16px", width: "48px", height: "48px",
            backgroundColor: "#FFF5F6", // Very soft red tint
            color: "#EE5D6E",
            transition: "all 0.3s ease"
          }}
        >
          <i className="bi bi-box-arrow-left fs-4"></i>
        </button>
      </div>
    </div>
  );
};

// --- LIGHT & GLOWING STYLES ---

const sidebarStyle = {
  width: "90px", 
  height: "100vh",
  background: "#FFFFFF", 
  position: "fixed",
  left: 0,
  top: 0,
  display: "flex",
  flexDirection: "column",
  // Removed dark border, replaced with soft ambient shadow
  boxShadow: "4px 0px 40px rgba(0, 0, 0, 0.04)",
  zIndex: 1000,
};

const navItemStyle = (isActive) => ({
  width: "54px",
  height: "54px",
  borderRadius: "18px",
  backgroundColor: isActive ? "#F4F7FE" : "transparent",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
});

const activeBar = {
  position: "absolute",
  right: "-18px", 
  width: "4px",
  height: "35px",
  background: "#4318FF",
  borderRadius: "4px 0 0 4px",
  boxShadow: "0px 0px 12px rgba(67, 24, 255, 0.5)",
};

const activeGlow = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "18px",
    background: "rgba(67, 24, 255, 0.08)",
    filter: "blur(4px)",
    zIndex: 1
};

export default StudentSidebar;
import React, { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar";

const StudentSettings = () => {
  // Check local storage for saved preference or default to light
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply theme class to the body when state changes
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#111c44"; // Dark Navy
      localStorage.setItem("theme", "dark");
    } else {
      document.body.style.backgroundColor = "#F4F7FE"; // Light Blue-Grey
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <StudentSidebar />
      <div style={{ 
        marginLeft: "80px", 
        padding: "30px", 
        width: "100%", 
        color: darkMode ? "#ffffff" : "#2B3674" 
      }}>
        
        <div className="mb-4">
          <h3 className="fw-bold">Account Settings</h3>
          <p className={darkMode ? "text-white-50" : "text-muted"}>
            Manage your profile and application preferences.
          </p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* APPEARANCE SECTION */}
            <div className="card border-0 shadow-sm p-4 mb-4" 
                 style={{ 
                   borderRadius: "20px", 
                   backgroundColor: darkMode ? "#1b254b" : "#ffffff" 
                 }}>
              <h6 className="fw-bold mb-4" style={{ color: darkMode ? "#707EFF" : "#4318FF" }}>
                APPEARANCE
              </h6>
              
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 fw-bold" style={{ color: darkMode ? "#ffffff" : "#2B3674" }}>
                    Dark Mode
                  </h6>
                  <p className="small mb-0 opacity-50">
                    Switch between light and dark themes for a better experience.
                  </p>
                </div>
                
                <div className="form-check form-switch fs-4">
                  <input 
                    className="form-check-input mt-0" 
                    type="checkbox" 
                    role="switch" 
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>

            {/* PROFILE SECTION (Placeholder) */}
            <div className="card border-0 shadow-sm p-4" 
                 style={{ 
                   borderRadius: "20px", 
                   backgroundColor: darkMode ? "#1b254b" : "#ffffff" 
                 }}>
              <h6 className="fw-bold mb-4" style={{ color: darkMode ? "#707EFF" : "#4318FF" }}>
                PROFILE INFORMATION
              </h6>
              <div className="mb-3">
                <label className="small fw-bold opacity-75 mb-2">Display Name</label>
                <input 
                  type="text" 
                  className={`form-control border-0 rounded-pill px-4 ${darkMode ? 'bg-navy-900 text-white' : 'bg-light'}`}
                  style={{ height: "50px", backgroundColor: darkMode ? "#111c44" : "#F4F7FE" }}
                  placeholder="Student Name"
                />
              </div>
              <button className="btn btn-primary rounded-pill fw-bold py-2 px-4 mt-2" style={{ backgroundColor: "#4318FF", border: "none" }}>
                Save Changes
              </button>
            </div>
            {/* --- ADD THESE INSIDE THE ROW AFTER YOUR PROFILE SECTION --- */}

{/* --- ADD THESE INSIDE THE ROW AFTER YOUR PROFILE SECTION --- */}

{/* SECTION 3: LEARNING PREFERENCES */}
<div className="card border-0 shadow-sm p-4 mt-4" style={{ borderRadius: "20px" }}>
  <h6 className="fw-bold mb-4" style={{ color: "#4318FF" }}>LEARNING GOALS</h6>
  <div className="mb-3">
    <label className="small fw-bold text-muted mb-2">What is your primary goal?</label>
    <select className="form-select border-0 bg-light rounded-pill px-4" style={{ height: "45px" }}>
      <option>Career Transition</option>
      <option>Skill Upskilling</option>
      <option>Personal Project</option>
      <option>Academic Requirement</option>
    </select>
  </div>
  <div className="mb-2">
    <label className="small fw-bold text-muted mb-2">Weekly Study Target (Hours)</label>
    <input type="number" className="form-control border-0 bg-light rounded-pill px-4" placeholder="e.g. 10" style={{ height: "45px" }} />
  </div>
</div>

{/* SECTION 4: NOTIFICATIONS */}
<div className="card border-0 shadow-sm p-4 mt-4" style={{ borderRadius: "20px" }}>
  <h6 className="fw-bold mb-4" style={{ color: "#4318FF" }}>NOTIFICATIONS</h6>
  <div className="d-flex justify-content-between align-items-center mb-3">
    <div>
      <h6 className="mb-0 small fw-bold">Email Notifications</h6>
      <p className="small text-muted mb-0">Receive updates about new course materials.</p>
    </div>
    <div className="form-check form-switch fs-5">
      <input className="form-check-input" type="checkbox" defaultChecked />
    </div>
  </div>
  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
    <div>
      <h6 className="mb-0 small fw-bold">Live Class Alerts</h6>
      <p className="small text-muted mb-0">Reminders for scheduled meetings.</p>
    </div>
    <div className="form-check form-switch fs-5">
      <input className="form-check-input" type="checkbox" defaultChecked />
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
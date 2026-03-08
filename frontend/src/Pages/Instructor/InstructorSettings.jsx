import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Instructor/Sidebar";

const InstructorSettings = () => {
  const navigate = useNavigate();

  // State management for the form fields
  const [profile, setProfile] = useState({
    name: "Instructor Name",
    email: "instructor@example.com", // Read-only as per business logic
    bio: "Lead Design Instructor specializing in UI/UX and Web Development.",
    specialization: "Full Stack Development",
    officeHours: "Mon-Fri, 04:00 PM - 06:00 PM",
    maxStudents: 50
  });

  const [notifications, setNotifications] = useState({
    enrollment: true,
    labActivity: true,
    reminders: true
  });

  return (
    <div style={{ display: "flex" }}>
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Container */}
      <div style={{ 
        marginLeft: "80px", 
        padding: "30px", 
        backgroundColor: "#F4F7FE", 
        width: "100%", 
        minHeight: "100vh",
        flexGrow: 1 
      }}>
        
        {/* Header Section */}
        <div className="mb-4">
          <h3 className="fw-bold m-0" style={{ color: "#2B3674" }}>Settings</h3>
          <p className="text-muted small">Manage your instructor profile and platform preferences</p>
        </div>

        <div className="row g-4">
          {/* Left Column: Profile & Teaching Setup */}
          <div className="col-lg-8">
            
            {/* Public Profile Card */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "25px" }}>
              <h5 className="fw-bold mb-4" style={{ color: "#2B3674" }}>Public Profile</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1 ms-1">Full Name</label>
                  <input 
                    className="form-control border-0 bg-light p-3 shadow-none" 
                    style={{ borderRadius: "12px" }} 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1 ms-1">Account Email (Locked)</label>
                  <div className="form-control border-0 bg-secondary-subtle p-3 d-flex justify-content-between align-items-center" 
                       style={{ borderRadius: "12px", cursor: "not-allowed", color: "#718096" }}>
                    {profile.email} <i className="bi bi-lock-fill"></i>
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <label className="small fw-bold text-muted mb-1 ms-1">Professional Bio</label>
                  <textarea 
                    className="form-control border-0 bg-light p-3 shadow-none" 
                    style={{ borderRadius: "12px", resize: "none" }} 
                    rows="3"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Teaching Preferences Card */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "25px" }}>
              <h5 className="fw-bold mb-4" style={{ color: "#2B3674" }}>Teaching Preferences</h5>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1 ms-1">Area of Expertise</label>
                  <input 
                    className="form-control border-0 bg-light p-3 shadow-none" 
                    style={{ borderRadius: "12px" }} 
                    value={profile.specialization}
                    onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-1 ms-1">Student Capacity (Per Course)</label>
                  <input 
                    type="number"
                    className="form-control border-0 bg-light p-3 shadow-none" 
                    style={{ borderRadius: "12px" }} 
                    value={profile.maxStudents}
                    onChange={(e) => setProfile({...profile, maxStudents: e.target.value})}
                  />
                </div>
                <div className="col-12 mt-2">
                  <label className="small fw-bold text-muted mb-1 ms-1">Availability for 1-on-1 Help</label>
                  <input 
                    className="form-control border-0 bg-light p-3 shadow-none" 
                    style={{ borderRadius: "12px" }} 
                    placeholder="e.g. Weekdays 4 PM - 5 PM"
                    value={profile.officeHours}
                    onChange={(e) => setProfile({...profile, officeHours: e.target.value})}
                  />
                </div>
              </div>

              <button className="btn btn-primary px-5 py-2 fw-bold mt-4 shadow-sm" 
                      style={{ backgroundColor: "#4318FF", borderRadius: "12px", border: "none" }}>
                Save Settings
              </button>
            </div>
          </div>

          {/* Right Column: Notifications & Security */}
          <div className="col-lg-4">
            
            {/* Notification Preferences */}
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "25px" }}>
              <h6 className="fw-bold mb-4" style={{ color: "#2B3674" }}>Notification Prefs</h6>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input shadow-none" type="checkbox" checked={notifications.enrollment} onChange={() => setNotifications({...notifications, enrollment: !notifications.enrollment})} />
                <label className="form-check-label small">New Enrollments</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input shadow-none" type="checkbox" checked={notifications.labActivity} onChange={() => setNotifications({...notifications, labActivity: !notifications.labActivity})} />
                <label className="form-check-label small">Lab Submissions</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input shadow-none" type="checkbox" checked={notifications.reminders} onChange={() => setNotifications({...notifications, reminders: !notifications.reminders})} />
                <label className="form-check-label small">System Updates</label>
              </div>
            </div>

            {/* FIXED Security Notice Card */}
            <div className="card border-0 shadow-sm p-4 text-center" style={{ borderRadius: "25px", background: "#fff" }}>
              {/* THE CIRCLE FIX: mx-auto centers it, fixed width/height prevents oval */}
              <div className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto" 
                   style={{ width: "60px", height: "60px" }}>
                <i className="bi bi-shield-lock-fill fs-4"></i>
              </div>
              
              <h6 className="fw-bold" style={{ color: "#2B3674" }}>Security Notice</h6>
              <p className="small text-muted mb-0 px-2">
                Email and password management is restricted to **Admin access only**.
              </p>
              
              <hr className="my-4 opacity-25" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettings;
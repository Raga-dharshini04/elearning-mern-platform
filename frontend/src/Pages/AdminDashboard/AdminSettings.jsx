import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { toast, Toaster } from "react-hot-toast";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [settings, setSettings] = useState({
    displayName: "",
    platformName: "",
    maintenanceMode: false,
    allowRegistration: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/settings");
      setSettings(res.data);
    } catch (err) {
      toast.error("Failed to load settings");
    }
  };

  const handleToggle = async (key, value) => {
    try {
      setSettings((prev) => ({ ...prev, [key]: value }));
      await axios.put("http://localhost:5000/api/admin/settings", { [key]: value });
      toast.success("Settings updated");
    } catch (err) {
      toast.error("Update failed");
      fetchSettings();
    }
  };

  const handleSaveGeneral = async () => {
    try {
      await axios.put("http://localhost:5000/api/admin/settings", {
        displayName: settings.displayName,
        platformName: settings.platformName
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const menuItems = [
    { id: "general", label: "General", color: "#FF5B5B" },
    { id: "platform", label: "Platform", color: "#0061FF" },
    { id: "security", label: "Security", color: "#A855F7" },
    { id: "danger", label: "Danger Zone", color: "#EF4444" },
  ];

  return (
    <div style={{ display: "flex", background: "#F4F7FE", minHeight: "100vh" }}>
      <Toaster />
      <Sidebar />

      <div style={{ marginLeft: "80px", padding: "40px", width: "100%" }}>
        <h2 className="fw-bold mb-5">Settings</h2>

        <div className="row g-4">
          <div className="col-md-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  cursor: "pointer",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  transition: "0.3s",
                  background: activeTab === item.id ? "#0061FF" : "transparent",
                  color: activeTab === item.id ? "#fff" : "#64748b",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>

          <div className="col-md-9">
            <div className="card border-0 shadow-sm p-5 rounded-4 bg-white" style={{ minHeight: '400px' }}>
              
              {/* 🔹 GENERAL TAB */}
              {activeTab === "general" && (
                <div className="animate__animated animate__fadeIn">
                  <h4 className="fw-bold mb-1">General Settings</h4>
                  <p className="text-muted small mb-4">Manage your administrative profile and platform identity.</p>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Display Name</label>
                    <input 
                      type="text" 
                      className="form-control border-0 bg-light p-3 rounded-3" 
                      value={settings.displayName}
                      onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Platform Name</label>
                    <input 
                      type="text" 
                      className="form-control border-0 bg-light p-3 rounded-3" 
                      value={settings.platformName}
                      onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                    />
                  </div>

                  <button 
                    className="btn btn-primary px-4 py-2 fw-bold" 
                    style={{ borderRadius: '10px', background: '#0061FF' }}
                    onClick={handleSaveGeneral}
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* 🔹 PLATFORM TAB */}
              {activeTab === "platform" && (
                <div className="animate__animated animate__fadeIn">
                  <h4 className="fw-bold mb-1">Platform Settings</h4>
                  <p className="text-muted small mb-5">Manage global accessibility and registration states.</p>

                  <div className="bg-light p-4 rounded-4 mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-0 fw-bold">Maintenance Mode</p>
                      <small className="text-muted">Restrict access to users during updates</small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleToggle("maintenanceMode", e.target.checked)}
                        style={{ width: "45px", height: "22px" }}
                      />
                    </div>
                  </div>

                  <div className="bg-light p-4 rounded-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-0 fw-bold">Allow Registration</p>
                      <small className="text-muted">Toggle new student/instructor signups</small>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={settings.allowRegistration}
                        onChange={(e) => handleToggle("allowRegistration", e.target.checked)}
                        style={{ width: "45px", height: "22px" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 🔹 SECURITY TAB */}
              {activeTab === "security" && (
                <div className="animate__animated animate__fadeIn text-center py-4">
                  <h4 className="fw-bold mb-1">Security Settings</h4>
                  <p className="text-muted small mb-5">Configure platform-wide security protocols.</p>
                  <button className="btn btn-outline-warning fw-bold px-4 py-3 rounded-4 w-100 mb-3">
                    Force Logout All Users
                  </button>
                  <button className="btn btn-outline-dark fw-bold px-4 py-3 rounded-4 w-100">
                    View System Audit Logs
                  </button>
                </div>
              )}

              {/* 🔹 DANGER ZONE TAB */}
              {activeTab === "danger" && (
                <div className="animate__animated animate__fadeIn">
                  <h4 className="fw-bold text-danger mb-1">Danger Zone</h4>
                  <p className="text-muted small mb-5">Irreversible actions that affect the entire database.</p>
                  <div className="border border-danger border-opacity-25 p-4 rounded-4">
                    <p className="fw-bold">Delete All Platform Data</p>
                    <p className="small text-muted mb-4">Once deleted, student records and course content cannot be recovered.</p>
                    <button className="btn btn-danger px-4 py-2 fw-bold" style={{ borderRadius: '10px' }}>
                      Purge Everything
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Instructor/Sidebar";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", gender: "" });

  const token = localStorage.getItem("token");

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/instructor/students", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/instructor/add-student", formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setShowForm(false);
      fetchStudents();
      setFormData({ name: "", email: "", password: "", gender: "" }); // Reset form
    } catch (err) {
      alert("Error adding student");
    }
  };

  return (
    <div style={{ display: "flex" }}> 
      <Sidebar />
      
      {/* ADDED marginLeft: "80px" and width: "100%" for perfect alignment */}
      <div style={{ 
        marginLeft: "80px", 
        padding: "30px", 
        backgroundColor: "#F4F7FE", 
        minHeight: "100vh", 
        width: "100%",
        flexGrow: 1 
      }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold m-0">Student Directory</h3>
            <p className="text-muted small">Manage and enroll new students into your platform</p>
          </div>
          <button className="btn px-4 py-2 fw-bold shadow-sm" 
                  style={{ backgroundColor: "#0061FF", color: "#fff", borderRadius: "12px" }}
                  onClick={() => setShowForm(true)}>
            + Add New Student
          </button>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: "25px", overflow: "hidden" }}>
          <table className="table m-0 align-middle">
            <thead className="bg-light">
              <tr className="text-muted small">
                <th className="px-4 py-3 border-0">STUDENT</th>
                <th className="border-0">STATUS</th>
                <th className="border-0">GENDER</th>
                <th className="text-end px-4 border-0">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">No students enrolled yet.</td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${s.name}&background=random&color=fff`} 
                          className="rounded-circle me-3" 
                          width="45" 
                          alt="avatar"
                        />
                        <div>
                          <div className="fw-bold" style={{ color: "#2B3674" }}>{s.name}</div>
                          <div className="text-muted small">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${s.isActive !== false ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                        {s.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-muted fw-medium">{s.gender || "N/A"}</td>
                    <td className="text-end px-4">
                       <button className="btn btn-sm fw-bold text-danger border-0">Deactivate</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Overlay */}
        {showForm && (
          <div style={modalOverlayStyle}>
            <div className="card p-4 border-0 shadow-lg" style={{ width: "450px", borderRadius: "30px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Add New Student</h4>
                <button className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <form onSubmit={handleAddStudent}>
                <label className="small fw-bold text-muted mb-1 ms-1">Full Name</label>
                <input className="form-control border-0 bg-light mb-3 p-3" style={{ borderRadius: "12px" }} placeholder="John Doe" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                
                <label className="small fw-bold text-muted mb-1 ms-1">Email Address</label>
                <input className="form-control border-0 bg-light mb-3 p-3" style={{ borderRadius: "12px" }} placeholder="student@example.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                
                <label className="small fw-bold text-muted mb-1 ms-1">Temporary Password</label>
                <input type="password" className="form-control border-0 bg-light mb-3 p-3" style={{ borderRadius: "12px" }} placeholder="••••••••" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                
                <label className="small fw-bold text-muted mb-1 ms-1">Gender</label>
                <select className="form-select border-0 bg-light mb-4 p-3" style={{ borderRadius: "12px" }} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light w-100 py-3 fw-bold" style={{ borderRadius: "12px" }} onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" style={{ backgroundColor: "#0061FF", borderRadius: "12px" }}>Enroll Student</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.2)", // Darkened slightly for better contrast
  backdropFilter: "blur(8px)",
  display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100
};

export default MyStudents;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminHome = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    instructors: [],
    studentCount: 0,
    courseCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetching all three counts for a complete overview
        const [instRes, studRes, courseRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/instructors"),
          axios.get("http://localhost:5000/api/admin/students/count"), // Ensure these endpoints exist
          axios.get("http://localhost:5000/api/admin/courses/count")
        ]);

        setData({
          instructors: instRes.data,
          studentCount: studRes.data.count || 0,
          courseCount: courseRes.data.count || 0
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin dashboard data", err);
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const chartData = {
    labels: ["Instructors", "Students", "Courses"],
    datasets: [{
      label: "Platform Growth",
      data: [data.instructors.length, data.studentCount, data.courseCount],
      backgroundColor: ["#4318FF", "#0F766E", "#7C3AED"],
      borderRadius: 10,
    }]
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#F8F9FD", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: "90px", padding: "35px", width: "100%" }}>
        
        {/* HEADER */}
        <div className="mb-5">
          <h3 className="fw-bold" style={{ color: "#2B3674", fontSize: "30px" }}>Hello HOD 👋</h3>
          <p className="text-muted">Academic Management Overview</p>
        </div>

        {/* UPDATED DYNAMIC SUMMARY CARDS */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px", background: "linear-gradient(135deg, #4318FF 0%, #707EFF 100%)", color: "white" }}>
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-25 p-3 rounded-3 me-3"><i className="bi bi-people-fill fs-3"></i></div>
                <div>
                  <h6 className="mb-0 opacity-75">Total Instructors</h6>
                  <h2 className="fw-bold mb-0">{data.instructors.length}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-3 me-3" style={{ backgroundColor: "#F4F7FE", color: "#4318FF" }}><i className="bi bi-mortarboard-fill fs-3"></i></div>
                <div>
                  <h6 className="text-muted mb-0">Total Students</h6>
                  <h2 className="fw-bold mb-0" style={{ color: "#2B3674" }}>{data.studentCount}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-3 me-3" style={{ backgroundColor: "#E6FFFA", color: "#0694a2" }}><i className="bi bi-book-half fs-3"></i></div>
                <div>
                  <h6 className="text-muted mb-0">Active Courses</h6>
                  <h2 className="fw-bold mb-0" style={{ color: "#2B3674" }}>{data.courseCount}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* CHART */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "20px" }}>
              <h5 className="fw-bold mb-4" style={{ color: "#2B3674" }}>Platform Overview</h5>
              <div style={{ height: "300px" }}>
                <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <h5 className="fw-bold mb-3" style={{ color: "#2B3674" }}>Quick Actions</h5>
              <div className="d-flex gap-3">
                <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/admin/instructors")}>+ Add Instructor</button>
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => navigate("/admin/reports")}>Analytics</button>
              </div>
            </div>
          </div>

          {/* RECENT LIST */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <h5 className="fw-bold mb-4" style={{ color: "#2B3674" }}>New Joiners</h5>
              {data.instructors.slice(-4).reverse().map((inst, i) => (
                <div key={i} className="d-flex align-items-center mb-3 p-2 rounded-3" style={{ backgroundColor: "#F4F7FE" }}>
                  <div className="bg-white rounded-circle p-2 me-3 shadow-sm" style={{ width: "40px", height: "40px", textAlign: "center" }}>
                    <i className="bi bi-person text-primary"></i>
                  </div>
                  <div>
                    <p className="mb-0 small fw-bold text-dark">{inst.name}</p>
                    <small className="text-muted" style={{ fontSize: "11px" }}>{inst.email}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
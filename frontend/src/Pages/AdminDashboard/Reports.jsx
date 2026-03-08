import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Reports = () => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0); // Added for real data
  const [courseCount, setCourseCount] = useState(0);   // Added for real data
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    fetchInstructors();
    fetchCounts(); // New call for students and courses
  }, []);

  const fetchCounts = async () => {
    try {
      const studentRes = await axios.get("http://localhost:5000/api/admin/students/count");
      const courseRes = await axios.get("http://localhost:5000/api/admin/courses/count");
      setStudentCount(studentRes.data.count);
      setCourseCount(courseRes.data.count);
    } catch (err) {
      console.log("Error fetching counts:", err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/instructors"
      );

      const instructors = res.data;

      setInstructorCount(instructors.length);

      // Monthly Growth
      const months = {};

      instructors.forEach((inst) => {
        if (inst.createdAt) {
          const month = new Date(inst.createdAt).toLocaleString("default", {
            month: "short"
          });

          months[month] = (months[month] || 0) + 1;
        }
      });

      setMonthlyData(months);

    } catch (err) {
      console.log("Error fetching instructors:", err);
    }
  };

  const barData = {
    labels: ["Students", "Instructors", "Courses"], // Updated labels
    datasets: [
      {
        label: "Platform Overview",
        data: [studentCount, instructorCount, courseCount], // Updated with real data
        backgroundColor: ["#10B981", "#6366F1", "#F59E0B"]  // Added colors for variety
      }
    ]
  };

  const lineData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Instructor Growth",
        data: Object.values(monthlyData),
        borderColor: "#10B981",
        backgroundColor: "#10B981",
        tension: 0.4
      }
    ]
  };

  return (
    <div style={{ display: "flex", background: "#F4F7FE", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ marginLeft: "80px", padding: "30px", width: "100%" }}>
        <div className="container-fluid">

          <h3 className="fw-bold mb-4">Reports & Analytics</h3>

          <div className="row mb-4">
            {/* Added Student Card */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                <h6 className="text-muted">Total Students</h6>
                <h2 className="fw-bold" style={{ color: "#10B981" }}>{studentCount}</h2>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                <h6 className="text-muted">Total Instructors</h6>
                <h2 className="fw-bold" style={{ color: "#6366F1" }}>{instructorCount}</h2>
              </div>
            </div>

            {/* Added Course Card */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
                <h6 className="text-muted">Total Courses</h6>
                <h2 className="fw-bold" style={{ color: "#F59E0B" }}>{courseCount}</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h5 className="mb-3 fw-bold">Platform Distribution</h5>
                <Bar data={barData} />
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h5 className="mb-3 fw-bold">Instructor Growth</h5>
                <Line data={lineData} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reports;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/my-courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div style={{ display: "flex", backgroundColor: "#F4F7FE", minHeight: "100vh" }}>
      <StudentSidebar />
      <div style={{ marginLeft: "80px", padding: "30px", width: "100%" }}>
        <h3 className="fw-bold mb-4" style={{ color: "#2B3674" }}>My Enrolled Courses</h3>
        
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-4" key={course._id}>
              <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: "20px" }}>
                <div className="bg-light rounded-4 mb-3 d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                  <i className={`bi ${course.icon || 'bi-journal-code'} fs-1 text-primary`}></i>
                </div>
                <h5 className="fw-bold">{course.title}</h5>
                <p className="text-muted small">Instructor: {course.instructorId?.name}</p>
                <button 
                  className="btn btn-primary w-100 rounded-pill fw-bold"
                  onClick={() => navigate(`/student/course/${course._id}`)}
                >
                  Enter Classroom
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
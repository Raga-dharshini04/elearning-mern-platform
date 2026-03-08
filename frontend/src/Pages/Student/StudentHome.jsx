import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [stats, setStats] = useState({ courseCount: 0, quizCount: 0, tasks: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const coursesRes = await axios.get("http://localhost:5000/api/student/my-courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(coursesRes.data);

        // Filter for today's live classes
        const todayStr = new Date().toISOString().split('T')[0];
        let meetings = [];
        coursesRes.data.forEach(course => {
          if (course.meetings) {
            const match = course.meetings.filter(m => 
              new Date(m.scheduledDate).toISOString().split('T')[0] === todayStr
            );
            meetings = [...meetings, ...match.map(m => ({ ...m, courseTitle: course.title }))];
          }
        });
        setTodayClasses(meetings);

        // RESTORED BACKEND STATS
        const statsRes = await axios.get("http://localhost:5000/api/student/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Load Error", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  return (
    <div style={{ display: "flex", backgroundColor: "#F8F9FD", minHeight: "100vh" }}>
      <StudentSidebar />
      <div style={{ marginLeft: "90px", padding: "35px", width: "100%" }}>
        
        {/* Header Section */}
        <div className="mb-5 d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold" style={{ color: "#2B3674", fontSize: "34px" }}>Main Dashboard</h3>
            <p className="text-muted mb-0">Hello, welcome back to your classroom!</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            {/* ALERT BOX FOR LIVE CLASS */}
            {todayClasses.length > 0 && todayClasses.map((cls, index) => (
              <div key={index} className="card border-0 shadow-sm p-4 mb-4" 
                   style={{ borderRadius: "20px", background: "linear-gradient(135deg, #4318FF 0%, #868CFF 100%)", color: "white" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-white text-primary rounded-pill mb-2 px-3">LIVE SESSION</span>
                    <h4 className="fw-bold mb-1">{cls.courseTitle}</h4>
                    <p className="mb-0 opacity-75">{cls.topic} • Starts at {cls.startTime}</p>
                  </div>
                  <a href={cls.meetLink} target="_blank" rel="noreferrer" className="btn btn-light rounded-pill px-4 fw-bold">
                    Join Now <i className="bi bi-camera-video-fill ms-2"></i>
                  </a>
                </div>
              </div>
            ))}

            {/* COURSE GRID */}
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h5 className="fw-bold m-0" style={{ color: "#2B3674" }}>Enrolled Courses</h5>
               <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">{courses.length} Active</span>
            </div>
            
            <div className="row g-4">
              {courses.map((course) => (
                <div className="col-md-6" key={course._id}>
                  <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "20px", transition: "0.3s" }}>
                    <div className="mb-3 d-flex align-items-center justify-content-center rounded-4" 
                         style={{ height: "140px", backgroundColor: "#F4F7FE" }}>
                        <i className={`bi ${course.icon || 'bi-laptop'} fs-1 text-primary`}></i>
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: "#2B3674" }}>{course.title}</h5>
                    <p className="text-muted small mb-4">Instructor: {course.instructorId?.name || "LMS Academy"}</p>
                    
                    <div className="progress mb-2" style={{ height: "6px", backgroundColor: "#E9EDF7", borderRadius: "10px" }}>
                      <div className="progress-bar" style={{ width: "20%", backgroundColor: "#4318FF", borderRadius: "10px" }}></div>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                       <small className="text-muted">Progress</small>
                       <small className="fw-bold text-primary">20%</small>
                    </div>

                    <button 
                      className="btn btn-primary w-100 fw-bold rounded-pill py-2 mt-auto"
                      style={{ backgroundColor: "#4318FF", border: "none", boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)" }}
                      onClick={() => navigate(`/student/course/${course._id}`)}
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR STATS */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "20px" }}>
              <h6 className="fw-bold mb-4" style={{ color: "#2B3674" }}>Learning Analysis</h6>
              
              <div className="d-flex align-items-center mb-4 p-3 rounded-4" style={{ backgroundColor: "#F4F7FE" }}>
                <div className="bg-white p-3 rounded-3 me-3 text-primary shadow-sm"><i className="bi bi-journal-text fs-4"></i></div>
                <div>
                  <h4 className="mb-0 fw-bold text-dark">{stats.courseCount}</h4>
                  <small className="text-muted">Total Courses</small>
                </div>
              </div>

              <div className="d-flex align-items-center p-3 rounded-4" style={{ backgroundColor: "#F0FFF4" }}>
                <div className="bg-white p-3 rounded-3 me-3 text-success shadow-sm"><i className="bi bi-patch-check fs-4"></i></div>
                <div>
                  <h4 className="mb-0 fw-bold text-dark">{stats.quizCount}</h4>
                  <small className="text-muted">Assessments Passed</small>
                </div>
              </div>
            </div>

            {/* TASKS CARD */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
              <h6 className="fw-bold mb-3" style={{ color: "#2B3674" }}>To-Do List</h6>
              {stats.tasks?.length > 0 ? stats.tasks.map((task, i) => (
                <div key={i} className="mb-3 p-2 rounded-3" style={{ borderLeft: "4px solid #4318FF", backgroundColor: "#F8F9FD" }}>
                  <p className="mb-0 small fw-bold text-dark">{task.title}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{task.courseName}</small>
                    <span className="badge rounded-pill bg-primary" style={{ fontSize: '9px' }}>{task.type}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4">
                   <i className="bi bi-check2-all fs-2 text-success opacity-50"></i>
                   <p className="text-muted small mt-2">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;